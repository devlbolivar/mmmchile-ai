-- Isolated follow-up module; existing landing tables and authentication settings are preserved.
create schema if not exists ac_private;
revoke all on schema ac_private from public,anon;
grant usage on schema ac_private to authenticated;
create table public.ac_members (
 id uuid primary key references auth.users(id),
 email text not null unique check (email = lower(email)),
 name text not null check (length(trim(name)) between 2 and 120),
 role text not null check (role in ('supervisor','visitador')),
 active boolean not null default true,
 created_at timestamptz not null default now()
);
create table public.ac_invitations (
 email text primary key check (email = lower(email)),
 name text not null check (length(trim(name)) between 2 and 120),
 role text not null check (role in ('supervisor','visitador')),
 invited_by uuid references public.ac_members(id),
 created_at timestamptz not null default now()
);
create table public.ac_people (
 id uuid primary key default gen_random_uuid(),
 name text not null check (length(trim(name)) between 2 and 120),
 phone text not null default '' check (length(phone)<=40),
 address text not null default '' check (length(address)<=250),
 kind text not null check (kind in ('Nuevo creyente','Acompañamiento')),
 status text not null default 'Pendiente' check (status in ('Pendiente','En seguimiento','Finalizado')),
 next_date date, consent boolean not null check (consent),
 created_by uuid not null references public.ac_members(id),
 assigned_to uuid references public.ac_members(id),
 created_at timestamptz not null default now(),
 check (status <> 'Finalizado' or next_date is null)
);
create table public.ac_visits (
 id uuid primary key default gen_random_uuid(),
 person_id uuid not null references public.ac_people(id),
 person_name text not null,
 created_by uuid not null references public.ac_members(id),
 author_name text not null,
 date date not null,
 visitor text not null check (length(trim(visitor)) between 2 and 120),
 result text not null check (result in ('Realizada','No se encontró','Reprogramada')),
 notes text not null default '' check (length(notes)<=2000),
 next_date date,
 created_at timestamptz not null default now(),
 check (next_date is null or next_date >= date)
);
create index ac_people_created_by on public.ac_people(created_by);
create index ac_people_assigned_to on public.ac_people(assigned_to);
create index ac_visits_author_date on public.ac_visits(created_by,date desc);
create index ac_visits_person on public.ac_visits(person_id);

create function ac_private.ac_is_active() returns boolean language sql stable security definer set search_path='' as $$
 select exists(select 1 from public.ac_members where id=(select auth.uid()) and active);
$$;
revoke all on function ac_private.ac_is_active() from public,anon;
grant execute on function ac_private.ac_is_active() to authenticated;
create function public.ac_is_active() returns boolean language sql security invoker set search_path='' as $$ select ac_private.ac_is_active(); $$;
create function ac_private.ac_is_supervisor() returns boolean language sql stable security definer set search_path='' as $$
 select exists(select 1 from public.ac_members where id=(select auth.uid()) and active and role='supervisor');
$$;
revoke all on function ac_private.ac_is_supervisor() from public,anon;
grant execute on function ac_private.ac_is_supervisor() to authenticated;
create function public.ac_is_supervisor() returns boolean language sql security invoker set search_path='' as $$ select ac_private.ac_is_supervisor(); $$;
create function ac_private.ac_can_access_person(p_id uuid) returns boolean language sql stable security definer set search_path='' as $$
 select public.ac_is_active() and exists(select 1 from public.ac_people p where p.id=p_id and
 (public.ac_is_supervisor() or p.created_by=(select auth.uid()) or p.assigned_to=(select auth.uid())));
$$;
revoke all on function ac_private.ac_can_access_person(uuid) from public,anon;
grant execute on function ac_private.ac_can_access_person(uuid) to authenticated;
create function public.ac_can_access_person(p_id uuid) returns boolean language sql security invoker set search_path='' as $$ select ac_private.ac_can_access_person(p_id); $$;

alter table public.ac_members enable row level security;
alter table public.ac_invitations enable row level security;
alter table public.ac_people enable row level security;
alter table public.ac_visits enable row level security;
-- Visitors may resolve names of active colleagues, but receive no roles or emails of other members.
create policy member_read on public.ac_members for select to authenticated using (id=(select auth.uid()) or public.ac_is_supervisor());
create policy invitation_read on public.ac_invitations for select to authenticated using (public.ac_is_supervisor());
create policy person_read on public.ac_people for select to authenticated using (public.ac_can_access_person(id));
create policy visit_read on public.ac_visits for select to authenticated using (public.ac_is_active() and (created_by=(select auth.uid()) or public.ac_is_supervisor()));
revoke all on public.ac_members,public.ac_invitations,public.ac_people,public.ac_visits from anon,authenticated;
grant select on public.ac_members,public.ac_invitations,public.ac_people,public.ac_visits to authenticated;
grant all on public.ac_members,public.ac_invitations,public.ac_people,public.ac_visits to service_role;

-- The authenticated user cannot supply the email or choose the assigned role.
create function ac_private.ac_accept_invitation() returns void language plpgsql security definer set search_path='' as $$
declare invitation public.ac_invitations; verified_email text;
begin
 if auth.uid() is null then raise exception 'authentication_required' using errcode='42501'; end if;
 if exists(select 1 from public.ac_members where id=auth.uid()) then return; end if;
 select lower(email) into verified_email from auth.users where id=auth.uid() and email_confirmed_at is not null;
 if verified_email is null then return; end if;
 select * into invitation from public.ac_invitations where email=verified_email for update;
 if not found then return; end if;
 insert into public.ac_members(id,email,name,role) values(auth.uid(),invitation.email,invitation.name,invitation.role);
 delete from public.ac_invitations where email=verified_email;
end; $$;
revoke all on function ac_private.ac_accept_invitation() from public,anon;
grant execute on function ac_private.ac_accept_invitation() to authenticated;
create function public.ac_accept_invitation() returns void language sql security invoker set search_path='' as $$ select ac_private.ac_accept_invitation(); $$;

create function ac_private.ac_directory() returns table(id uuid,name text) language sql stable security definer set search_path='' as $$
 select m.id,m.name from public.ac_members m where m.active and public.ac_is_active() order by m.name;
$$;
revoke all on function ac_private.ac_directory() from public,anon;
grant execute on function ac_private.ac_directory() to authenticated;
create function public.ac_directory() returns table(id uuid,name text) language sql security invoker set search_path='' as $$ select * from ac_private.ac_directory(); $$;
create function ac_private.ac_save_person(p_id uuid,p_data jsonb) returns uuid language plpgsql security definer set search_path='' as $$
declare target uuid; person public.ac_people; assigned uuid; permitted boolean;
begin
 if not public.ac_is_active() then raise exception 'access_denied' using errcode='42501'; end if;
 permitted:=public.ac_is_supervisor();
 assigned:=nullif(p_data->>'assignedTo','')::uuid;
 if assigned is not null and not exists(select 1 from public.ac_members where id=assigned and active) then raise exception 'invalid_assignee' using errcode='22023'; end if;
 if p_id is null then
  if not permitted and assigned is not null then raise exception 'supervisor_required' using errcode='42501'; end if;
  insert into public.ac_people(name,phone,address,kind,status,next_date,consent,created_by,assigned_to)
  values(trim(p_data->>'name'),coalesce(p_data->>'phone',''),coalesce(p_data->>'address',''),p_data->>'kind',p_data->>'status',nullif(p_data->>'nextDate','')::date,(p_data->>'consent')::boolean,auth.uid(),assigned)
  returning id into target;
 else
  select * into person from public.ac_people where id=p_id for update;
  if not found or not public.ac_can_access_person(p_id) then raise exception 'access_denied' using errcode='42501'; end if;
  if not permitted and assigned is distinct from person.assigned_to then raise exception 'supervisor_required' using errcode='42501'; end if;
  update public.ac_people set name=trim(p_data->>'name'),phone=coalesce(p_data->>'phone',''),address=coalesce(p_data->>'address',''),kind=p_data->>'kind',status=p_data->>'status',next_date=nullif(p_data->>'nextDate','')::date,consent=(p_data->>'consent')::boolean,assigned_to=assigned where id=p_id;
  target:=p_id;
 end if;
 return target;
end; $$;
revoke all on function ac_private.ac_save_person(uuid,jsonb) from public,anon;
grant execute on function ac_private.ac_save_person(uuid,jsonb) to authenticated;
create function public.ac_save_person(p_id uuid,p_data jsonb) returns uuid language sql security invoker set search_path='' as $$ select ac_private.ac_save_person(p_id,p_data); $$;

create function ac_private.ac_record_visit(p_data jsonb) returns uuid language plpgsql security definer set search_path='' as $$
declare person public.ac_people; author public.ac_members; result_id uuid; visit_date date;
begin
 select * into author from public.ac_members where id=auth.uid() and active;
 if not found then raise exception 'access_denied' using errcode='42501'; end if;
 select * into person from public.ac_people where id=(p_data->>'personId')::uuid for update;
 if not found or not public.ac_can_access_person(person.id) then raise exception 'access_denied' using errcode='42501'; end if;
 if person.status='Finalizado' then raise exception 'followup_closed' using errcode='22023'; end if;
 visit_date:=(p_data->>'date')::date;
 if visit_date > (now() at time zone 'America/Santiago')::date then raise exception 'future_visit' using errcode='22023'; end if;
 insert into public.ac_visits(person_id,person_name,created_by,author_name,date,visitor,result,notes,next_date)
 values(person.id,person.name,auth.uid(),author.name,visit_date,trim(p_data->>'visitor'),p_data->>'result',coalesce(p_data->>'notes',''),nullif(p_data->>'nextDate','')::date) returning id into result_id;
 update public.ac_people set status='En seguimiento',next_date=nullif(p_data->>'nextDate','')::date where id=person.id;
 return result_id;
end; $$;
revoke all on function ac_private.ac_record_visit(jsonb) from public,anon;
grant execute on function ac_private.ac_record_visit(jsonb) to authenticated;
create function public.ac_record_visit(p_data jsonb) returns uuid language sql security invoker set search_path='' as $$ select ac_private.ac_record_visit(p_data); $$;

create function ac_private.ac_prepare_invitation(p_email text,p_name text,p_role text) returns void language plpgsql security definer set search_path='' as $$
begin
 if not public.ac_is_supervisor() then raise exception 'supervisor_required' using errcode='42501'; end if;
 if exists(select 1 from public.ac_members where email=lower(trim(p_email))) then raise exception 'member_exists' using errcode='22023'; end if;
 insert into public.ac_invitations(email,name,role,invited_by) values(lower(trim(p_email)),trim(p_name),p_role,auth.uid())
 on conflict(email) do update set name=excluded.name,role=excluded.role,invited_by=excluded.invited_by,created_at=now();
end; $$;
revoke all on function ac_private.ac_prepare_invitation(text,text,text) from public,anon;
grant execute on function ac_private.ac_prepare_invitation(text,text,text) to authenticated;
create function public.ac_prepare_invitation(p_email text,p_name text,p_role text) returns void language sql security invoker set search_path='' as $$ select ac_private.ac_prepare_invitation(p_email,p_name,p_role); $$;
create function ac_private.ac_cancel_invitation(p_email text) returns void language plpgsql security definer set search_path='' as $$
begin
 if not public.ac_is_supervisor() then raise exception 'supervisor_required' using errcode='42501'; end if;
 delete from public.ac_invitations where email=lower(trim(p_email));
end; $$;
revoke all on function ac_private.ac_cancel_invitation(text) from public,anon;
grant execute on function ac_private.ac_cancel_invitation(text) to authenticated;
create function public.ac_cancel_invitation(p_email text) returns void language sql security invoker set search_path='' as $$ select ac_private.ac_cancel_invitation(p_email); $$;
create function ac_private.ac_update_member(p_id uuid,p_role text,p_active boolean) returns void language plpgsql security definer set search_path='' as $$
begin
 -- Serialize role changes; a supervisor cannot demote/deactivate their own account.
 perform pg_advisory_xact_lock(194621089);
 if not public.ac_is_supervisor() or p_id=auth.uid() then raise exception 'access_denied' using errcode='42501'; end if;
 if p_role not in ('supervisor','visitador') or p_active is null then raise exception 'invalid_role' using errcode='22023'; end if;
 update public.ac_members set role=p_role,active=p_active where id=p_id;
 if not found then raise exception 'member_missing' using errcode='22023'; end if;
 -- Release assignments so the supervisor can redistribute unfinished follow-ups.
 if not p_active then update public.ac_people set assigned_to=null where assigned_to=p_id; end if;
end; $$;
revoke all on function ac_private.ac_update_member(uuid,text,boolean) from public,anon;
grant execute on function ac_private.ac_update_member(uuid,text,boolean) to authenticated;
create function public.ac_update_member(p_id uuid,p_role text,p_active boolean) returns void language sql security invoker set search_path='' as $$ select ac_private.ac_update_member(p_id,p_role,p_active); $$;

revoke all on function public.ac_is_active(),public.ac_is_supervisor(),public.ac_can_access_person(uuid),public.ac_accept_invitation(),public.ac_directory(),public.ac_save_person(uuid,jsonb),public.ac_record_visit(jsonb),public.ac_prepare_invitation(text,text,text),public.ac_cancel_invitation(text),public.ac_update_member(uuid,text,boolean) from public,anon;
grant execute on function public.ac_is_active(),public.ac_is_supervisor(),public.ac_can_access_person(uuid),public.ac_accept_invitation(),public.ac_directory(),public.ac_save_person(uuid,jsonb),public.ac_record_visit(jsonb),public.ac_prepare_invitation(text,text,text),public.ac_cancel_invitation(text),public.ac_update_member(uuid,text,boolean) to authenticated;

-- Prayer moderation is a separate privilege; inviting a visitor must never grant it.
create table ac_private.prayer_moderators (
 user_id uuid primary key references auth.users(id), active boolean not null default true
);
alter table ac_private.prayer_moderators enable row level security;
revoke all on ac_private.prayer_moderators from public,anon,authenticated;
grant all on ac_private.prayer_moderators to service_role;
create function ac_private.can_moderate_prayers() returns boolean language sql stable security definer set search_path='' as $$
 select auth.uid() is not null and exists(select 1 from ac_private.prayer_moderators where user_id=(select auth.uid()) and active);
$$;
revoke all on function ac_private.can_moderate_prayers() from public,anon;
grant execute on function ac_private.can_moderate_prayers() to authenticated;
create function public.ac_can_moderate_prayers() returns boolean language sql security invoker set search_path='' as $$
 select ac_private.can_moderate_prayers();
$$;
revoke all on function public.ac_can_moderate_prayers() from public,anon;
grant execute on function public.ac_can_moderate_prayers() to authenticated;

-- Group leaders: additive columns, existing members retain their roles.
alter table public.ac_members drop constraint ac_members_role_check;
alter table public.ac_members add constraint ac_members_role_check check (role in ('supervisor','lider','visitador'));
alter table public.ac_invitations drop constraint ac_invitations_role_check;
alter table public.ac_invitations add constraint ac_invitations_role_check check (role in ('supervisor','lider','visitador'));
alter table public.ac_members add column leadership_group text check (leadership_group in ('jovenes','hombres_adultos','mujeres_adultas'));
alter table public.ac_invitations add column leadership_group text check (leadership_group in ('jovenes','hombres_adultos','mujeres_adultas'));
alter table public.ac_members add constraint ac_members_leadership_scope check (
 (role='lider' and leadership_group is not null) or (role<>'lider' and leadership_group is null));
alter table public.ac_invitations add constraint ac_invitations_leadership_scope check (
 (role='lider' and leadership_group is not null) or (role<>'lider' and leadership_group is null));
alter table public.ac_members add constraint ac_members_leader_visiting_category check (
 role<>'lider' or visit_category is null or
 case when visit_category in ('joven_masculino','joven_femenino') then 'jovenes'
      when visit_category='adulto_masculino' then 'hombres_adultos'
      when visit_category='adulto_femenino' then 'mujeres_adultas' end = leadership_group);
alter table public.ac_invitations add constraint ac_invitations_leader_visiting_category check (
 role<>'lider' or visit_category is null or
 case when visit_category in ('joven_masculino','joven_femenino') then 'jovenes'
      when visit_category='adulto_masculino' then 'hombres_adultos'
      when visit_category='adulto_femenino' then 'mujeres_adultas' end = leadership_group);

create function ac_private.ac_group_for(p_age text,p_sex text) returns text
language sql immutable security invoker set search_path='' as $$
 select case when p_age='Joven' and p_sex in ('Masculino','Femenino') then 'jovenes'
 when p_age='Adulto' and p_sex='Masculino' then 'hombres_adultos'
 when p_age='Adulto' and p_sex='Femenino' then 'mujeres_adultas' end;
$$;
create function ac_private.ac_leads_classification(p_age text,p_sex text) returns boolean
language sql stable security definer set search_path='' as $$
 select exists(select 1 from public.ac_members m where m.id=(select auth.uid())
 and m.active and m.role='lider' and m.leadership_group=ac_private.ac_group_for(p_age,p_sex));
$$;
revoke all on function ac_private.ac_group_for(text,text),ac_private.ac_leads_classification(text,text) from public,anon;
grant execute on function ac_private.ac_group_for(text,text),ac_private.ac_leads_classification(text,text) to authenticated;

create or replace function ac_private.ac_can_access_person(p_id uuid) returns boolean
language sql stable security definer set search_path='' as $$
 select exists(select 1 from public.ac_people p cross join public.ac_members m
 where p.id=p_id and m.id=(select auth.uid()) and m.active and
 (m.role='supervisor'
 or (m.role='lider' and m.leadership_group=ac_private.ac_group_for(p.age_group,p.sex))
 or (m.role='visitador' and (p.created_by=m.id or p.assigned_to=m.id))));
$$;
create function ac_private.ac_can_read_visit(p_person_id uuid,p_author uuid) returns boolean
language sql stable security definer set search_path='' as $$
 select exists(select 1 from public.ac_members m where m.id=(select auth.uid()) and m.active
 and (m.role='supervisor' or (m.role='visitador' and p_author=m.id)
 or (m.role='lider' and exists(select 1 from public.ac_people p where p.id=p_person_id
 and m.leadership_group=ac_private.ac_group_for(p.age_group,p.sex)))));
$$;
create function public.ac_can_read_visit(p_person_id uuid,p_author uuid) returns boolean
language sql stable security invoker set search_path='' as $$
 select ac_private.ac_can_read_visit(p_person_id,p_author);
$$;
revoke all on function ac_private.ac_can_read_visit(uuid,uuid),public.ac_can_read_visit(uuid,uuid) from public,anon;
grant execute on function ac_private.ac_can_read_visit(uuid,uuid),public.ac_can_read_visit(uuid,uuid) to authenticated;
alter policy visit_read on public.ac_visits using (public.ac_can_read_visit(person_id,created_by));

create or replace function ac_private.ac_save_person(p_id uuid,p_data jsonb) returns uuid language plpgsql security definer set search_path='' as $$
declare target uuid; person public.ac_people; assigned uuid; permitted boolean; supervisor boolean;
begin
 perform pg_advisory_xact_lock(194621089);
 if not public.ac_is_active() then raise exception 'access_denied' using errcode='42501'; end if;
 if coalesce(p_data->>'ageGroup','') not in ('Joven','Adulto') or coalesce(p_data->>'sex','') not in ('Masculino','Femenino') then raise exception 'classification_required' using errcode='22023'; end if;
 supervisor:=public.ac_is_supervisor();
 permitted:=supervisor or ac_private.ac_leads_classification(p_data->>'ageGroup',p_data->>'sex');
 assigned:=nullif(p_data->>'assignedTo','')::uuid;
 if assigned is not null and not exists(select 1 from public.ac_members where id=assigned and active and visit_category=lower(p_data->>'ageGroup')||'_'||lower(p_data->>'sex')) then raise exception 'invalid_assignee' using errcode='22023'; end if;
 if p_id is null then
  if not permitted and assigned is not null then raise exception 'supervisor_required' using errcode='42501'; end if;
  insert into public.ac_people(name,phone,address,kind,status,next_date,consent,created_by,assigned_to,age_group,sex)
  values(trim(p_data->>'name'),coalesce(p_data->>'phone',''),coalesce(p_data->>'address',''),p_data->>'kind',p_data->>'status',nullif(p_data->>'nextDate','')::date,(p_data->>'consent')::boolean,auth.uid(),assigned,p_data->>'ageGroup',p_data->>'sex')
  returning id into target;
 else
  select * into person from public.ac_people where id=p_id for update;
  if not found or not public.ac_can_access_person(p_id) then raise exception 'access_denied' using errcode='42501'; end if;
  if not supervisor and (person.age_group is distinct from p_data->>'ageGroup' or person.sex is distinct from p_data->>'sex') then
   raise exception 'classification_change_requires_supervisor' using errcode='42501';
  end if;
  if not permitted and assigned is distinct from person.assigned_to then raise exception 'supervisor_required' using errcode='42501'; end if;
  update public.ac_people set name=trim(p_data->>'name'),phone=coalesce(p_data->>'phone',''),address=coalesce(p_data->>'address',''),kind=p_data->>'kind',status=p_data->>'status',next_date=nullif(p_data->>'nextDate','')::date,consent=(p_data->>'consent')::boolean,assigned_to=assigned,age_group=p_data->>'ageGroup',sex=p_data->>'sex' where id=p_id;
  target:=p_id;
 end if;
 return target;
end; $$;


create or replace function ac_private.ac_record_visit(p_data jsonb) returns uuid language plpgsql security definer set search_path='' as $$
declare person public.ac_people; author public.ac_members; result_id uuid; visit_date date;
begin
 perform pg_advisory_xact_lock(194621089);
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

create or replace function ac_private.ac_accept_invitation() returns void language plpgsql security definer set search_path='' as $$
declare invitation public.ac_invitations; verified_email text;
begin
 if auth.uid() is null then raise exception 'authentication_required' using errcode='42501'; end if;
 if exists(select 1 from public.ac_members where id=auth.uid()) then return; end if;
 select lower(email) into verified_email from auth.users where id=auth.uid() and email_confirmed_at is not null;
 if verified_email is null then return; end if;
 select * into invitation from public.ac_invitations where email=verified_email for update;
 if not found then return; end if;
 insert into public.ac_members(id,email,name,role,visit_category,leadership_group) values(auth.uid(),invitation.email,invitation.name,invitation.role,invitation.visit_category,invitation.leadership_group);
 delete from public.ac_invitations where email=verified_email;
end; $$;


create function ac_private.ac_prepare_team_invitation(p_email text,p_name text,p_role text,p_category text,p_leadership_group text)
returns void language plpgsql security definer set search_path='' as $$
begin
 perform pg_advisory_xact_lock(194621089);
 if not public.ac_is_supervisor() then raise exception 'supervisor_required' using errcode='42501'; end if;
 if exists(select 1 from public.ac_members where email=lower(trim(p_email))) then raise exception 'member_exists' using errcode='22023'; end if;
 insert into public.ac_invitations(email,name,role,visit_category,leadership_group,invited_by)
 values(lower(trim(p_email)),trim(p_name),p_role,p_category,p_leadership_group,auth.uid())
 on conflict(email) do update set name=excluded.name,role=excluded.role,
 visit_category=excluded.visit_category,leadership_group=excluded.leadership_group,
 invited_by=excluded.invited_by,created_at=now();
end; $$;
create function public.ac_prepare_team_invitation(p_email text,p_name text,p_role text,p_category text,p_leadership_group text)
returns void language sql security invoker set search_path='' as $$
 select ac_private.ac_prepare_team_invitation(p_email,p_name,p_role,p_category,p_leadership_group);
$$;
create function ac_private.ac_update_team_member(p_id uuid,p_role text,p_active boolean,p_category text,p_leadership_group text)
returns integer language plpgsql security definer set search_path='' as $$
declare member public.ac_members; released integer;
begin
 perform pg_advisory_xact_lock(194621089);
 if not public.ac_is_supervisor() then raise exception 'access_denied' using errcode='42501'; end if;
 select * into member from public.ac_members where id=p_id for update;
 if not found then raise exception 'member_missing' using errcode='22023'; end if;
 if p_role is null or p_role not in ('supervisor','lider','visitador') or p_active is null then raise exception 'invalid_role' using errcode='22023'; end if;
 if p_id=auth.uid() and (p_role is distinct from member.role or p_active is distinct from member.active or p_leadership_group is distinct from member.leadership_group) then raise exception 'access_denied' using errcode='42501'; end if;
 update public.ac_members set role=p_role,active=p_active,visit_category=p_category,leadership_group=p_leadership_group where id=p_id;
 update public.ac_people set assigned_to=null where assigned_to=p_id and
 (not p_active
 or (age_group is not null and (lower(age_group)||'_'||lower(sex)) is distinct from p_category)
 or (p_role='lider' and ac_private.ac_group_for(age_group,sex) is distinct from p_leadership_group));
 get diagnostics released = row_count;
 return released;
end; $$;
create function public.ac_update_team_member(p_id uuid,p_role text,p_active boolean,p_category text,p_leadership_group text)
returns integer language sql security invoker set search_path='' as $$
 select ac_private.ac_update_team_member(p_id,p_role,p_active,p_category,p_leadership_group);
$$;
revoke all on function ac_private.ac_prepare_team_invitation(text,text,text,text,text),public.ac_prepare_team_invitation(text,text,text,text,text),ac_private.ac_update_team_member(uuid,text,boolean,text,text),public.ac_update_team_member(uuid,text,boolean,text,text) from public,anon;
grant execute on function ac_private.ac_prepare_team_invitation(text,text,text,text,text),public.ac_prepare_team_invitation(text,text,text,text,text),ac_private.ac_update_team_member(uuid,text,boolean,text,text),public.ac_update_team_member(uuid,text,boolean,text,text) to authenticated;

-- Older clients keep working for their two original roles; no alternate RPC bypasses scope validation.
create or replace function ac_private.ac_prepare_invitation(p_email text,p_name text,p_role text)
returns void language sql security definer set search_path='' as $$
 select ac_private.ac_prepare_team_invitation(p_email,p_name,p_role,null,null);
$$;
create or replace function ac_private.ac_prepare_classified_invitation(p_email text,p_name text,p_role text,p_category text)
returns void language sql security definer set search_path='' as $$
 select ac_private.ac_prepare_team_invitation(p_email,p_name,p_role,p_category,null);
$$;
create or replace function ac_private.ac_update_member_assignment(p_id uuid,p_role text,p_active boolean,p_category text)
returns integer language plpgsql security definer set search_path='' as $$
declare scope text;
begin
 perform pg_advisory_xact_lock(194621089);
 select case when p_role='lider' then leadership_group else null end into scope from public.ac_members where id=p_id;
 return ac_private.ac_update_team_member(p_id,p_role,p_active,p_category,scope);
end; $$;
create or replace function ac_private.ac_update_member(p_id uuid,p_role text,p_active boolean)
returns void language plpgsql security definer set search_path='' as $$
declare member public.ac_members;
begin
 perform pg_advisory_xact_lock(194621089);
 select * into member from public.ac_members where id=p_id;
 perform ac_private.ac_update_team_member(p_id,p_role,p_active,member.visit_category,case when p_role='lider' then member.leadership_group else null end);
end; $$;

-- Deploy together with the classification UI: saves now require Grupo and Sexo.
-- NULL preserves unknown demographics and existing assignments; no history is changed.
alter table public.ac_people
 add column age_group text check (age_group in ('Joven','Adulto')),
 add column sex text check (sex in ('Masculino','Femenino')),
 add constraint ac_people_classification_pair check ((age_group is null) = (sex is null));
alter table public.ac_members add column visit_category text check (visit_category in ('joven_masculino','joven_femenino','adulto_masculino','adulto_femenino'));
alter table public.ac_invitations add column visit_category text check (visit_category in ('joven_masculino','joven_femenino','adulto_masculino','adulto_femenino'));

create or replace function ac_private.ac_save_person(p_id uuid,p_data jsonb) returns uuid language plpgsql security definer set search_path='' as $$
declare target uuid; person public.ac_people; assigned uuid; permitted boolean;
begin
 perform pg_advisory_xact_lock(194621089);
 if not public.ac_is_active() then raise exception 'access_denied' using errcode='42501'; end if;
 if coalesce(p_data->>'ageGroup','') not in ('Joven','Adulto') or coalesce(p_data->>'sex','') not in ('Masculino','Femenino') then raise exception 'classification_required' using errcode='22023'; end if;
 permitted:=public.ac_is_supervisor();
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
  if not permitted and assigned is distinct from person.assigned_to then raise exception 'supervisor_required' using errcode='42501'; end if;
  update public.ac_people set name=trim(p_data->>'name'),phone=coalesce(p_data->>'phone',''),address=coalesce(p_data->>'address',''),kind=p_data->>'kind',status=p_data->>'status',next_date=nullif(p_data->>'nextDate','')::date,consent=(p_data->>'consent')::boolean,assigned_to=assigned,age_group=p_data->>'ageGroup',sex=p_data->>'sex' where id=p_id;
  target:=p_id;
 end if;
 return target;
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
 insert into public.ac_members(id,email,name,role,visit_category) values(auth.uid(),invitation.email,invitation.name,invitation.role,invitation.visit_category);
 delete from public.ac_invitations where email=verified_email;
end; $$;

create function ac_private.ac_assignment_directory() returns table(id uuid,name text,visit_category text)
language sql stable security definer set search_path='' as $$
 select m.id,m.name,m.visit_category from public.ac_members m
 where m.active and public.ac_is_active() order by m.name;
$$;
create function public.ac_assignment_directory() returns table(id uuid,name text,visit_category text)
language sql security invoker set search_path='' as $$ select * from ac_private.ac_assignment_directory(); $$;

create function ac_private.ac_prepare_classified_invitation(p_email text,p_name text,p_role text,p_category text)
returns void language plpgsql security definer set search_path='' as $$
begin
 perform ac_private.ac_prepare_invitation(p_email,p_name,p_role);
 update public.ac_invitations set visit_category=p_category where email=lower(trim(p_email));
end; $$;
create function public.ac_prepare_classified_invitation(p_email text,p_name text,p_role text,p_category text)
returns void language sql security invoker set search_path='' as $$
 select ac_private.ac_prepare_classified_invitation(p_email,p_name,p_role,p_category);
$$;

create function ac_private.ac_update_member_assignment(p_id uuid,p_role text,p_active boolean,p_category text)
returns integer language plpgsql security definer set search_path='' as $$
declare member public.ac_members; released integer;
begin
 perform pg_advisory_xact_lock(194621089);
 if not public.ac_is_supervisor() then raise exception 'access_denied' using errcode='42501'; end if;
 select * into member from public.ac_members where id=p_id for update;
 if not found then raise exception 'member_missing' using errcode='22023'; end if;
 if p_role is null or p_role not in ('supervisor','visitador') or p_active is null then raise exception 'invalid_role' using errcode='22023'; end if;
 if p_id=auth.uid() and (p_role is distinct from member.role or p_active is distinct from member.active) then raise exception 'access_denied' using errcode='42501'; end if;
 update public.ac_members set role=p_role,active=p_active,visit_category=p_category where id=p_id;
 -- Existing unclassified fichas keep their assignment until explicitly classified.
 -- Classified incompatible fichas need reassignment when a member changes team.
 update public.ac_people set assigned_to=null where assigned_to=p_id and
 (not p_active or (age_group is not null and (lower(age_group)||'_'||lower(sex)) is distinct from p_category));
 get diagnostics released = row_count;
 return released;
end; $$;
create function public.ac_update_member_assignment(p_id uuid,p_role text,p_active boolean,p_category text)
returns integer language sql security invoker set search_path='' as $$
 select ac_private.ac_update_member_assignment(p_id,p_role,p_active,p_category);
$$;
revoke all on function ac_private.ac_assignment_directory(),ac_private.ac_prepare_classified_invitation(text,text,text,text),ac_private.ac_update_member_assignment(uuid,text,boolean,text),public.ac_assignment_directory(),public.ac_prepare_classified_invitation(text,text,text,text),public.ac_update_member_assignment(uuid,text,boolean,text) from public,anon;
grant execute on function ac_private.ac_assignment_directory(),ac_private.ac_prepare_classified_invitation(text,text,text,text),ac_private.ac_update_member_assignment(uuid,text,boolean,text),public.ac_assignment_directory(),public.ac_prepare_classified_invitation(text,text,text,text),public.ac_update_member_assignment(uuid,text,boolean,text) to authenticated;

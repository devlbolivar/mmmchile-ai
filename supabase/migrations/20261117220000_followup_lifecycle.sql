-- Apply before deploying the application. Existing records and visit history are preserved.
-- Keep the stored 'Pendiente' value for compatibility; the UI displays 'Pendiente de contacto'.
begin;
alter table public.ac_people add column archive_reason text not null default '';
alter table public.ac_people drop constraint ac_people_status_check;
alter table public.ac_people add constraint ac_people_status_check check (status in ('Pendiente','Esperando respuesta','Visita aceptada','En seguimiento','Finalizado','Archivado'));
alter table public.ac_people add constraint ac_people_archive_reason_check check (
 (status <> 'Archivado' and archive_reason = '') or
 (status = 'Archivado' and next_date is null and archive_reason in ('No desea visitas ni seguimiento','Solicitó no ser contactada','No se logró establecer contacto','Traslado o derivación a otra iglesia','Registro duplicado o creado por error','Otro motivo'))
);
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
  insert into public.ac_people(name,phone,address,kind,status,next_date,consent,created_by,assigned_to,age_group,sex,archive_reason)
  values(trim(p_data->>'name'),coalesce(p_data->>'phone',''),coalesce(p_data->>'address',''),p_data->>'kind',p_data->>'status',nullif(p_data->>'nextDate','')::date,(p_data->>'consent')::boolean,auth.uid(),assigned,p_data->>'ageGroup',p_data->>'sex',case when p_data->>'status'='Archivado' then coalesce(p_data->>'archiveReason','') else '' end)
  returning id into target;
 else
  select * into person from public.ac_people where id=p_id for update;
  if not found or not public.ac_can_access_person(p_id) then raise exception 'access_denied' using errcode='42501'; end if;
  if person.status='Archivado' and person.archive_reason='Solicitó no ser contactada' and p_data->>'status'<>'Archivado' and not coalesce((p_data->>'restoreConsent')::boolean,false) then raise exception 'contact_consent_required' using errcode='22023'; end if;
  if not supervisor and (person.age_group is distinct from p_data->>'ageGroup' or person.sex is distinct from p_data->>'sex') then
   raise exception 'classification_change_requires_supervisor' using errcode='42501';
  end if;
  if not permitted and assigned is distinct from person.assigned_to then raise exception 'supervisor_required' using errcode='42501'; end if;
  update public.ac_people set name=trim(p_data->>'name'),phone=coalesce(p_data->>'phone',''),address=coalesce(p_data->>'address',''),kind=p_data->>'kind',status=p_data->>'status',next_date=nullif(p_data->>'nextDate','')::date,consent=(p_data->>'consent')::boolean,assigned_to=assigned,age_group=p_data->>'ageGroup',sex=p_data->>'sex',archive_reason=case when p_data->>'status'='Archivado' then coalesce(p_data->>'archiveReason','') else '' end where id=p_id;
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
 if person.status in ('Finalizado','Archivado') then raise exception 'followup_closed' using errcode='22023'; end if;
 visit_date:=(p_data->>'date')::date;
 if visit_date > (now() at time zone 'America/Santiago')::date then raise exception 'future_visit' using errcode='22023'; end if;
 insert into public.ac_visits(person_id,person_name,created_by,author_name,date,visitor,result,notes,next_date)
 values(person.id,person.name,auth.uid(),author.name,visit_date,trim(p_data->>'visitor'),p_data->>'result',coalesce(p_data->>'notes',''),nullif(p_data->>'nextDate','')::date) returning id into result_id;
 update public.ac_people set status='En seguimiento',next_date=nullif(p_data->>'nextDate','')::date where id=person.id;
 return result_id;
end; $$;


commit;

-- Append-only activity. No backfill: existing data keeps its original meaning.
create table public.ac_activity (
 id uuid primary key default gen_random_uuid(),
 created_at timestamptz not null default clock_timestamp(),
 actor_id uuid,
 actor_name text not null,
 action text not null check (action in ('access.login','access.logout','person.created','person.updated','person.assigned','visit.created','member.created','member.updated','invitation.prepared','invitation.updated','invitation.accepted','invitation.cancelled','invitation.mail_sent','invitation.mail_failed')),
 target_id text,
 target_name text,
 details jsonb not null default '{}'::jsonb,
 session_id uuid,
 unique(actor_id,session_id,action)
);
create index ac_activity_date on public.ac_activity(created_at desc,id desc);
create index ac_activity_actor_date on public.ac_activity(actor_id,created_at desc,id desc);
create index ac_activity_action_date on public.ac_activity(action,created_at desc,id desc);
alter table public.ac_activity enable row level security;
revoke all on public.ac_activity from public,anon,authenticated,service_role;
grant select on public.ac_activity to authenticated,service_role;
create policy activity_supervisor_read on public.ac_activity for select to authenticated
 using ((select public.ac_is_supervisor()));

-- Trigger-only writer: callers cannot supply arbitrary events or an actor.
create function ac_private.ac_capture_activity() returns trigger
language plpgsql security definer set search_path='' as $$
declare
 actor uuid:=auth.uid(); actor_label text;
 event text; target text; target_label text; info jsonb:='{}'::jsonb;
 before_row jsonb; after_row jsonb; changed jsonb;
begin
 select name into actor_label from public.ac_members where id=actor;
 actor_label:=coalesce(actor_label,'Sistema / administración BD');
 if tg_table_name='ac_people' then
  target:=new.id::text; target_label:=new.name;
  if tg_op='INSERT' then
   event:='person.created';
  else
   select coalesce(jsonb_agg(n.key order by n.key),'[]'::jsonb) into changed
   from jsonb_each(to_jsonb(new)) n where n.value is distinct from to_jsonb(old)->n.key;
   if changed='[]'::jsonb then return new; end if;
   info:=jsonb_build_object('fields',changed);
   event:=case when new.assigned_to is distinct from old.assigned_to then 'person.assigned' else 'person.updated' end;
  end if;
  if (tg_op='INSERT' and new.assigned_to is not null) or
     (tg_op='UPDATE' and new.assigned_to is distinct from old.assigned_to) then
   info:=info||jsonb_build_object(
    'previous_assignee',case when tg_op='UPDATE' then (select name from public.ac_members where id=old.assigned_to) end,
    'new_assignee',(select name from public.ac_members where id=new.assigned_to));
  end if;
 elsif tg_table_name='ac_visits' then
  event:='visit.created';target:=new.id::text;target_label:=new.person_name;
  info:=jsonb_build_object('person_id',new.person_id);
 elsif tg_table_name='ac_members' then
  target:=new.id::text;target_label:=new.name;
  after_row:=jsonb_build_object('role',new.role,'active',new.active,'visit_category',new.visit_category,'leadership_group',new.leadership_group);
  if tg_op='INSERT' then event:='member.created';info:=jsonb_build_object('after',after_row);
  else
   before_row:=jsonb_build_object('role',old.role,'active',old.active,'visit_category',old.visit_category,'leadership_group',old.leadership_group);
   if before_row=after_row then return new; end if;
   event:='member.updated';info:=jsonb_build_object('before',before_row,'after',after_row);
  end if;
 elsif tg_table_name='ac_invitations' then
  if tg_op='DELETE' then
   target:=old.email;target_label:=old.name;
   event:=case when exists(select 1 from public.ac_members where id=actor and email=old.email) then 'invitation.accepted' else 'invitation.cancelled' end;
  else
   target:=new.email;target_label:=new.name;
   event:=case when tg_op='INSERT' then 'invitation.prepared' else 'invitation.updated' end;
   info:=jsonb_build_object('after',jsonb_build_object('role',new.role,'visit_category',new.visit_category,'leadership_group',new.leadership_group));
  end if;
 end if;
 insert into public.ac_activity(actor_id,actor_name,action,target_id,target_name,details)
 values(actor,actor_label,event,target,target_label,info);
 return null;
end; $$;
revoke all on function ac_private.ac_capture_activity() from public,anon,authenticated,service_role;
create trigger ac_people_activity after insert or update on public.ac_people for each row execute function ac_private.ac_capture_activity();
create trigger ac_visits_activity after insert on public.ac_visits for each row execute function ac_private.ac_capture_activity();
create trigger ac_members_activity after insert or update on public.ac_members for each row execute function ac_private.ac_capture_activity();
create trigger ac_invitations_activity after insert or update or delete on public.ac_invitations for each row execute function ac_private.ac_capture_activity();

-- Only the trusted server can report a verified session or the mail provider's result.
create function ac_private.ac_log_server_activity(p_actor uuid,p_action text,p_session uuid,p_email text)
returns void language plpgsql security definer set search_path='' as $$
declare member public.ac_members; invitation public.ac_invitations;
begin
 select * into member from public.ac_members where id=p_actor and active;
 if not found then return; end if;
 if p_action in ('access.login','access.logout') and p_session is not null and p_email is null then
  insert into public.ac_activity(actor_id,actor_name,action,session_id)
  values(member.id,member.name,p_action,p_session) on conflict(actor_id,session_id,action) do nothing;
 elsif p_action in ('invitation.mail_sent','invitation.mail_failed') and member.role='supervisor' and p_session is null then
  select * into invitation from public.ac_invitations where email=lower(trim(p_email));
  if not found then return; end if;
  insert into public.ac_activity(actor_id,actor_name,action,target_id,target_name)
  values(member.id,member.name,p_action,invitation.email,invitation.name);
 else raise exception 'invalid_activity' using errcode='22023';
 end if;
end; $$;
create function public.ac_log_server_activity(p_actor uuid,p_action text,p_session uuid default null,p_email text default null)
returns void language sql security invoker set search_path='' as $$
 select ac_private.ac_log_server_activity(p_actor,p_action,p_session,p_email);
$$;
grant usage on schema ac_private to service_role;
revoke all on function ac_private.ac_log_server_activity(uuid,text,uuid,text),public.ac_log_server_activity(uuid,text,uuid,text) from public,anon,authenticated;
grant execute on function ac_private.ac_log_server_activity(uuid,text,uuid,text),public.ac_log_server_activity(uuid,text,uuid,text) to service_role;

-- Chilean date bounds include the whole day, including daylight-saving transitions.
create function public.ac_activity_page(p_from date default null,p_to date default null,p_actor uuid default null,
 p_action text default null,p_before timestamptz default null,p_before_id uuid default null)
returns setof public.ac_activity language plpgsql stable security invoker set search_path='' as $$
begin
 if not public.ac_is_supervisor() then raise exception 'supervisor_required' using errcode='42501'; end if;
 if p_from>p_to or (p_before is null)<>(p_before_id is null) then raise exception 'invalid_filters' using errcode='22023'; end if;
 return query select a.* from public.ac_activity a
 where (p_from is null or a.created_at>=p_from::timestamp at time zone 'America/Santiago')
 and (p_to is null or a.created_at<(p_to+1)::timestamp at time zone 'America/Santiago')
 and (p_actor is null or a.actor_id=p_actor) and (p_action is null or a.action=p_action)
 and (p_before is null or (a.created_at,a.id)<(p_before,p_before_id))
 order by a.created_at desc,a.id desc limit 51;
end; $$;
revoke all on function public.ac_activity_page(date,date,uuid,text,timestamptz,uuid) from public,anon;
grant execute on function public.ac_activity_page(date,date,uuid,text,timestamptz,uuid) to authenticated;

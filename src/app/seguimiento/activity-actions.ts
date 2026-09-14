'use server';
import {activityFilterSchema,type ActivityEvent,type ActivityCursor} from '@/lib/seguimiento/activity';
import {followupSession,FollowupError,errorMessage} from '@/lib/seguimiento/server';

export async function getFollowupActivity(input:unknown){
 try{
  const {db,member}=await followupSession();
  if(member.role!=='supervisor')throw new FollowupError('Solo el supervisor puede consultar la actividad.',403);
  const parsed=activityFilterSchema.safeParse(input);
  if(!parsed.success)throw new FollowupError('Revisa las fechas y los filtros de actividad.');
  const p=parsed.data;
  const [events,actors]=await Promise.all([
   db.rpc('ac_activity_page',{p_from:p.from||null,p_to:p.to||null,p_actor:p.actor||null,p_action:p.action||null,p_before:p.cursor?.at??null,p_before_id:p.cursor?.id??null}),
   db.from('ac_members').select('id,name').order('name'),
  ]);
  if(events.error||actors.error)throw new FollowupError('No se pudo cargar la actividad. Inténtalo nuevamente.',503);
  // Return only display fields; internal session identifiers never leave the server.
  const rows=(events.data as ActivityEvent[]).slice(0,50).map(({id,created_at,actor_id,actor_name,action,target_id,target_name,details})=>({id,created_at,actor_id,actor_name,action,target_id,target_name,details}));
  const last=rows.at(-1);
  const next:ActivityCursor|null=events.data.length>50&&last?{at:last.created_at,id:last.id}:null;
  return {events:rows,actors:actors.data as {id:string;name:string}[],next};
 }catch(error){return errorMessage(error);}
}

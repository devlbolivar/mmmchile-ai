import 'server-only';
import {createClient,type SupabaseClient} from '@supabase/supabase-js';
import {z} from 'zod';

type AccessIdentity={actor:string;session:string};
export async function readAccessIdentity(db:SupabaseClient):Promise<AccessIdentity|null>{
 try{
  // getUser verifies the token with Auth; getSession alone must not establish identity.
  const {data:{user},error}=await db.auth.getUser();
  if(error||!user)return null;
  const {data:{session},error:sessionError}=await db.auth.getSession();
  if(sessionError||!session)return null;
  const payload=JSON.parse(Buffer.from(session.access_token.split('.')[1],'base64url').toString('utf8'));
  if(payload.sub!==user.id||!z.uuid().safeParse(payload.session_id).success)return null;
  return {actor:user.id,session:payload.session_id};
 }catch{return null;}
}

async function writeServerActivity(args:{p_actor:string;p_action:string;p_session?:string;p_email?:string}){
 try{
  const key=process.env.SUPABASE_SECRET_KEY||process.env.SUPABASE_SERVICE_ROLE_KEY;
  const url=process.env.NEXT_PUBLIC_SUPABASE_URL;
  if(!key||!url){console.error('followup_activity_unavailable');return;}
  const admin=createClient(url,key,{
   auth:{persistSession:false,autoRefreshToken:false},
   global:{fetch:(input,init)=>fetch(input,{...init,signal:AbortSignal.timeout(2500)})},
  });
  const {error}=await admin.rpc('ac_log_server_activity',args);
  if(error)console.error('followup_activity_failed',{code:error.code});
 }catch{console.error('followup_activity_failed');}
}

export async function recordAccess(identity:AccessIdentity|null,action:'access.login'|'access.logout'){
 if(identity)await writeServerActivity({p_actor:identity.actor,p_action:action,p_session:identity.session});
}
export async function recordSessionAccess(db:SupabaseClient){
 await recordAccess(await readAccessIdentity(db),'access.login');
}
export async function recordInvitationDelivery(actor:string,email:string,sent:boolean){
 await writeServerActivity({p_actor:actor,p_action:sent?'invitation.mail_sent':'invitation.mail_failed',p_email:email});
}

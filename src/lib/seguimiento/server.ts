import 'server-only';
import { createClient } from '@supabase/supabase-js';
import { createSessionClient } from '@/lib/supabase/server';
import type { Member } from './records';
export class FollowupError extends Error {constructor(message:string,public status=400){super(message);}}
export function followupOrigin(){
 const value=process.env.SEGUIMIENTO_APP_URL||'https://mmmchile.cl';
 const url=new URL(value);
 if(url.protocol!=='https:'&&url.hostname!=='localhost')throw new FollowupError('La configuración de acceso no es válida.',503);
 return url.origin;
}
export function inviteClient(){
 const secret=process.env.SUPABASE_SECRET_KEY||process.env.SUPABASE_SERVICE_ROLE_KEY;
 if(!secret)throw new FollowupError('Las invitaciones están pendientes de configuración.',503);
 return createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!,secret,{auth:{persistSession:false,autoRefreshToken:false}});
}
export async function followupSession(){
 const db=await createSessionClient();
 const {data:{user},error}=await db.auth.getUser();
 if(error||!user)throw new FollowupError('Inicia sesión para continuar.',401);
 const {error:inviteError}=await db.rpc('ac_accept_invitation');
 if(inviteError)throw new FollowupError('No se pudo verificar tu acceso. Inténtalo de nuevo.',503);
 const {data:member,error:memberError}=await db.from('ac_members').select('id,name,email,role,active').eq('id',user.id).maybeSingle();
 if(memberError)throw new FollowupError('No se pudo verificar tu acceso. Inténtalo de nuevo.',503);
 if(!member?.active)throw new FollowupError('Tu cuenta no tiene acceso activo al seguimiento. Contacta al supervisor.',403);
 return {db,user,member:member as Member};
}
export function errorMessage(error:unknown){return {error:error instanceof FollowupError?error.message:'No se pudo completar la operación. Inténtalo de nuevo.'};}

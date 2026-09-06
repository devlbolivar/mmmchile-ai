'use server';
import {invitationError} from '@/lib/seguimiento/invitation-error';
import {z} from 'zod';
import type {SupabaseClient} from '@supabase/supabase-js';
import {personSchema,visitSchema,visitCategories,type Person,type Visit,type DirectoryEntry} from '@/lib/seguimiento/records';
import {followupSession,FollowupError,inviteClient,followupOrigin,errorMessage} from '@/lib/seguimiento/server';
async function readAll<T>(db:SupabaseClient,table:'ac_people'|'ac_visits'){
 const rows:T[]=[];
 for(let offset=0;;offset+=500){
  const {data,error}=await db.from(table).select('*').order(table==='ac_visits'?'date':'created_at',{ascending:false}).order('id').range(offset,offset+499);
  if(error)throw new FollowupError('No se pudieron cargar los registros.',503);
  rows.push(...data as T[]);if(data.length<500)return rows;
 }
}
export async function getFollowupRecords(){
 try{const {db,member}=await followupSession();
 const [peopleRows,visitRows,d]=await Promise.all([
  readAll<Omit<Person,'consent'|'next_date'|'responsible'>&{consent:boolean;next_date:string|null}>(db,'ac_people'),
  readAll<Omit<Visit,'next_date'>&{next_date:string|null}>(db,'ac_visits'),db.rpc('ac_assignment_directory')]);
 if(d.error)throw new FollowupError('No se pudo cargar el equipo.',503);
 const directory=d.data as DirectoryEntry[];const names=new Map(directory.map(m=>[m.id,m.name]));
 return {member,directory,people:peopleRows.map(p=>({...p,consent:Number(p.consent),next_date:p.next_date??'',responsible:p.assigned_to?(names.get(p.assigned_to)??'Integrante inactivo'):''})) as Person[],visits:visitRows.map(v=>({...v,next_date:v.next_date??''})) as Visit[]};
 }catch(error){return errorMessage(error);}
}
export async function saveFollowupPerson(id:string|null,input:unknown){
 try{const {db}=await followupSession();const p=personSchema.safeParse(input);if(!p.success)throw new FollowupError(p.error.issues[0].message);
 if(id&&!z.uuid().safeParse(id).success)throw new FollowupError('Ficha inválida.');
 const {error}=await db.rpc('ac_save_person',{p_id:id,p_data:p.data});
 if(error)throw new FollowupError(error.message==='invalid_assignee'?'El responsable debe estar activo y pertenecer al grupo y sexo seleccionados. Solicita al supervisor revisar la asignación.':error.code==='42501'?'No tienes permiso para cambiar la ficha o su responsable.':'No se pudo guardar. Revisa los datos y el responsable.');return {ok:true};
 }catch(error){return errorMessage(error);}
}
export async function saveFollowupVisit(input:unknown){
 try{const {db}=await followupSession();const v=visitSchema.safeParse(input);if(!v.success)throw new FollowupError(v.error.issues[0].message);
 const {error}=await db.rpc('ac_record_visit',{p_data:v.data});
 if(error)throw new FollowupError(error.code==='42501'?'No puedes registrar visitas a esta persona.':'Comprueba que el seguimiento esté abierto y las fechas sean válidas.');return {ok:true};
 }catch(error){return errorMessage(error);}
}
export async function getFollowupTeam(){
 try{const {db,member}=await followupSession();if(member.role!=='supervisor')throw new FollowupError('Solo el supervisor puede gestionar el equipo.',403);
 const [m,i]=await Promise.all([db.from('ac_members').select('id,name,email,role,active,visit_category').order('name'),db.from('ac_invitations').select('email,name,role,visit_category').order('created_at',{ascending:false})]);
 if(m.error||i.error)throw new FollowupError('No se pudo cargar el equipo.');return {members:m.data,invitations:i.data};
 }catch(error){return errorMessage(error);}
}
export async function inviteFollowupMember(input:unknown){
 try{const {db,member}=await followupSession();if(member.role!=='supervisor')throw new FollowupError('Solo el supervisor puede invitar integrantes.',403);
 const value=z.object({name:z.string().trim().min(2).max(120),email:z.email().max(254).transform(v=>v.toLowerCase()),role:z.enum(['supervisor','visitador']),category:z.enum(visitCategories).nullable()}).safeParse(input);
 if(!value.success)throw new FollowupError('Revisa el nombre, correo y rol.');const p=value.data;const admin=inviteClient();
 const origin=await followupOrigin();
 const {error}=await db.rpc('ac_prepare_classified_invitation',{p_email:p.email,p_name:p.name,p_role:p.role,p_category:p.category});if(error)throw new FollowupError('No se pudo preparar el acceso. Comprueba si ya pertenece al equipo.');
 const {error:mailError}=await admin.auth.admin.inviteUserByEmail(p.email,{redirectTo:origin+'/seguimiento/auth/confirm'});
 if(mailError){
  console.error('followup_invitation_failed',{code:mailError.code,status:mailError.status});
  throw new FollowupError(invitationError(mailError));
 }
 return {ok:true};
 }catch(error){return errorMessage(error);}
}
export async function updateFollowupMember(input:unknown){
 try{const {db,member}=await followupSession();if(member.role!=='supervisor')throw new FollowupError('No tienes permiso.',403);
 const p=z.object({id:z.uuid(),role:z.enum(['supervisor','visitador']),active:z.boolean(),category:z.enum(visitCategories).nullable()}).safeParse(input);if(!p.success)throw new FollowupError('Datos inválidos.');
 const {data,error}=await db.rpc('ac_update_member_assignment',{p_id:p.data.id,p_role:p.data.role,p_active:p.data.active,p_category:p.data.category});if(error)throw new FollowupError('No se pudo cambiar el acceso. No puedes modificar tu propio rol ni desactivar tu cuenta.');return {ok:true,unassignedCount:Number(data??0)};
 }catch(error){return errorMessage(error);}
}
export async function cancelFollowupInvitation(email:string){
 try{const {db,member}=await followupSession();if(member.role!=='supervisor')throw new FollowupError('No tienes permiso.',403);
 if(!z.email().safeParse(email).success)throw new FollowupError('Correo inválido.');const {error}=await db.rpc('ac_cancel_invitation',{p_email:email});if(error)throw new FollowupError('No se pudo cancelar el acceso.');return {ok:true};
 }catch(error){return errorMessage(error);}
}

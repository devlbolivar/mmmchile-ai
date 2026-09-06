'use server';
import {z} from 'zod';
import {redirect} from 'next/navigation';
import {createSessionClient} from '@/lib/supabase/server';
import {followupOrigin,errorMessage} from '@/lib/seguimiento/server';
export async function followupLogin(input:{email:string;password:string}){
 const p=z.object({email:z.email(),password:z.string().min(1).max(128)}).safeParse(input);if(!p.success)return {error:'Revisa tu correo y contraseña.'};
 const db=await createSessionClient();const {error}=await db.auth.signInWithPassword(p.data);
 if(error)return {error:error.status===429?'Demasiados intentos. Espera unos minutos.':'Correo o contraseña incorrectos.'};
 return {ok:true};
}
export async function followupRecover(email:string){
 if(!z.email().safeParse(email).success)return {error:'Ingresa un correo válido.'};const db=await createSessionClient();
 let origin:string;try{origin=await followupOrigin();}catch(error){return errorMessage(error);}
 const {error}=await db.auth.resetPasswordForEmail(email,{redirectTo:origin+'/seguimiento/auth/confirm'});
 if(error)return {error:'No se pudo solicitar el correo. Espera unos minutos e inténtalo de nuevo.'};
 return {ok:true,message:'Si el correo está registrado, recibirás un enlace para definir una nueva contraseña.'};
}
export async function followupPassword(password:string){
 if(password.length<12||password.length>128)return {error:'Usa una contraseña de entre 12 y 128 caracteres.'};
 const db=await createSessionClient();const {data:{user},error}=await db.auth.getUser();if(error||!user)return {error:'El enlace venció. Solicita uno nuevo.'};
 const {error:changed}=await db.auth.updateUser({password});if(changed)return {error:'No se pudo cambiar la contraseña. Revisa sus requisitos.'};return {ok:true};
}
export async function followupLogout(){const db=await createSessionClient();const {error}=await db.auth.signOut({scope:'local'});if(error)throw new Error('No se pudo cerrar sesión. Inténtalo nuevamente.');redirect('/seguimiento/login');}

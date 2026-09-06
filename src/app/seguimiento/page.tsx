import {redirect} from 'next/navigation';
import type {Metadata} from 'next';
import {followupSession,FollowupError} from '@/lib/seguimiento/server';
import FollowupWorkspace from '@/components/seguimiento/workspace';
import {followupLogout} from './login/actions';
import LogoutButton from '@/components/seguimiento/logout-button';
export function generateMetadata():Metadata{return {title:'Acompañar · Seguimiento'};}
export const dynamic='force-dynamic';
export default async function FollowupPage(){
 try{await followupSession();}catch(error){
 if(error instanceof FollowupError&&error.status===401)redirect('/seguimiento/login');
 return <main className="mx-auto max-w-lg p-8 pt-20"><h1 className="text-2xl font-bold">Acceso al seguimiento</h1><p className="my-6">{error instanceof FollowupError?error.message:'El servicio no está disponible. Inténtalo de nuevo.'}</p><form action={followupLogout}><LogoutButton/></form></main>;
 }
 return <FollowupWorkspace/>;
}

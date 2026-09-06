'use client';
import BusyLabel from './busy-label';
import {useEffect,useRef,useState} from 'react';
import {useRouter} from 'next/navigation';
import {createBrowserSupabaseClient} from '@/lib/supabase/browser';
import {secondary,ErrorNotice} from './ui';
export default function FollowupAuthConfirm(){
 const router=useRouter(),started=useRef(false);const [error,setError]=useState('');
 useEffect(()=>{if(started.current)return;started.current=true;
 async function confirm(){try{
 const url=new URL(window.location.href),hash=new URLSearchParams(url.hash.slice(1)),db=createBrowserSupabaseClient();
 const token_hash=url.searchParams.get('token_hash'),type=url.searchParams.get('type'),code=url.searchParams.get('code');
 const access_token=hash.get('access_token'),refresh_token=hash.get('refresh_token');
 // Remove credentials from the address bar before using them; no third-party analytics on this route.
 window.history.replaceState({},'',url.pathname);
 let authError;
 if(token_hash&&(type==='invite'||type==='recovery'))({error:authError}=await db.auth.verifyOtp({token_hash,type}));
 else if(code)({error:authError}=await db.auth.exchangeCodeForSession(code));
 else if(access_token&&refresh_token)({error:authError}=await db.auth.setSession({access_token,refresh_token}));
 else throw new Error();
 if(authError)throw authError;router.replace('/seguimiento/clave');router.refresh();
 }catch{setError('El enlace venció o ya fue utilizado. Solicita uno nuevo.');}}
 void confirm();
 },[router]);
 return <main className="mx-auto max-w-lg px-6 py-24"><h1 className="text-2xl font-bold text-primary">Confirmando tu acceso</h1>{error?<><ErrorNotice message={error}/><a className={secondary} href="/seguimiento/login">Volver al acceso</a></>:<div className="mt-4 text-slate-500"><BusyLabel>Verificando el enlace…</BusyLabel></div>}</main>;
}

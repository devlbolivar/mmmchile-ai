'use client';
import {useEffect,useRef} from 'react';
export const button='cursor-pointer inline-flex items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-white hover:bg-primary-dark disabled:opacity-50 disabled:cursor-wait focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary';
export const secondary='cursor-pointer inline-flex items-center justify-center gap-2 rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm font-semibold text-primary hover:bg-slate-50 disabled:opacity-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary';
export const input='w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-base text-slate-800 focus:outline-2 focus:outline-primary disabled:bg-slate-100';
export const label='grid gap-2 text-sm font-semibold';
export function Modal({title,description,busy,onClose,children}:{title:string;description?:string;busy?:boolean;onClose:()=>void;children:React.ReactNode}){
 const ref=useRef<HTMLDialogElement>(null);
 useEffect(()=>{const dialog=ref.current;dialog?.showModal();return()=>dialog?.close();},[]);
 return <dialog ref={ref} onCancel={e=>{e.preventDefault();if(!busy)onClose();}} aria-labelledby="followup-dialog-title" aria-describedby={description?'followup-dialog-description':undefined} className="fixed inset-0 m-auto max-h-[90dvh] w-[calc(100%-2rem)] max-w-xl overflow-y-auto rounded-2xl bg-white p-6 text-slate-800 shadow-xl backdrop:bg-slate-950/50"><header className="mb-6 flex items-start justify-between gap-4"><div><h2 id="followup-dialog-title" className="text-2xl font-bold text-primary">{title}</h2>{description&&<p id="followup-dialog-description" className="mt-2 text-sm text-slate-500">{description}</p>}</div><button type="button" disabled={busy} onClick={onClose} className="cursor-pointer rounded-lg px-3 py-1 text-xl hover:bg-slate-100" aria-label="Cerrar">×</button></header>{children}</dialog>;
}
export function Notice({children}:{children:React.ReactNode}){return <p className="my-4 rounded-lg bg-blue-50 p-4 text-sm leading-relaxed text-primary">{children}</p>;}
export function ErrorNotice({message}:{message:string}){return message?<p role="alert" className="my-4 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-800">{message}</p>:null;}
export function Badge({value}:{value:string}){return <span className={'inline-block whitespace-nowrap rounded-md px-2 py-1 text-xs font-semibold '+(['Realizada','Finalizado','Activo'].includes(value)?'bg-emerald-50 text-emerald-800':value==='Pendiente'?'bg-amber-50 text-amber-800':'bg-sky-50 text-sky-800')}>{value}</span>;}

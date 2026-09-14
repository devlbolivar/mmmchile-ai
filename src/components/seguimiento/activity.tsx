'use client';
import {useCallback,useEffect,useRef,useState,type FormEvent} from 'react';
import {RefreshCw} from 'lucide-react';
import {getFollowupActivity} from '@/app/seguimiento/activity-actions';
import {activityActions,activityDate,activityDetail,type ActivityCursor,type ActivityEvent,type ActivityFilters} from '@/lib/seguimiento/activity';
import {button,secondary,input,label,ErrorNotice} from './ui';
import BusyLabel from './busy-label';

const emptyFilters:ActivityFilters={from:'',to:'',actor:'',action:''};
export default function FollowupActivity(){
 const [events,setEvents]=useState<ActivityEvent[]>([]);
 const [actors,setActors]=useState<{id:string;name:string}[]>([]);
 const [filters,setFilters]=useState(emptyFilters),[applied,setApplied]=useState(emptyFilters);
 const [cursor,setCursor]=useState<ActivityCursor|null>(null),[next,setNext]=useState<ActivityCursor|null>(null);
 const [previous,setPrevious]=useState<(ActivityCursor|null)[]>([]);
 const [busy,setBusy]=useState(true),[error,setError]=useState('');
 const request=useRef(0);
 const load=useCallback(async (filter:ActivityFilters,at:ActivityCursor|null,history:(ActivityCursor|null)[])=>{
  const id=++request.current;setBusy(true);setError('');setEvents([]);setNext(null);
  setApplied(filter);setCursor(at);setPrevious(history);
  try{
   const result=await getFollowupActivity({...filter,cursor:at});
   if(id!==request.current)return;
   if('error' in result){setError(result.error);setActors([]);return;}
   setEvents(result.events);setActors(result.actors);setNext(result.next);
  }catch{if(id===request.current){setError('No se pudo conectar. Inténtalo nuevamente.');setActors([]);}}
  finally{if(id===request.current)setBusy(false);}
 },[]);
 useEffect(()=>{void load(emptyFilters,null,[]);return()=>{request.current++;};},[load]);
 function submit(event:FormEvent<HTMLFormElement>){event.preventDefault();if(!busy)void load(filters,null,[]);}
 return <section aria-busy={busy} className="rounded-2xl border border-slate-200 bg-white">
  <header className="flex flex-wrap items-start justify-between gap-4 border-b border-slate-100 p-6">
   <div><h2 className="text-xl font-bold text-primary">Actividad de la plataforma</h2>
   <p className="mt-2 text-sm text-slate-500">Accesos y cambios registrados desde la activación de la bitácora. Horario de Santiago de Chile.</p></div>
   <button className={secondary} disabled={busy} onClick={()=>void load(applied,null,[])}><RefreshCw size={16} aria-hidden="true"/> Actualizar</button>
  </header>
  <form onSubmit={submit} className="border-b border-slate-100 p-6">
   <fieldset disabled={busy} className="grid items-end gap-4 sm:grid-cols-2 lg:grid-cols-5">
    <label className={label}>Desde<input type="date" className={input} value={filters.from} max={filters.to||undefined} onChange={e=>setFilters({...filters,from:e.target.value})}/></label>
    <label className={label}>Hasta<input type="date" className={input} value={filters.to} min={filters.from||undefined} onChange={e=>setFilters({...filters,to:e.target.value})}/></label>
    <label className={label}>Usuario<select className={input} value={filters.actor} onChange={e=>setFilters({...filters,actor:e.target.value})}><option value="">Todos</option>{actors.map(actor=><option key={actor.id} value={actor.id}>{actor.name}</option>)}</select></label>
    <label className={label}>Acción<select className={input} value={filters.action} onChange={e=>setFilters({...filters,action:e.target.value})}><option value="">Todas</option>{Object.entries(activityActions).map(([value,name])=><option key={value} value={value}>{name}</option>)}</select></label>
    <button className={button} type="submit">Aplicar filtros</button>
   </fieldset>
   <button className={secondary+' mt-4'} type="button" disabled={busy} onClick={()=>{setFilters(emptyFilters);void load(emptyFilters,null,[]);}}>Limpiar filtros</button>
  </form>
  <div className="p-6">
   <ErrorNotice message={error}/>
   {error&&<button className={secondary} disabled={busy} onClick={()=>void load(applied,cursor,previous)}>Reintentar</button>}
   {busy?<div className="py-10"><BusyLabel>Cargando actividad…</BusyLabel></div>:!error&&(!events.length?<p role="status" className="py-10 text-center text-slate-500">No hay actividad registrada para estos filtros.</p>:<div className="overflow-x-auto">
    <table className="w-full text-left text-sm"><caption className="sr-only">Bitácora de accesos y actividad, del evento más reciente al más antiguo</caption>
     <thead className="border-b border-slate-200 text-slate-500"><tr>{['Fecha y hora','Usuario','Acción','Registro y detalle'].map(title=><th key={title} scope="col" className="p-3 font-semibold">{title}</th>)}</tr></thead>
     <tbody className="divide-y divide-slate-100">{events.map(event=><tr key={event.id}>
      <td className="whitespace-nowrap p-3 align-top"><time dateTime={event.created_at}>{activityDate(event.created_at)}</time></td>
      <td className="p-3 align-top">{event.actor_name}</td>
      <td className="p-3 align-top font-semibold text-primary">{activityActions[event.action]??event.action}</td>
      <td className="min-w-56 p-3 align-top"><span>{event.target_name||'Sesión de seguimiento'}</span>{activityDetail(event)&&<p className="mt-1 text-slate-500">{activityDetail(event)}</p>}</td>
     </tr>)}</tbody>
    </table>
   </div>)}
   <div className="mt-5 flex flex-wrap items-center justify-between gap-4">
    <p role="status" className="text-sm text-slate-500">{busy?'':error?'':'Página '+(previous.length+1)+' · '+events.length+' eventos'}</p>
    <div className="flex gap-2">
     <button className={secondary} disabled={busy||!previous.length} onClick={()=>void load(applied,previous.at(-1)??null,previous.slice(0,-1))}>Anterior</button>
     <button className={secondary} disabled={busy||!next} onClick={()=>{if(next)void load(applied,next,[...previous,cursor]);}}>Siguiente</button>
    </div>
   </div>
   <p className="mt-5 text-xs leading-relaxed text-slate-500">Los accesos se registran una vez por sesión al iniciar sesión o entrar a seguimiento. Cerrar la pestaña o dejar vencer la sesión no registra un cierre. Los eventos no se pueden editar ni eliminar desde la plataforma.</p>
  </div>
 </section>;
}

import {z} from 'zod';

export const activityActions = {
 'access.login':'Inicio de sesión',
 'access.logout':'Cierre de sesión',
 'person.created':'Ficha creada',
 'person.updated':'Ficha actualizada',
 'person.assigned':'Responsable cambiado',
 'visit.created':'Visita registrada',
 'member.created':'Integrante incorporado',
 'member.updated':'Acceso de integrante actualizado',
 'invitation.prepared':'Invitación preparada',
 'invitation.updated':'Invitación preparada nuevamente',
 'invitation.accepted':'Invitación aceptada',
 'invitation.cancelled':'Invitación cancelada',
 'invitation.mail_sent':'Correo de invitación enviado',
 'invitation.mail_failed':'Falló el envío de invitación',
} as const;
export type ActivityAction = keyof typeof activityActions;
export type ActivityEvent = {
 id:string; created_at:string; actor_id:string|null; actor_name:string;
 action:ActivityAction; target_id:string|null; target_name:string|null;
 details:Record<string,unknown>;
};
export type ActivityCursor = {at:string;id:string};
export type ActivityFilters = {from:string;to:string;actor:string;action:string};
export const activityFilterSchema=z.object({
 from:z.union([z.literal(''),z.iso.date()]),
 to:z.union([z.literal(''),z.iso.date()]),
 actor:z.union([z.literal(''),z.uuid()]),
 action:z.union([z.literal(''),z.enum(Object.keys(activityActions) as [ActivityAction,...ActivityAction[]])]),
 cursor:z.object({at:z.iso.datetime({offset:true}),id:z.uuid()}).nullable().default(null),
}).refine(v=>!v.from||!v.to||v.from<=v.to,{message:'La fecha inicial debe ser anterior o igual a la final.'});

const fieldLabels:Record<string,string>={name:'nombre',phone:'teléfono',address:'dirección',kind:'motivo',status:'estado',next_date:'próximo contacto',consent:'autorización',assigned_to:'responsable',age_group:'grupo',sex:'sexo'};
const valueLabels:Record<string,string>={supervisor:'Supervisor',lider:'Líder',visitador:'Visitador',jovenes:'Jóvenes',hombres_adultos:'Hombres adultos',mujeres_adultas:'Mujeres adultas',joven_masculino:'Joven varón',joven_femenino:'Joven mujer',adulto_masculino:'Hombre adulto',adulto_femenino:'Mujer adulta'};
function accessSummary(value:unknown){
 if(!value||typeof value!=='object')return '';
 const item=value as Record<string,unknown>;
 return [item.role,item.leadership_group,item.visit_category].filter(v=>typeof v==='string').map(v=>valueLabels[String(v)]??String(v)).concat(typeof item.active==='boolean'?[item.active?'Activo':'Inactivo']:[]).join(' · ');
}
export function activityDetail(event:ActivityEvent){
 const d=event.details;
 const parts:string[]=[];
 if('new_assignee' in d)parts.push(String(d.previous_assignee??'Sin asignar')+' → '+String(d.new_assignee??'Sin asignar'));
 if(Array.isArray(d.fields)){
  const fields=d.fields.filter((v):v is string=>typeof v==='string'&&v!=='assigned_to');
  if(fields.length)parts.push('Campos: '+fields.map(v=>fieldLabels[v]??v).join(', '));
 }
 if(d.before)parts.push(accessSummary(d.before)+' → '+accessSummary(d.after));
 else if(d.after)parts.push(accessSummary(d.after));
 if(event.action==='invitation.mail_sent')parts.push('El proveedor aceptó el envío; no confirma recepción ni lectura.');
 if(event.action==='invitation.mail_failed')parts.push('El acceso sigue pendiente. Revisa el envío desde Equipo.');
 return parts.join('. ');
}
export function activityDate(value:string){
 return new Intl.DateTimeFormat('es-CL',{timeZone:'America/Santiago',dateStyle:'medium',timeStyle:'short'}).format(new Date(value));
}

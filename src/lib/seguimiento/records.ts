import { z } from 'zod';
export const kinds = ['Nuevo creyente', 'Acompañamiento'] as const;
export const ageGroups = ['Joven', 'Adulto'] as const;
export const sexes = ['Masculino', 'Femenino'] as const;
export const visitCategories = ['joven_masculino','joven_femenino','adulto_masculino','adulto_femenino'] as const;
export type VisitCategory = typeof visitCategories[number];
export const categoryLabels: Record<VisitCategory,string> = {joven_masculino:'Jóvenes varones',joven_femenino:'Jóvenes mujeres',adulto_masculino:'Adultos varones',adulto_femenino:'Adultas mujeres'};
export function categoryFor(group:string|null,sex:string|null):VisitCategory|null {
 if(!ageGroups.some(v=>v===group)||!sexes.some(v=>v===sex))return null;
 return `${group!.toLowerCase()}_${sex!.toLowerCase()}` as VisitCategory;
}
export function compatibleVisitors(directory:DirectoryEntry[],group:string,sex:string){
 const category=categoryFor(group,sex);
 return category?directory.filter(m=>m.visit_category===category):[];
}
export const classificationLabel=(group:string|null,sex:string|null)=>{
 const category=categoryFor(group,sex);return category?categoryLabels[category]:'Pendiente de clasificación';
};
// Preserve stored values while showing clearer language in the interface.
export const kindLabel = (kind: string) => kind === 'Acompañamiento' ? 'Creyente' : kind;
export function localPhone(value: string) {
 const compact=value.trim().replace(/[\s()-]/g,'');
 return /^(?:\+56|56)\d{9}$/.test(compact)?compact.slice(-9):compact;
}
export const phoneSchema=z.string().transform(localPhone)
 .refine(v=>v===''||/^\d{9}$/.test(v),'Ingresa los 9 dígitos del teléfono, sin el +56.')
 .transform(v=>v?'+56'+v:'');
export const statuses = ['Pendiente', 'En seguimiento', 'Finalizado'] as const;
export const results = ['Realizada', 'No se encontró', 'Reprogramada'] as const;
export function today() { return new Intl.DateTimeFormat('en-CA', {timeZone:'America/Santiago',year:'numeric',month:'2-digit',day:'2-digit'}).format(new Date()); }
const date = z.string().refine(v => !v || (/^\d{4}-\d{2}-\d{2}$/.test(v) && !Number.isNaN(Date.parse(v)) && new Date(v).toISOString().slice(0,10) === v), 'Fecha inválida');
export const personSchema = z.object({
 ageGroup:z.enum(ageGroups,{error:'Selecciona Joven o Adulto.'}),sex:z.enum(sexes,{error:'Selecciona el sexo.'}),
 name:z.string().trim().min(2,'Escribe el nombre completo.').max(120),phone:phoneSchema,address:z.string().trim().max(250),
 kind:z.enum(kinds),responsible:z.string().trim().max(120),assignedTo:z.union([z.string().uuid(),z.literal('')]),status:z.enum(statuses),nextDate:date,
 consent:z.literal(true,{error:'Confirma la autorización para el seguimiento.'}),
}).refine(p=>p.status!=='Finalizado'||p.nextDate==='', 'Un seguimiento finalizado no debe tener una fecha pendiente.');
export const visitSchema=z.object({
 personId:z.string().uuid(),date:date.refine(v=>!!v&&v<=today(),'La visita debe tener una fecha de hoy o anterior.'),
 visitor:z.string().trim().min(2,'Indica quién hizo la visita.').max(120),result:z.enum(results),notes:z.string().trim().max(2000),nextDate:date,
}).refine(v=>!v.nextDate||v.nextDate>=v.date,'El próximo contacto no puede ser anterior a la visita.');
export type Person={age_group:typeof ageGroups[number]|null;sex:typeof sexes[number]|null;assigned_to:string|null;created_by:string;id:string;name:string;phone:string;address:string;kind:typeof kinds[number];responsible:string;status:typeof statuses[number];next_date:string;consent:number;created_at:string};
export type Visit={created_by:string;author_name:string;person_name:string;id:string;person_id:string;date:string;visitor:string;result:typeof results[number];notes:string;next_date:string;created_at:string};

export type Member={id:string;name:string;email:string;role:'supervisor'|'visitador';active:boolean;visit_category:VisitCategory|null};
export type DirectoryEntry={id:string;name:string;visit_category:VisitCategory|null};

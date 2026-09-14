import { z } from 'zod';
export const kinds = ['Nuevo creyente', 'Acompañamiento'] as const;
export const ageGroups = ['Joven', 'Adulto'] as const;
export const sexes = ['Masculino', 'Femenino'] as const;
export const visitCategories = ['joven_masculino','joven_femenino','adulto_masculino','adulto_femenino'] as const;
export const leadershipGroups = ['jovenes','hombres_adultos','mujeres_adultas'] as const;
export type LeadershipGroup = typeof leadershipGroups[number];
export const leadershipLabels: Record<LeadershipGroup,string> = {jovenes:'Jóvenes',hombres_adultos:'Hombres adultos',mujeres_adultas:'Mujeres adultas'};
export const roles = ['supervisor','lider','visitador'] as const;
export const roleLabels = {supervisor:'Supervisor',lider:'Líder de grupo',visitador:'Visitador'};
export function groupFor(ageGroup:string|null,sex:string|null):LeadershipGroup|null {
 if (!ageGroups.some(g=>g===ageGroup)||!sexes.some(s=>s===sex)) return null;
 return ageGroup==='Joven'?'jovenes':sex==='Masculino'?'hombres_adultos':'mujeres_adultas';
}
export function categoryGroup(category:VisitCategory|null):LeadershipGroup|null {
 if (!category) return null;
 return category.startsWith('joven_')?'jovenes':category==='adulto_masculino'?'hombres_adultos':'mujeres_adultas';
}
export function canManageAssignment(member:Member,ageGroup:string,sex:string) {
 return member.active&&(member.role==='supervisor'||(member.role==='lider'&&!!member.leadership_group&&member.leadership_group===groupFor(ageGroup,sex)));
}
export const memberAccessSchema=z.object({
 role:z.enum(roles),category:z.enum(visitCategories).nullable(),leadershipGroup:z.enum(leadershipGroups).nullable(),
}).superRefine((v,ctx)=>{
 if(v.role==='lider'&&!v.leadershipGroup)ctx.addIssue({code:'custom',message:'Selecciona el grupo que dirigirá.'});
 if(v.role!=='lider'&&v.leadershipGroup)ctx.addIssue({code:'custom',message:'Solo un líder puede tener grupo de liderazgo.'});
 if(v.role==='lider'&&v.category&&categoryGroup(v.category)!==v.leadershipGroup)ctx.addIssue({code:'custom',message:'La categoría de visita debe pertenecer al grupo que dirige.'});
});
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

export type Member={id:string;name:string;email:string;role:typeof roles[number];active:boolean;visit_category:VisitCategory|null;leadership_group:LeadershipGroup|null};
export type DirectoryEntry={id:string;name:string;visit_category:VisitCategory|null};

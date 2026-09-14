'use client';
import {useState} from 'react';
import {roles,roleLabels,leadershipGroups,leadershipLabels,visitCategories,categoryLabels,categoryGroup,type Member} from '@/lib/seguimiento/records';
import {input,label,Notice} from './ui';

export default function TeamAccessFields({member,me}:{member:Member|'new';me:Member}) {
 const [role,setRole]=useState<Member['role']>(member==='new'?'visitador':member.role);
 const [group,setGroup]=useState(member==='new'?'':member.leadership_group??'');
 const [category,setCategory]=useState(member==='new'?'':member.visit_category??'');
 const self=member!=='new'&&member.id===me.id;
 const categories=visitCategories.filter(c=>role!=='lider'||categoryGroup(c)===group);
 const selectedCategory=categories.some(c=>c===category)?category:'';
 return <>
  <label className={label}>Rol
   <select className={input} name="role" value={role} disabled={self} onChange={e=>setRole(e.target.value as Member['role'])}>
    {roles.map(r=><option key={r} value={r}>{roleLabels[r]}</option>)}
   </select>
  </label>
  {role==='lider'&&<label className={label}>Grupo que dirige *
   <select className={input} name="leadershipGroup" value={group} onChange={e=>setGroup(e.target.value)} required>
    <option value="">Seleccionar grupo</option>
    {leadershipGroups.map(g=><option key={g} value={g}>{leadershipLabels[g]}</option>)}
   </select>
   <small className="font-normal text-slate-500">Podrá ver las fichas y visitas de este grupo y asignar responsables compatibles. Jóvenes incluye varones y mujeres.</small>
  </label>}
  <label className={label}>Categoría como visitador
   <select className={input} name="category" value={selectedCategory} onChange={e=>setCategory(e.target.value)}>
    <option value="">Sin categoría de visita</option>
    {categories.map(c=><option key={c} value={c}>{categoryLabels[c]}</option>)}
   </select>
   <small className="font-normal text-slate-500">Indica qué personas se le pueden asignar para visitar. Sin categoría puede supervisar, pero no recibir nuevas asignaciones. Cambiarla libera las fichas incompatibles.</small>
  </label>
  {self&&<Notice>Puedes configurar tu categoría de visita. Tu rol y acceso se conservan.</Notice>}
  <Notice>El supervisor administra todos los grupos. El líder asigna responsables y ve el historial de su grupo. El visitador solo ve las visitas que registra.</Notice>
 </>;
}

'use client';

import {useMemo, useState} from 'react';
import {ArrowDown, ArrowUp, ArrowUpRight, CalendarDays, Search, SlidersHorizontal, X, Users} from 'lucide-react';
import {categoryLabels, classificationLabel, kinds, kindLabel, results, statuses, statusLabel, isClosed, type Person, type Visit} from '@/lib/seguimiento/records';
import {emptyPeopleFilters, registrationAge, selectPeople, summarizePeople, type PeopleFilters, type PeopleSort} from '@/lib/seguimiento/people-dashboard';
import {Badge, button, input, secondary} from './ui';

const date = (value: string) => value ? new Intl.DateTimeFormat('es-CL', {day: 'numeric', month: 'short', year: 'numeric'}).format(new Date(value + 'T12:00:00')) : 'Sin programar';
const sortLabels: Record<PeopleSort, string> = {next: 'Próximo contacto', name: 'Nombre', responsible: 'Responsable', status: 'Estado y antigüedad', latest: 'Última visita', count: 'Cantidad de visitas', created: 'Fecha de registro'};

export default function PeopleDashboard({people, visits, day, filters, onFiltersChange, onSelect, onCreate, groupHistory}: {
 people: Person[]; visits: Visit[]; day: string; filters: PeopleFilters;
 onFiltersChange: (filters: PeopleFilters) => void; onSelect: (id: string) => void;
 onCreate: () => void; groupHistory: boolean;
}) {
 const [sort, setSort] = useState<PeopleSort>('status');
 const [descending, setDescending] = useState(false);
 const [layout, setLayout] = useState('table');
 const [pagination, setPagination] = useState({key: '', page: 1});
 const [pageSize, setPageSize] = useState(10);
 const summaries = useMemo(() => summarizePeople(people, visits), [people, visits]);
 const filtered = useMemo(() => selectPeople(summaries, filters, sort, descending, day), [summaries, filters, sort, descending, day]);
 const owners = useMemo(() => Array.from(new Map(people.filter(p => p.assigned_to).map(p => [p.assigned_to!, p.responsible || 'Integrante inactivo'])).entries()).sort((a, b) => a[1].localeCompare(b[1], 'es-CL')), [people]);
 const key = JSON.stringify([filters, sort, descending, pageSize]);
 const pages = Math.max(1, Math.ceil(filtered.length / pageSize));
 const page = Math.min(pagination.key === key ? pagination.page : 1, pages);
 const visible = filtered.slice((page - 1) * pageSize, page * pageSize);
 const filterCount = Object.values(filters).filter(Boolean).length;
 const advancedCount = Object.entries(filters).filter(([key, value]) => key !== 'query' && key !== 'status' && value).length;
 const filterNames: Record<keyof PeopleFilters, string> = {query:'Búsqueda',status:'Estado',assignedTo:'Responsable',kind:'Tipo',classification:'Clasificación',schedule:'Contacto',from:'Desde',to:'Hasta',result:'Última visita'};
 const filterValue = (field: keyof PeopleFilters, value: string) => {
  if(field === 'assignedTo') return value === 'unassigned' ? 'Sin responsable' : owners.find(([id]) => id === value)?.[1] || value;
  if(field === 'status') return statusLabel(value);
  if(field === 'kind') return kindLabel(value);
  if(field === 'classification') return categoryLabels[value as keyof typeof categoryLabels] || 'Sin clasificar';
  if(field === 'schedule') return ({overdue:'Vencidos',today:'Hoy',upcoming:'Futuros',unscheduled:'Sin programar'} as Record<string,string>)[value];
  if(field === 'result' && value === 'none') return 'Sin visitas registradas';
  if(field === 'from' || field === 'to') return date(value);
  return value;
 };
 const invalidRange = !!(filters.from && filters.to && filters.from > filters.to);
 const change = (field: keyof PeopleFilters, value: string) => onFiltersChange({...filters, [field]: value});
 const select = (title: string, field: keyof PeopleFilters, options: [string, string][]) => <label className="grid min-w-0 gap-1.5 text-sm font-medium text-slate-600">{title}<select className={input + ' min-w-0'} value={filters[field]} onChange={e => change(field, e.target.value)}><option value="">{field === 'status' ? 'Todos excepto archivados' : 'Todos'}</option>{options.map(([value, label]) => <option key={value} value={value}>{label}</option>)}</select></label>;
 const registration = (p: Person) => {
  const age = registrationAge(p.created_at, day);
  if (!age) return <span className="text-slate-500">Fecha no disponible</span>;
  return <><span className="block">{date(age.date)}</span><small className={'mt-1 block ' + (p.status === 'Pendiente' ? 'font-semibold text-amber-800' : 'text-slate-500')}>{age.days === 0 ? 'Registrado hoy' : `Registrado hace ${age.days} ${age.days === 1 ? 'día' : 'días'}`}</small></>;
 };
 const contact = (p: Person) => <><span>{date(p.next_date)}</span>{!isClosed(p.status) && p.next_date && p.next_date <= day && <small className={'mt-1 block font-semibold ' + (p.next_date < day ? 'text-amber-800' : 'text-primary')}>{p.next_date < day ? 'Vencido' : 'Hoy'}</small>}</>;
 const latest = (row: typeof visible[number]) => row.latest ? <><span className="mb-1 block">{date(row.latest.date)}</span><Badge value={row.latest.result}/><small className="mt-1 block text-slate-500">{row.count} {row.count === 1 ? 'visita' : 'visitas'}</small></> : <span className="text-slate-500">Sin visitas registradas{!groupHistory && ' por ti'}</span>;
 const sortColumn = (label: string, value: PeopleSort) => <th className="p-4" aria-sort={sort === value ? descending ? 'descending' : 'ascending' : 'none'}><button className="flex items-center gap-1 text-left font-semibold hover:text-primary" onClick={() => {setSort(value); setDescending(sort === value ? !descending : false);}}>{label}{sort === value && (descending ? <ArrowDown size={14}/> : <ArrowUp size={14}/>)}</button></th>;
 return <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
  <header className="border-b border-slate-100 p-4 sm:p-6">
   <div className="mb-4 flex items-center justify-between gap-3"><h2 className="text-lg font-bold text-primary sm:text-xl">Personas y seguimiento</h2><div className="hidden gap-2 md:flex" aria-label="Vista de personas"><button className={layout === 'table' ? button : secondary} aria-pressed={layout === 'table'} onClick={() => setLayout('table')}>Tabla</button><button className={layout === 'cards' ? button : secondary} aria-pressed={layout === 'cards'} onClick={() => setLayout('cards')}>Tarjetas</button></div></div>
   {!groupHistory && <p className="mb-3 text-xs text-slate-500">El historial incluye solo las visitas registradas por ti.</p>}
   <div className="grid gap-3 sm:grid-cols-2">
    <label className="grid min-w-0 gap-1.5 text-sm font-medium text-slate-600"><span className="flex items-center gap-2"><Search size={16}/> Buscar</span><input type="search" className={input} placeholder="Nombre, teléfono o responsable…" value={filters.query} onChange={e => change('query', e.target.value)}/></label>
    {select('Estado', 'status', statuses.map(s => [s, statusLabel(s)] as [string, string]))}
   </div>
   <details className="group mt-3 rounded-lg border border-slate-200">
    <summary className="flex min-h-11 cursor-pointer list-none items-center justify-between gap-2 rounded-lg px-3 py-2 text-sm font-semibold text-primary focus-visible:outline-2 focus-visible:outline-primary [&::-webkit-details-marker]:hidden"><span className="flex items-center gap-2"><SlidersHorizontal size={16}/> Más filtros{advancedCount > 0 && <span className="rounded-full bg-blue-50 px-2 py-0.5">{advancedCount}</span>}</span><span aria-hidden="true" className="group-open:hidden">+</span><span aria-hidden="true" className="hidden group-open:inline">−</span></summary>
    <div className="grid gap-4 border-t border-slate-100 p-3 sm:grid-cols-2 lg:grid-cols-3">
     {select('Responsable', 'assignedTo', [['unassigned', 'Sin responsable'], ...owners])}
     {select('Tipo de persona', 'kind', kinds.map(k => [k, kindLabel(k)]))}
     {select('Clasificación', 'classification', [...Object.entries(categoryLabels), ['unclassified', 'Sin clasificar']])}
     {select('Próximo contacto', 'schedule', [['overdue', 'Vencidos'], ['today', 'Hoy'], ['upcoming', 'Futuros'], ['unscheduled', 'Sin programar']])}
     {select('Resultado de última visita', 'result', [['none', groupHistory ? 'Sin visitas registradas' : 'Sin visitas registradas por mí'], ...results.map(r => [r, r] as [string, string])])}
     <div className="grid min-w-0 gap-3 sm:col-span-2 lg:col-span-3 sm:grid-cols-2"><label className="grid min-w-0 gap-1.5 text-sm font-medium text-slate-600">Contacto desde<input type="date" className={input + ' min-w-0'} value={filters.from} max={filters.to || undefined} aria-invalid={invalidRange} onChange={e => change('from', e.target.value)}/></label><label className="grid min-w-0 gap-1.5 text-sm font-medium text-slate-600">Contacto hasta<input type="date" className={input + ' min-w-0'} value={filters.to} min={filters.from || undefined} aria-invalid={invalidRange} onChange={e => change('to', e.target.value)}/></label></div>
    </div>
   </details>
   {invalidRange && <p role="alert" className="mt-3 text-sm text-red-700">La fecha «desde» no puede ser posterior a «hasta».</p>}
   {filterCount > 0 && <div className="mt-3 flex flex-wrap items-center gap-2" aria-label="Filtros activos">{(Object.entries(filters) as [keyof PeopleFilters,string][]).filter(([field,value]) => field !== 'query' && value).map(([field,value]) => <button key={field} className="inline-flex min-h-11 max-w-full items-center gap-2 rounded-lg bg-blue-50 px-3 py-2 text-left text-xs text-primary hover:bg-blue-100 focus-visible:outline-2 focus-visible:outline-primary" aria-label={'Quitar filtro ' + filterNames[field] + ': ' + filterValue(field,value)} onClick={() => change(field,'')}><span className="min-w-0 break-words">{filterNames[field]}: {filterValue(field,value)}</span><X size={14} className="shrink-0"/></button>)}<button className="min-h-11 px-2 text-sm font-semibold text-primary underline underline-offset-4" onClick={() => onFiltersChange({...emptyPeopleFilters})}>Limpiar filtros</button></div>}
   <details className="mt-2">
    <summary className="min-h-11 cursor-pointer rounded-lg py-3 text-sm text-slate-600 focus-visible:outline-2 focus-visible:outline-primary">Orden: {sortLabels[sort]} · {descending ? 'Descendente' : 'Ascendente'}</summary>
    <div className="flex flex-wrap items-end gap-2 pb-2"><label className="grid min-w-0 flex-1 gap-1.5 text-sm font-medium text-slate-600">Ordenar por<select className={input + ' min-w-0'} value={sort} onChange={e => setSort(e.target.value as PeopleSort)}>{Object.entries(sortLabels).map(([value, label]) => <option key={value} value={value}>{label}</option>)}</select></label><button className={secondary + ' min-h-11'} aria-label={descending ? 'Cambiar a orden ascendente' : 'Cambiar a orden descendente'} onClick={() => setDescending(!descending)}>{descending ? <ArrowDown size={16}/> : <ArrowUp size={16}/>} {descending ? 'Descendente' : 'Ascendente'}</button></div>
   </details>
  </header>
  <p role="status" className="border-b border-slate-100 bg-slate-50 px-4 py-3 text-sm text-slate-600">{filtered.length} de {people.length} personas{filtered.length > 0 && ` · Mostrando ${(page - 1) * pageSize + 1}–${Math.min(page * pageSize, filtered.length)}`}</p>
  {!people.length ? <div className="p-10 text-center"><Users size={36} className="mx-auto mb-3 text-primary"/><h3 className="text-xl font-bold text-primary">El primer paso es conocer su nombre.</h3><p className="my-4 text-slate-500">Registra una nueva vida para organizar su acompañamiento.</p><button className={button} onClick={onCreate}>Registrar primera nueva vida</button></div> : !visible.length ? <div className="p-10 text-center"><p className="mb-4 text-slate-500">No hay coincidencias con estos filtros.</p><button className={secondary} onClick={() => onFiltersChange({...emptyPeopleFilters})}>Ver personas no archivadas</button></div> : <>
   <div className={layout === 'cards' ? 'hidden' : 'hidden overflow-x-auto md:block'}><table className="w-full text-left text-sm"><caption className="sr-only">Personas y resumen de visitas. Usa los encabezados para ordenar.</caption><thead className="bg-slate-50 text-xs text-slate-500"><tr>{sortColumn('Persona', 'name')}{sortColumn('Responsable', 'responsible')}{sortColumn('Próximo contacto', 'next')}{sortColumn('Última visita', 'latest')}{sortColumn('Estado', 'status')}{sortColumn('Fecha de registro', 'created')}</tr></thead><tbody className="divide-y divide-slate-100">{visible.map(row => <tr key={row.person.id} className="hover:bg-slate-50/70"><td className="p-4"><button className="flex items-center gap-2 text-left font-semibold text-primary underline-offset-4 hover:underline" onClick={() => onSelect(row.person.id)}>{row.person.name}<ArrowUpRight size={15} className="shrink-0"/></button><small className="mt-1 block text-slate-500">{kindLabel(row.person.kind)} · {classificationLabel(row.person.age_group, row.person.sex)}</small></td><td className="p-4">{row.person.responsible || 'Sin asignar'}</td><td className="p-4">{contact(row.person)}</td><td className="p-4">{latest(row)}</td><td className="p-4"><Badge value={row.person.status}/></td><td className="p-4">{registration(row.person)}</td></tr>)}</tbody></table></div>
   <div className={'grid gap-3 p-3 sm:gap-4 sm:p-5 sm:grid-cols-2 xl:grid-cols-3 ' + (layout === 'table' ? 'md:hidden' : '')}>{visible.map(row => <article key={row.person.id} className="min-w-0 rounded-xl border border-slate-200 p-4"><Badge value={row.person.status}/><button className="my-3 flex w-full items-start justify-between gap-2 text-left text-lg font-bold text-primary hover:underline" onClick={() => onSelect(row.person.id)}><span className="break-words">{row.person.name}</span><ArrowUpRight size={18} className="shrink-0"/></button><p className="text-xs text-slate-500">{kindLabel(row.person.kind)} · {classificationLabel(row.person.age_group, row.person.sex)}</p><dl className="mt-3 grid grid-cols-2 gap-3 text-sm"><div><dt className="text-xs text-slate-500">Responsable</dt><dd>{row.person.responsible || 'Sin asignar'}</dd></div><div><dt className="flex items-center gap-1 text-xs text-slate-500"><CalendarDays size={13}/> Próximo contacto</dt><dd>{contact(row.person)}</dd></div><div><dt className="mb-1 text-xs text-slate-500">Última visita</dt><dd>{latest(row)}</dd></div><div><dt className="mb-1 text-xs text-slate-500">Fecha de registro</dt><dd>{registration(row.person)}</dd></div></dl></article>)}</div>
  </>}
  <footer className="flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 p-3 sm:p-5"><label className="flex items-center gap-2 text-sm text-slate-600">Por página<select className={input + ' !w-auto'} value={pageSize} onChange={e => setPageSize(Number(e.target.value))}>{[10, 25, 50].map(size => <option key={size}>{size}</option>)}</select></label><nav aria-label="Paginación de personas" className="flex w-full items-center justify-between gap-2 sm:w-auto"><button className={secondary} disabled={page === 1} onClick={() => setPagination({key, page: page - 1})}>Anterior</button><span className="text-sm text-slate-600">{page} / {pages}</span><button className={secondary} disabled={page === pages} onClick={() => setPagination({key, page: page + 1})}>Siguiente</button></nav></footer>
 </section>;
}

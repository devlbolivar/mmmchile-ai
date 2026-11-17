import type {Person, Visit} from './records';

export type PeopleFilters = {
 query: string; status: string; assignedTo: string; kind: string;
 classification: string; schedule: string; from: string; to: string; result: string;
};
export const emptyPeopleFilters: PeopleFilters = {
 query: '', status: '', assignedTo: '', kind: '', classification: '',
 schedule: '', from: '', to: '', result: '',
};
export type PeopleSort = 'next' | 'name' | 'responsible' | 'status' | 'latest' | 'count' | 'created';
export type PersonSummary = {person: Person; latest?: Visit; count: number};
const statusPriority = ['Pendiente', 'Esperando respuesta', 'Visita aceptada', 'En seguimiento', 'Finalizado', 'Archivado'];

// Use calendar days in Chile, not elapsed 24-hour periods (DST safe).
export function registrationAge(createdAt: string, day: string) {
 const instant = new Date(createdAt);
 if (!createdAt || Number.isNaN(instant.getTime())) return null;
 const registered = /^\d{4}-\d{2}-\d{2}$/.test(createdAt) ? createdAt : new Intl.DateTimeFormat('en-CA', {timeZone:'America/Santiago',year:'numeric',month:'2-digit',day:'2-digit'}).format(instant);
 const days = Math.max(0, Math.round((Date.parse(day + 'T00:00:00Z') - Date.parse(registered + 'T00:00:00Z')) / 86400000));
 return Number.isFinite(days) ? {date: registered, days} : null;
}

const normalize = (value: string) => value.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLocaleLowerCase('es-CL');
const compare = (a: string, b: string) => a.localeCompare(b, 'es-CL', {sensitivity: 'base', numeric: true});

// Summaries only use visits already authorized by the server/RLS.
export function summarizePeople(people: Person[], visits: Visit[]): PersonSummary[] {
 const summaries = new Map<string, {latest?: Visit; count: number}>();
 for (const visit of visits) {
  const summary = summaries.get(visit.person_id) ?? {count: 0};
  summary.count++;
  if (!summary.latest || visit.date > summary.latest.date ||
   (visit.date === summary.latest.date && (visit.created_at > summary.latest.created_at ||
   (visit.created_at === summary.latest.created_at && visit.id > summary.latest.id)))) summary.latest = visit;
  summaries.set(visit.person_id, summary);
 }
 return people.map(person => ({person, ...(summaries.get(person.id) ?? {count: 0})}));
}
export function selectPeople(rows: PersonSummary[], filters: PeopleFilters, sort: PeopleSort, descending: boolean, day: string) {
 const terms = normalize(filters.query.trim()).split(/\s+/).filter(Boolean);
 return rows.filter(({person: p, latest, count}) => {
  const search = normalize([p.name, p.phone, p.responsible, p.address].join(' '));
  const category = p.age_group && p.sex ? `${p.age_group.toLowerCase()}_${p.sex.toLowerCase()}` : 'unclassified';
  if (!terms.every(term => search.includes(term))) return false;
  if (p.status === 'Archivado' && filters.status !== 'Archivado') return false;
  if (filters.status && p.status !== filters.status) return false;
  if (filters.assignedTo === 'unassigned' ? !!p.assigned_to : filters.assignedTo && p.assigned_to !== filters.assignedTo) return false;
  if (filters.kind && p.kind !== filters.kind) return false;
  if (filters.classification && category !== filters.classification) return false;
  if (filters.schedule && ['Finalizado','Archivado'].includes(p.status)) return false;
  if (filters.schedule === 'overdue' && (!p.next_date || p.next_date >= day)) return false;
  if (filters.schedule === 'today' && p.next_date !== day) return false;
  if (filters.schedule === 'upcoming' && (!p.next_date || p.next_date <= day)) return false;
  if (filters.schedule === 'unscheduled' && p.next_date) return false;
  if (filters.from && (!p.next_date || p.next_date < filters.from)) return false;
  if (filters.to && (!p.next_date || p.next_date > filters.to)) return false;
  if (filters.result === 'none' ? count !== 0 : filters.result && latest?.result !== filters.result) return false;
  return true;
 }).sort((a, b) => {
  let left: string | number, right: string | number;
  switch (sort) {
   case 'name': left = a.person.name; right = b.person.name; break;
   case 'responsible': left = a.person.responsible; right = b.person.responsible; break;
   case 'status': left = statusPriority.indexOf(a.person.status); right = statusPriority.indexOf(b.person.status); break;
   case 'latest': left = a.latest?.date ?? ''; right = b.latest?.date ?? ''; break;
   case 'count': left = a.count; right = b.count; break;
   case 'created': left = a.person.created_at; right = b.person.created_at; break;
   default: left = a.person.next_date; right = b.person.next_date;
  }
  // Missing dates/assignments stay at the end in either direction.
  if (left === '' && right !== '') return 1;
  if (right === '' && left !== '') return -1;
  const order = typeof left === 'number' && typeof right === 'number' ? left - right : compare(String(left), String(right));
  // Within a status, surface the oldest registrations first in either direction.
  const ageOrder = sort === 'status' ? compare(a.person.created_at || '9999', b.person.created_at || '9999') : 0;
  return order * (descending ? -1 : 1) || ageOrder || compare(a.person.name, b.person.name) || compare(a.person.id, b.person.id);
 });
}

import {test} from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {PGlite} from '@electric-sql/pglite';

test('lifecycle migration preserves records, supports six states, archives and restores without deleting history', async () => {
 const db=new PGlite();
 try {
  await db.exec(`create role anon;create role authenticated;create role service_role;
   create schema auth;create table auth.users(id uuid primary key,email text,email_confirmed_at timestamptz);
   create function auth.uid() returns uuid language sql stable as $$select nullif(current_setting('request.jwt.claim.sub',true),'')::uuid$$;
   grant usage on schema auth,public to authenticated,anon;grant execute on function auth.uid() to authenticated,anon;`);
  const migrate=async file=>db.exec(await readFile(new URL('../supabase/migrations/'+file,import.meta.url),'utf8'));
  for(const file of ['20260906003209_add_church_followup.sql','20260906212656_classify_followup_assignments.sql','20260914143213_add_followup_group_leaders.sql','20260914172225_add_followup_activity.sql']) await migrate(file);
  const supervisor='10000000-0000-4000-8000-000000000001', visitor='10000000-0000-4000-8000-000000000002';
  await db.query(`insert into auth.users values ($1,'s@example.test',now()),($2,'v@example.test',now())`,[supervisor,visitor]);
  await db.query(`insert into public.ac_members(id,email,name,role) values ($1,'s@example.test','Supervisor','supervisor'),($2,'v@example.test','Visitador','visitador')`,[supervisor,visitor]);
  const as=async id=>{await db.exec('set role authenticated');await db.query("select set_config('request.jwt.claim.sub',$1,false)",[id]);};
  const rpc=async(name,args)=>db.query(`select public.${name}(${args.map((_,i)=>'$'+(i+1)).join(',')}) as value`,args);
  const base={name:'Persona prueba',kind:'Nuevo creyente',status:'Pendiente',consent:true,assignedTo:'',ageGroup:'Adulto',sex:'Femenino',nextDate:''};
  const save=async(id,data)=>rpc('ac_save_person',[id,JSON.stringify({...base,...data})]);
  await as(supervisor);
  const id=(await save(null,{})).rows[0].value;
  const visit={personId:id,date:'2026-01-01',visitor:'Supervisor',result:'Realizada',notes:'Conservar historial'};
  await rpc('ac_record_visit',[JSON.stringify(visit)]);
  await save(id,{});
  const before=(await db.query('select * from public.ac_people where id=$1',[id])).rows[0];
  const visitsBefore=(await db.query('select * from public.ac_visits')).rows;
  await db.exec('reset role');await migrate('20261117220000_followup_lifecycle.sql');await as(supervisor);
  const after=(await db.query('select * from public.ac_people where id=$1',[id])).rows[0];
  assert.deepEqual(after,{...before,archive_reason:''});
  assert.deepEqual((await db.query('select * from public.ac_visits')).rows,visitsBefore);
  for(const status of ['Pendiente','Esperando respuesta','Visita aceptada','En seguimiento','Finalizado']) await save(id,{status});
  await assert.rejects(()=>save(id,{status:'Desconocido'}),/check constraint/);
  await assert.rejects(()=>save(id,{status:'Archivado'}),/check constraint/);
  await assert.rejects(()=>save(id,{status:'Archivado',archiveReason:'Otro motivo',nextDate:'2026-12-01'}),/check constraint/);
  await save(id,{status:'Archivado',archiveReason:'Solicitó no ser contactada'});
  await assert.rejects(()=>rpc('ac_record_visit',[JSON.stringify(visit)]),/followup_closed/);
  await assert.rejects(()=>save(id,{status:'Pendiente'}),/contact_consent_required/);
  await as(visitor);
  await assert.rejects(()=>save(id,{status:'Pendiente',restoreConsent:true}),/access_denied/);
  await as(supervisor);
  await save(id,{status:'Pendiente',restoreConsent:true});
  assert.equal((await db.query('select archive_reason from public.ac_people where id=$1',[id])).rows[0].archive_reason,'');
  assert.deepEqual((await db.query('select * from public.ac_visits')).rows,visitsBefore);
  await rpc('ac_record_visit',[JSON.stringify(visit)]);
  assert.equal((await db.query('select count(*)::int as n from public.ac_visits')).rows[0].n,2);
 } finally {await db.close();}
});

import {test} from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {PGlite} from '@electric-sql/pglite';

test('activity is transactional, private, append-only and uses trusted actors',async()=>{
 const db=new PGlite();
 try{
  await db.exec(`create role anon;create role authenticated;create role service_role;
   create schema auth;create table auth.users(id uuid primary key,email text,email_confirmed_at timestamptz);
   create function auth.uid() returns uuid language sql stable as $$select nullif(current_setting('request.jwt.claim.sub',true),'')::uuid$$;
   grant usage on schema auth,public to authenticated,anon;grant execute on function auth.uid() to authenticated,anon;`);
  for(const file of ['20260906003209_add_church_followup.sql','20260906212656_classify_followup_assignments.sql','20260914143213_add_followup_group_leaders.sql','20260914172225_add_followup_activity.sql']){
   await db.exec(await readFile(new URL('../supabase/migrations/'+file,import.meta.url),'utf8'));
  }
  const ids=Array.from({length:10},(_,i)=>'10000000-0000-4000-8000-'+String(i+1).padStart(12,'0'));
  const [supervisor,youth,men,women,ym,yf,am,af,invitee,outsider]=ids;
  for(const [i,id] of ids.entries()){
   await db.query('insert into auth.users values ($1,$2,now())',[id,'audit'+i+'@example.test']);
  }
  const members=[
   [supervisor,'supervisor','adulto_masculino',null],
   [youth,'lider','joven_masculino','jovenes'],
   [men,'lider','adulto_masculino','hombres_adultos'],
   [women,'lider','adulto_femenino','mujeres_adultas'],
   [ym,'visitador','joven_masculino',null],[yf,'visitador','joven_femenino',null],
   [am,'visitador','adulto_masculino',null],[af,'visitador','adulto_femenino',null],
  ];
  for(const [id,role,category,group] of members){
   await db.query('insert into public.ac_members(id,email,name,role,visit_category,leadership_group) values ($1,$2,$3,$4,$5,$6)',[id,'audit'+ids.indexOf(id)+'@example.test','Integrante '+ids.indexOf(id),role,category,group]);
  }

  const as=async id=>{await db.exec('set role authenticated');await db.query("select set_config('request.jwt.claim.sub',$1,false)",[id]);};
  const rpc=async(name,args)=>db.query(`select public.${name}(${args.map((_,i)=>'$'+(i+1)).join(',')}) as value`,args);
  const all=async()=>(await db.query('select * from public.ac_activity order by created_at,id')).rows;
  const base={name:'Persona prueba',phone:'+56981916658',address:'Dirección privada',kind:'Nuevo creyente',status:'Pendiente',consent:true,nextDate:'',assignedTo:'',ageGroup:'Joven',sex:'Masculino'};
  const save=async(id,patch={})=>(await rpc('ac_save_person',[id,JSON.stringify({...base,...patch})])).rows[0].value;
  await as(ym);
  const person=await save(null,{created_by:supervisor});
  assert.equal((await all()).length,0);
  await as(supervisor);
  let event=(await all()).find(e=>e.action==='person.created');
  assert.equal(event.actor_id,ym);
  assert.equal(event.target_id,person);
  assert.equal(event.actor_name,'Integrante 4');
  await as(youth);await save(person,{assignedTo:ym});
  await as(supervisor);
  event=(await all()).find(e=>e.action==='person.assigned');
  assert.equal(event.actor_id,youth);
  assert.deepEqual(event.details,{fields:['assigned_to'],previous_assignee:null,new_assignee:'Integrante 4'});
  const before=(await all()).length;
  await save(person,{assignedTo:ym});
  assert.equal((await all()).length,before,'no event for unchanged saves');
  await assert.rejects(()=>save(person,{assignedTo:af}),/invalid_assignee/);
  assert.equal((await all()).length,before,'failed writes produce no events');
  await as(ym);
  const visit=(await rpc('ac_record_visit',[JSON.stringify({personId:person,date:'2026-01-01',visitor:'Persona que visitó',result:'Realizada',notes:'NOTA PASTORAL PRIVADA',nextDate:'2026-01-08'})])).rows[0].value;
  await as(supervisor);
  event=(await all()).find(e=>e.action==='visit.created');
  assert.equal(event.actor_id,ym);assert.equal(event.target_id,visit);
  assert.deepEqual(event.details,{person_id:person});
  await rpc('ac_update_team_member',[ym,'visitador',false,'joven_masculino',null]);
  const changed=(await all()).filter(e=>e.action==='person.assigned').at(-1);
  assert.equal(changed.actor_id,supervisor);
  assert.equal(changed.details.previous_assignee,'Integrante 4');
  assert.equal(changed.details.new_assignee,null);
  assert.equal((await all()).find(e=>e.action==='member.updated').details.after.active,false);
  await rpc('ac_prepare_team_invitation',['audit8@example.test','Invitado','lider',null,'jovenes']);
  await as(invitee);await rpc('ac_accept_invitation',[]);
  await as(supervisor);
  assert.equal((await all()).find(e=>e.action==='invitation.accepted').actor_id,invitee);
  await rpc('ac_prepare_team_invitation',['pending@example.test','Pendiente','visitador',null,null]);
  await rpc('ac_prepare_team_invitation',['pending@example.test','Pendiente','visitador',null,null]);
  const session='20000000-0000-4000-8000-000000000001';
  for(const id of [supervisor,youth,men,women,ym,yf,outsider]){
   await as(id);
   if(id!==supervisor){
    assert.deepEqual(await all(),[]);
    await assert.rejects(()=>db.query('select * from public.ac_activity_page()'),/supervisor_required/);
   }
   await assert.rejects(()=>db.query("insert into public.ac_activity(actor_name,action) values ('Inventado','access.login')"),/permission denied/);
   await assert.rejects(()=>db.query("update public.ac_activity set actor_name='Inventado'"),/permission denied/);
   await assert.rejects(()=>db.query('delete from public.ac_activity'),/permission denied/);
   await assert.rejects(()=>db.query('truncate public.ac_activity'),/permission denied/);
   await assert.rejects(()=>rpc('ac_log_server_activity',[supervisor,'access.login',session,null]),/permission denied/);
  }
  await db.exec('set role anon');
  await assert.rejects(all,/permission denied/);
  await assert.rejects(()=>db.query('select * from public.ac_activity_page()'),/permission denied/);
  await db.exec('set role service_role');
  await rpc('ac_log_server_activity',[supervisor,'access.login',session,null]);
  await rpc('ac_log_server_activity',[supervisor,'access.login',session,null]);
  await rpc('ac_log_server_activity',[supervisor,'access.logout',session,null]);
  await rpc('ac_log_server_activity',[ym,'access.login',session,null]); // inactive: ignored
  await rpc('ac_log_server_activity',[supervisor,'invitation.mail_failed',null,'pending@example.test']);
  await rpc('ac_log_server_activity',[supervisor,'invitation.mail_sent',null,'pending@example.test']);
  await assert.rejects(()=>rpc('ac_log_server_activity',[supervisor,'person.created',session,null]),/invalid_activity/);
  await assert.rejects(()=>db.query('delete from public.ac_activity'),/permission denied/);
  await as(supervisor);
  assert.equal((await all()).filter(e=>e.action==='access.login').length,1);
  assert.equal((await all()).filter(e=>e.action==='access.logout').length,1);
  assert.equal((await all()).filter(e=>e.action==='invitation.mail_failed').length,1);
  assert.equal((await all()).filter(e=>e.action==='invitation.mail_sent').length,1);
  await rpc('ac_cancel_invitation',['pending@example.test']);
  assert.equal((await all()).filter(e=>e.action==='invitation.cancelled').length,1);
  const serialized=JSON.stringify(await all());
  for(const secret of ['+56981916658','Dirección privada','NOTA PASTORAL PRIVADA','Persona que visitó','access_token','refresh_token','password'])assert.equal(serialized.includes(secret),false,secret);
  const count=(await all()).length;
  await db.exec('begin');
  await save(null);
  await db.exec('rollback');
  assert.equal((await all()).length,count,'activity rolls back with the business transaction');
  // Fixed dates exercise Chilean local-day boundaries and stable pagination on equal timestamps.
  await db.exec('reset role');
  await db.query(`insert into public.ac_activity(created_at,actor_id,actor_name,action)
    select '2026-01-02T03:00:00Z'::timestamptz,$1,'Prueba de paginación','access.login' from generate_series(1,60)`,[supervisor]);
  await db.query(`insert into public.ac_activity(created_at,actor_id,actor_name,action) values
   ('2026-01-02T02:59:59Z',$1,'Día anterior','access.login'),
   ('2026-01-03T03:00:00Z',$1,'Día siguiente','access.login')`,[supervisor]);
  await as(supervisor);
  const page=async(at=null,id=null)=>(await db.query('select * from public.ac_activity_page($1,$2,$3,$4,$5,$6)',['2026-01-02','2026-01-02',supervisor,'access.login',at,id])).rows;
  const first=await page();assert.equal(first.length,51);
  const last=first[49];
  const second=await page(last.created_at,last.id);assert.equal(second.length,10);
  assert.equal(new Set([...first.slice(0,50),...second].map(e=>e.id)).size,60);
  assert.ok([...first,...second].every(e=>e.actor_name==='Prueba de paginación'));
  await assert.rejects(()=>db.query("select * from public.ac_activity_page('2026-02-01','2026-01-01')"),/invalid_filters/);
  // Chile jumps forward at midnight on 2026-09-06; the date filter still includes its full local day.
  await db.exec('reset role');
  await db.query(`insert into public.ac_activity(created_at,actor_id,actor_name,action) values
   ('2026-09-06T03:59:59Z',$1,'Antes del cambio','access.logout'),
   ('2026-09-06T04:00:00Z',$1,'Inicio del día','access.logout'),
   ('2026-09-07T02:59:59Z',$1,'Fin del día','access.logout'),
   ('2026-09-07T03:00:00Z',$1,'Día siguiente','access.logout')`,[supervisor]);
  await as(supervisor);
  const dst=(await db.query("select * from public.ac_activity_page('2026-09-06','2026-09-06',null,'access.logout')")).rows;
  assert.deepEqual(dst.map(e=>e.actor_name),['Fin del día','Inicio del día']);
 }finally{await db.close();}
});

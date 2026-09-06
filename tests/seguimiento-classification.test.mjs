import {test} from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {PGlite} from '@electric-sql/pglite';

test('migration preserves legacy records and enforces classification through authenticated RPCs',async()=>{
 const db=new PGlite();
 try{
 await db.exec(`create role anon;create role authenticated;create role service_role;
 create schema auth;create table auth.users(id uuid primary key,email text,email_confirmed_at timestamptz);
 create function auth.uid() returns uuid language sql stable as $$select nullif(current_setting('request.jwt.claim.sub',true),'')::uuid$$;
 grant usage on schema auth,public to authenticated,anon;grant execute on function auth.uid() to authenticated,anon;`);
 const migrate=async file=>db.exec(await readFile(new URL('../supabase/migrations/'+file,import.meta.url),'utf8'));
 await migrate('20260906003209_add_church_followup.sql');
 const supervisor='10000000-0000-4000-8000-000000000001',visitor='10000000-0000-4000-8000-000000000002',invitee='10000000-0000-4000-8000-000000000003';
 await db.query(`insert into auth.users values ($1,'s@example.test',now()),($2,'v@example.test',now()),($3,'i@example.test',now())`,[supervisor,visitor,invitee]);
 await db.query(`insert into public.ac_members(id,email,name,role) values ($1,'s@example.test','Supervisor','supervisor'),($2,'v@example.test','Visitador','visitador')`,[supervisor,visitor]);
 const as=async id=>{await db.exec('set role authenticated');await db.query("select set_config('request.jwt.claim.sub',$1,false)",[id]);};
 const rpc=async(name,args)=>db.query(`select public.${name}(${args.map((_,i)=>'$'+(i+1)).join(',')}) as value`,args);
 const base={name:'Persona prueba',kind:'Nuevo creyente',status:'Pendiente',consent:true,assignedTo:visitor};
 await as(supervisor);
 const legacy=(await rpc('ac_save_person',[null,JSON.stringify(base)])).rows[0].value;
 await rpc('ac_record_visit',[JSON.stringify({personId:legacy,date:'2026-01-01',visitor:'Supervisor',result:'Realizada',notes:'Historial conservado'})]);
 await db.exec('reset role');
 await migrate('20260906212656_classify_followup_assignments.sql');
 await as(supervisor);
 let row=(await db.query('select * from public.ac_people where id=$1',[legacy])).rows[0];
 assert.equal(row.age_group,null);assert.equal(row.sex,null);assert.equal(row.assigned_to,visitor);
 assert.equal((await db.query('select notes from public.ac_visits')).rows[0].notes,'Historial conservado');
 const save=(id,data)=>rpc('ac_save_person',[id,JSON.stringify(data)]);
 await assert.rejects(()=>save(null,base),/classification_required/);
 for(const ageGroup of ['Joven','Adulto'])for(const sex of ['Masculino','Femenino']){
  const category=ageGroup.toLowerCase()+'_'+sex.toLowerCase();
  await rpc('ac_update_member_assignment',[visitor,'visitador',true,category]);
  const person=(await save(null,{...base,ageGroup,sex})).rows[0].value;
  await assert.rejects(()=>save(person,{...base,ageGroup,sex:sex==='Masculino'?'Femenino':'Masculino'}),/invalid_assignee/);
 }
 await rpc('ac_update_member_assignment',[visitor,'visitador',true,'joven_masculino']);
 await save(legacy,{...base,ageGroup:'Joven',sex:'Masculino'});
 await as(visitor);
 await assert.rejects(()=>rpc('ac_update_member_assignment',[visitor,'visitador',true,'adulto_femenino']),/access_denied/);
 await assert.rejects(()=>rpc('ac_prepare_classified_invitation',['i@example.test','Invitado','supervisor','joven_masculino']),/supervisor_required/);
 await assert.rejects(()=>save(null,{...base,ageGroup:'Joven',sex:'Masculino'}),/supervisor_required/);
 await assert.rejects(()=>save(legacy,{...base,ageGroup:'Adulto',sex:'Masculino'}),/invalid_assignee/);
 await save(null,{...base,assignedTo:'',ageGroup:'Adulto',sex:'Femenino'});
 const directory=(await db.query('select * from public.ac_assignment_directory()')).rows;
 assert.deepEqual(Object.keys(directory[0]).sort(),['id','name','visit_category']);
 await as(supervisor);
 await assert.rejects(()=>rpc('ac_update_member_assignment',[supervisor,'visitador',true,'joven_masculino']),/access_denied/);
 await rpc('ac_update_member_assignment',[supervisor,'supervisor',true,'adulto_femenino']);
 const released=(await rpc('ac_update_member_assignment',[visitor,'visitador',true,'adulto_femenino'])).rows[0].value;
 assert.ok(released>=1);
 assert.equal((await db.query('select assigned_to from public.ac_people where id=$1',[legacy])).rows[0].assigned_to,null);
 assert.equal((await db.query('select count(*)::int as n from public.ac_visits')).rows[0].n,1);
 await assert.rejects(()=>rpc('ac_update_member_assignment',[visitor,'visitador',true,'invalid']),/check constraint/);
 await rpc('ac_prepare_classified_invitation',['i@example.test','Invitado','visitador','joven_femenino']);
 await as(invitee);await rpc('ac_accept_invitation',[]);
 assert.equal((await db.query('select visit_category from public.ac_members')).rows[0].visit_category,'joven_femenino');
 await as(supervisor);
 await rpc('ac_update_member_assignment',[visitor,'visitador',false,'adulto_femenino']);
 await assert.rejects(()=>save(null,{...base,ageGroup:'Adulto',sex:'Femenino'}),/invalid_assignee/);
 await db.exec('set role anon');
 await assert.rejects(()=>rpc('ac_assignment_directory',[]),/permission denied/);
 }finally{await db.close();}
});

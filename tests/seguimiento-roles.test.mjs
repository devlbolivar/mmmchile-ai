import {test} from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {PGlite} from '@electric-sql/pglite';

test('RLS and RPCs enforce invitation, role, ownership, reassignment and deactivation rules',async()=>{
 const db=new PGlite();
 try{
 await db.exec(`create role anon;create role authenticated;create role service_role;
 create schema auth;create table auth.users(id uuid primary key,email text,email_confirmed_at timestamptz);
 create function auth.uid() returns uuid language sql stable as $$select nullif(current_setting('request.jwt.claim.sub',true),'')::uuid$$;
 grant usage on schema auth,public to authenticated,anon;grant execute on function auth.uid() to authenticated,anon;`);
 await db.exec(await readFile(new URL('../supabase/migrations/20260906003209_add_church_followup.sql',import.meta.url),'utf8'));
 const supervisor='10000000-0000-4000-8000-000000000001',a='10000000-0000-4000-8000-000000000002',b='10000000-0000-4000-8000-000000000003',outsider='10000000-0000-4000-8000-000000000004';
 await db.query(`insert into auth.users values ($1,'supervisor@example.test',now()),($2,'a@example.test',now()),($3,'b@example.test',now()),($4,'outside@example.test',now())`,[supervisor,a,b,outsider]);
 await db.query(`insert into public.ac_members(id,name,email,role) values ($1,'Supervisor','supervisor@example.test','supervisor'),($2,'Visitador A','a@example.test','visitador'),($3,'Visitador B','b@example.test','visitador')`,[supervisor,a,b]);
 const as=async id=>{await db.exec('set role authenticated');await db.query(`select set_config('request.jwt.claim.sub',$1,false)`,[id]);};
 const rpc=async(name,args)=>db.query(`select public.${name}(${args.map((_,i)=>'$'+(i+1)).join(',')}) as value`,args);
 const base={name:'Nueva vida',phone:'',address:'',kind:'Nuevo creyente',status:'Pendiente',consent:true,nextDate:'',assignedTo:''};
 await db.query('insert into ac_private.prayer_moderators(user_id) values ($1)',[supervisor]);
 await as(supervisor);assert.equal((await rpc('ac_can_moderate_prayers',[])).rows[0].value,true);
 await as(a);assert.equal((await rpc('ac_can_moderate_prayers',[])).rows[0].value,false);
 const person=(await rpc('ac_save_person',[null,JSON.stringify(base)])).rows[0].value;
 await assert.rejects(()=>db.query(`update public.ac_members set role='supervisor' where id=$1`,[a]),/permission denied/);
 await assert.rejects(()=>rpc('ac_prepare_invitation',['intruder@example.test','Intruder','supervisor']),/supervisor_required/);
 await assert.rejects(()=>rpc('ac_save_person',[person,JSON.stringify({...base,assignedTo:a})]),/supervisor_required/);
 const visit={personId:person,date:'2026-01-01',visitor:'A y acompañante',result:'Realizada',notes:'Notas privadas A',nextDate:'2026-01-08',created_by:supervisor,author_name:'Forged author'};
 await rpc('ac_record_visit',[JSON.stringify(visit)]);
 let rows=(await db.query('select * from public.ac_visits')).rows;assert.equal(rows.length,1);assert.equal(rows[0].created_by,a);assert.equal(rows[0].author_name,'Visitador A');
 await as(b);assert.equal((await db.query('select * from public.ac_people')).rows.length,0);assert.equal((await db.query('select * from public.ac_visits')).rows.length,0);
 await assert.rejects(()=>rpc('ac_record_visit',[JSON.stringify(visit)]),/access_denied/);
 await as(supervisor);assert.equal((await db.query('select * from public.ac_visits')).rows.length,1);
 await rpc('ac_save_person',[person,JSON.stringify({...base,assignedTo:b})]);
 await as(b);assert.equal((await db.query('select * from public.ac_people')).rows.length,1);assert.equal((await db.query('select * from public.ac_visits')).rows.length,0);
 await rpc('ac_record_visit',[JSON.stringify({...visit,visitor:'Visitador B',notes:'Notas privadas B'})]);
 assert.equal((await db.query('select * from public.ac_visits')).rows.length,1);
 await as(a);rows=(await db.query('select * from public.ac_visits')).rows;assert.equal(rows.length,1);assert.equal(rows[0].notes,'Notas privadas A');
 await as(supervisor);assert.equal((await db.query('select * from public.ac_visits')).rows.length,2);
 await assert.rejects(()=>rpc('ac_update_member',[supervisor,'visitador',false]),/access_denied/);
 await rpc('ac_update_member',[b,'visitador',false]);
 await as(b);assert.equal((await db.query('select * from public.ac_people')).rows.length,0);assert.equal((await db.query('select * from public.ac_visits')).rows.length,0);await assert.rejects(()=>rpc('ac_record_visit',[JSON.stringify(visit)]),/access_denied/);
 await as(supervisor);assert.equal((await db.query('select assigned_to from public.ac_people')).rows[0].assigned_to,null);assert.equal((await db.query('select * from public.ac_visits')).rows.length,2);
 await as(outsider);await rpc('ac_accept_invitation',[]);assert.equal((await db.query('select * from public.ac_members')).rows.length,0);await assert.rejects(()=>rpc('ac_save_person',[null,JSON.stringify(base)]),/access_denied/);
 await as(supervisor);await rpc('ac_prepare_invitation',['outside@example.test','Invitado','visitador']);
 await as(outsider);await rpc('ac_accept_invitation',[]);rows=(await db.query('select * from public.ac_members')).rows;assert.equal(rows.length,1);assert.equal(rows[0].role,'visitador');
 await as(supervisor);await rpc('ac_update_member',[outsider,'visitador',false]);
 await as(outsider);await rpc('ac_accept_invitation',[]);assert.equal((await db.query('select active from public.ac_members')).rows[0].active,false);
 // Direct table writes cannot bypass attribution or assignment enforcement.
 await as(a);await assert.rejects(()=>db.query('delete from public.ac_visits'),/permission denied/);
 await db.exec('set role anon');await assert.rejects(()=>db.query('select * from public.ac_people'),/permission denied/);
 }finally{await db.close();}
});

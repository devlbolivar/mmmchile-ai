import {test} from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {PGlite} from '@electric-sql/pglite';

test('three leadership groups enforce reads, assignments, membership and classification boundaries',async()=>{
 const db=new PGlite();
 try{
  await db.exec(`create role anon;create role authenticated;create role service_role;
   create schema auth;create table auth.users(id uuid primary key,email text,email_confirmed_at timestamptz);
   create function auth.uid() returns uuid language sql stable as $$select nullif(current_setting('request.jwt.claim.sub',true),'')::uuid$$;
   grant usage on schema auth,public to authenticated,anon;grant execute on function auth.uid() to authenticated,anon;`);
  for(const file of ['20260906003209_add_church_followup.sql','20260906212656_classify_followup_assignments.sql','20260914143213_add_followup_group_leaders.sql']){
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
  // Legacy unclassified data remains supervisor-only for leaders.
  const legacy=(await db.query(`insert into public.ac_people(name,kind,status,consent,created_by) values ('Ficha anterior','Nuevo creyente','Pendiente',true,$1) returning id`,[supervisor])).rows[0].id;
  const as=async id=>{await db.exec('set role authenticated');await db.query("select set_config('request.jwt.claim.sub',$1,false)",[id]);};
  const rpc=async(name,args)=>db.query(`select public.${name}(${args.map((_,i)=>'$'+(i+1)).join(',')}) as value`,args);
  const base={name:'Nueva vida',phone:'',address:'',kind:'Nuevo creyente',status:'Pendiente',consent:true,nextDate:'',assignedTo:'',ageGroup:'Joven',sex:'Masculino'};
  const save=async(id,patch={})=>(await rpc('ac_save_person',[id,JSON.stringify({...base,...patch})])).rows[0].value;
  const visit=async(personId,patch={})=>(await rpc('ac_record_visit',[JSON.stringify({personId,date:'2026-01-01',visitor:'Visita prueba',result:'Realizada',notes:'Observación privada',nextDate:'2026-01-08',...patch})])).rows[0].value;
  const listPeople=async()=>(await db.query('select id from public.ac_people')).rows.map(r=>r.id).sort();
  const listVisits=async()=>(await db.query('select id from public.ac_visits')).rows.map(r=>r.id).sort();
  await as(supervisor);
  const pYM=await save(null),pYF=await save(null,{sex:'Femenino'}),pAM=await save(null,{ageGroup:'Adulto'}),pAF=await save(null,{ageGroup:'Adulto',sex:'Femenino'});
  const all=[pYM,pYF,pAM,pAF,legacy].sort();
  const vYM=await visit(pYM),vYF=await visit(pYF),vAM=await visit(pAM),vAF=await visit(pAF);
  assert.deepEqual(await listPeople(),all);
  assert.deepEqual(await listVisits(),[vYM,vYF,vAM,vAF].sort());
  for(const [leader,people,visits] of [[youth,[pYM,pYF],[vYM,vYF]],[men,[pAM],[vAM]],[women,[pAF],[vAF]]]){
   await as(leader);
   assert.deepEqual(await listPeople(),people.sort());
   assert.deepEqual(await listVisits(),visits.sort());
   await assert.rejects(()=>rpc('ac_prepare_team_invitation',['not-allowed@example.test','Persona','visitador',null,null]),/supervisor_required/);
   await assert.rejects(()=>rpc('ac_update_team_member',[ym,'supervisor',true,'joven_masculino',null]),/access_denied/);
   await assert.rejects(()=>rpc('ac_cancel_invitation',['anything@example.test']),/supervisor_required/);
   await assert.rejects(()=>db.query("update public.ac_members set role='supervisor' where id=$1",[leader]),/permission denied/);
  }
  await as(youth);
  await save(pYM,{assignedTo:ym});
  await save(pYF,{sex:'Femenino',assignedTo:yf});
  await assert.rejects(()=>save(pYF,{sex:'Femenino',assignedTo:ym}),/invalid_assignee/);
  await assert.rejects(()=>save(pAM,{ageGroup:'Adulto',assignedTo:am}),/access_denied/);
  await assert.rejects(()=>save(pAF,{ageGroup:'Adulto',sex:'Femenino',assignedTo:af}),/access_denied/);
  await assert.rejects(()=>visit(pAM),/access_denied/);
  await assert.rejects(()=>save(pYM,{ageGroup:'Adulto',assignedTo:''}),/classification_change_requires_supervisor/);
  await assert.rejects(()=>save(pYM,{sex:'Femenino',assignedTo:''}),/classification_change_requires_supervisor/);
  await assert.rejects(()=>save(legacy),/access_denied/);
  const youthOwnVisit=await visit(pYF,{created_by:supervisor,author_name:'Forged'});
  assert.equal((await db.query('select created_by from public.ac_visits where id=$1',[youthOwnVisit])).rows[0].created_by,youth);
  // A leader may register someone from another group, but cannot claim visibility by being creator.
  const outsideCreated=await save(null,{ageGroup:'Adulto',sex:'Femenino'});
  assert.equal((await listPeople()).includes(outsideCreated),false);
  await assert.rejects(()=>save(outsideCreated,{ageGroup:'Adulto',sex:'Femenino'}),/access_denied/);
  await assert.rejects(()=>save(null,{ageGroup:'Adulto',sex:'Femenino',assignedTo:af}),/supervisor_required/);
  await as(men);await save(pAM,{ageGroup:'Adulto',assignedTo:am});
  await as(women);await save(pAF,{ageGroup:'Adulto',sex:'Femenino',assignedTo:af});
  assert.ok((await listPeople()).includes(outsideCreated));
  await as(ym);
  assert.deepEqual(await listPeople(),[pYM]);
  assert.deepEqual(await listVisits(),[]);
  const visitorVisit=await visit(pYM);
  assert.deepEqual(await listVisits(),[visitorVisit]);
  await assert.rejects(()=>save(pYM,{assignedTo:youth}),/supervisor_required/);
  const visitorOwned=await save(null);
  await assert.rejects(()=>save(visitorOwned,{ageGroup:'Adulto'}),/classification_change_requires_supervisor/);
  await as(youth);
  assert.ok((await listVisits()).includes(visitorVisit));
  // Reassignment doesn't expose another visitor's notes, creator still sees their own ficha.
  await save(visitorOwned,{assignedTo:youth});
  await as(ym);assert.ok((await listPeople()).includes(visitorOwned));
  await as(supervisor);
  // Moving a ficha to another group moves the leadership scope immediately, including its history.
  await save(pYM,{ageGroup:'Adulto',assignedTo:am});
  await as(youth);
  assert.equal((await listPeople()).includes(pYM),false);
  assert.equal((await listVisits()).includes(vYM),false);
  await assert.rejects(()=>visit(pYM),/access_denied/);
  await as(men);assert.ok((await listPeople()).includes(pYM));assert.ok((await listVisits()).includes(visitorVisit));
  await as(ym);assert.ok((await listVisits()).includes(visitorVisit));assert.equal((await listPeople()).includes(pYM),false);
  await as(supervisor);
  await assert.rejects(()=>rpc('ac_update_team_member',[supervisor,'lider',true,'joven_masculino','jovenes']),/access_denied/);
  await assert.rejects(()=>rpc('ac_update_team_member',[youth,'lider',true,'joven_masculino',null]),/check constraint/);
  await assert.rejects(()=>rpc('ac_update_team_member',[youth,'lider',true,'adulto_masculino','jovenes']),/check constraint/);
  const count=(await rpc('ac_update_team_member',[youth,'lider',true,'adulto_masculino','hombres_adultos'])).rows[0].value;
  assert.ok(count>=1);
  await as(youth);
  assert.equal((await listPeople()).includes(pYF),false);
  assert.ok((await listPeople()).includes(pAM));
  assert.equal((await listVisits()).includes(youthOwnVisit),false);
  await as(supervisor);
  await rpc('ac_update_team_member',[youth,'lider',false,'adulto_masculino','hombres_adultos']);
  await as(youth);assert.deepEqual(await listPeople(),[]);assert.deepEqual(await listVisits(),[]);
  await assert.rejects(()=>visit(pAM),/access_denied/);
  await as(supervisor);
  // Legacy APIs cannot bypass authorization or produce leaders without scope.
  await assert.rejects(()=>rpc('ac_prepare_invitation',['bad@example.test','Persona','lider']),/check constraint/);
  await assert.rejects(()=>rpc('ac_prepare_classified_invitation',['bad@example.test','Persona','lider','joven_masculino']),/check constraint/);
  await rpc('ac_prepare_team_invitation',['audit8@example.test','Invitado','lider',null,'jovenes']);
  await as(invitee);await rpc('ac_accept_invitation',[]);
  const accepted=(await db.query('select role,leadership_group,visit_category from public.ac_members where id=$1',[invitee])).rows[0];
  assert.deepEqual(accepted,{role:'lider',leadership_group:'jovenes',visit_category:null});
  assert.ok((await listPeople()).includes(pYF));
  await as(outsider);assert.deepEqual(await listPeople(),[]);assert.deepEqual(await listVisits(),[]);
  await assert.rejects(()=>save(null),/access_denied/);
  await db.exec('set role anon');
  await assert.rejects(()=>rpc('ac_can_read_visit',[pYF,yf]),/permission denied/);
  await assert.rejects(()=>rpc('ac_update_team_member',[invitee,'supervisor',true,null,null]),/permission denied/);
 }finally{await db.close();}
});

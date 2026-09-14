import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {createRequire} from 'node:module';
import test from 'node:test';
import ts from 'typescript';

function load(path,mocks={},environment={env:{}},logger=console){
 const file=new URL(path,import.meta.url),module={exports:{}};
 const {outputText}=ts.transpileModule(readFileSync(file,'utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2022}});
 const native=createRequire(file);
 new Function('require','module','exports','process','console',outputText)(name=>name in mocks?mocks[name]:native(name),module,module.exports,environment,logger);
 return module.exports;
}
const activity=load('../src/lib/seguimiento/activity.ts');
test('activity validates real dates, date order, actor, action and cursor',()=>{
 const base={from:'',to:'',actor:'',action:''};
 assert.equal(activity.activityFilterSchema.safeParse(base).success,true);
 for(const patch of [{from:'2026-02-30'},{from:'2026-09-10',to:'2026-09-01'},{actor:'other'},{action:'arbitrary'},{cursor:{at:'not a date',id:'x'}}]){
  assert.equal(activity.activityFilterSchema.safeParse({...base,...patch}).success,false);
 }
 assert.equal(activity.activityFilterSchema.safeParse({...base,from:'2026-09-06',to:'2026-09-06',action:'access.login'}).success,true);
 assert.match(activity.activityDetail({action:'person.assigned',details:{previous_assignee:'Ana',new_assignee:'Luis',fields:['assigned_to','phone']}}),/Ana → Luis. Campos: teléfono/);
 assert.match(activity.activityDetail({action:'member.updated',details:{before:{role:'visitador',active:true},after:{role:'lider',active:true,leadership_group:'jovenes'}}}),/Visitador · Activo → Líder · Jóvenes · Activo/);
 assert.match(activity.activityDate('2026-01-02T03:00:00Z'),/00:00/);
});

test('access identity is verified; errors never expose tokens or block the caller',async()=>{
 const actor='10000000-0000-4000-8000-000000000001',session='20000000-0000-4000-8000-000000000001';
 const token='header.'+Buffer.from(JSON.stringify({sub:actor,session_id:session})).toString('base64url')+'.signature';
 const calls=[],logs=[];
 const helper=load('../src/lib/seguimiento/activity-server.ts',{
  'server-only':{},
  '@supabase/supabase-js':{createClient:()=>({rpc:async(name,args)=>{calls.push({name,args});throw new Error('sensitive token '+token);}})},
 },{env:{SUPABASE_SECRET_KEY:'test-only-key',NEXT_PUBLIC_SUPABASE_URL:'https://example.test'}},{error:(...args)=>logs.push(args)});
 const db={auth:{getUser:async()=>({data:{user:{id:actor}},error:null}),getSession:async()=>({data:{session:{access_token:token}},error:null})}};
 assert.deepEqual(await helper.readAccessIdentity(db),{actor,session});
 await helper.recordSessionAccess(db); // simulated network failure must resolve
 assert.equal(calls[0].args.p_actor,actor);assert.equal(calls[0].args.p_session,session);
 assert.equal(JSON.stringify(calls).includes(token),false);
 assert.equal(JSON.stringify(logs).includes(token),false);
 db.auth.getUser=async()=>({data:{user:null},error:new Error('expired')});
 assert.equal(await helper.readAccessIdentity(db),null);
 const count=calls.length;await helper.recordSessionAccess(db);assert.equal(calls.length,count);
 db.auth.getUser=async()=>{throw new Error('network');};
 assert.equal(await helper.readAccessIdentity(db),null);
 const unconfigured=load('../src/lib/seguimiento/activity-server.ts',{'server-only':{},'@supabase/supabase-js':{createClient:()=>{throw new Error('must not run');}}},{env:{}},{error:()=>{}});
 await unconfigured.recordAccess({actor,session},'access.login');
});

test('logout is recorded only after successful signOut; failed password login creates no access',async()=>{
 const order=[];let signoutError=null,loginError={status:400};
 const identity={actor:'verified',session:'session'};
 const db={auth:{
  signInWithPassword:async()=>({error:loginError}),
  signOut:async()=>{order.push('signOut');return {error:signoutError};},
 }};
 const actions=load('../src/app/seguimiento/login/actions.ts',{
  '@/lib/seguimiento/activity-server':{
   readAccessIdentity:async()=>identity,
   recordAccess:async(value,action)=>{assert.equal(value,identity);order.push(action);},
   recordSessionAccess:async()=>order.push('access.login'),
  },
  '@/lib/supabase/server':{createSessionClient:async()=>db},
  '@/lib/seguimiento/server':{},
  'next/navigation':{redirect:()=>{order.push('redirect');}},
 });
 assert.ok('error' in await actions.followupLogin({email:'test@example.test',password:'incorrect'}));
 assert.deepEqual(order,[]);
 loginError=null;await actions.followupLogin({email:'test@example.test',password:'correct'});assert.deepEqual(order,['access.login']);
 order.length=0;signoutError=new Error('failed');
 await assert.rejects(()=>actions.followupLogout());assert.deepEqual(order,['signOut']);
 order.length=0;signoutError=null;await actions.followupLogout();
 assert.deepEqual(order,['signOut','access.logout','redirect']);
});

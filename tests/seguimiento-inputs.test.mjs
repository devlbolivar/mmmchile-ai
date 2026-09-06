import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import test from 'node:test';
import ts from 'typescript';

function load(path) {
 const file=new URL(path,import.meta.url),module={exports:{}};
 const {outputText}=ts.transpileModule(readFileSync(file,'utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS}});
 new Function('require','module','exports',outputText)(createRequire(file),module,module.exports);
 return module.exports;
}
const {phoneSchema,localPhone,kindLabel,categoryFor,compatibleVisitors,classificationLabel,personSchema}=load('../src/lib/seguimiento/records.ts');
const {invitationError}=load('../src/lib/seguimiento/invitation-error.ts');
test('Chilean phone round trip preserves number and does not duplicate prefix',()=>{
 for(const value of ['981916658','+56981916658','56981916658','+56 9 8191 6658']){
  assert.equal(phoneSchema.parse(value),'+56981916658');
  assert.equal(localPhone(value),'981916658');
 }
 assert.equal(phoneSchema.parse(''),'');
 for(const value of ['+56','123','9819166580','+58981916658','98191665a'])assert.equal(phoneSchema.safeParse(value).success,false);
});
test('legacy stored reason has new label',()=>{
 assert.equal(kindLabel('Acompañamiento'),'Creyente');
 assert.equal(kindLabel('Nuevo creyente'),'Nuevo creyente');
});
test('invitation errors distinguish actionable causes without leaking raw messages',()=>{
 assert.match(invitationError({code:'email_address_not_authorized'}),/SMTP/);
 assert.match(invitationError({status:429}),/límite/);
 assert.match(invitationError({code:'user_already_exists'}),/ya tiene una cuenta/);
 assert.match(invitationError({code:'not_admin'}),/permisos/);
 assert.doesNotMatch(invitationError({code:'unexpected_failure',message:'secret@example.com'}),/secret@example.com/);
});
test('classification requires both fields and matches exactly one team',()=>{
 const base={name:'Persona prueba',phone:'',address:'',kind:'Nuevo creyente',status:'Pendiente',consent:true,nextDate:'',responsible:'',assignedTo:''};
 assert.equal(personSchema.safeParse(base).success,false);
 assert.equal(personSchema.safeParse({...base,ageGroup:'Joven',sex:'Otro'}).success,false);
 const directory=['joven_masculino','joven_femenino','adulto_masculino','adulto_femenino',null].map((visit_category,i)=>({id:String(i),name:'Integrante',visit_category}));
 for(const ageGroup of ['Joven','Adulto'])for(const sex of ['Masculino','Femenino']){
  assert.equal(personSchema.safeParse({...base,ageGroup,sex}).success,true);
  const candidates=compatibleVisitors(directory,ageGroup,sex);
  assert.equal(candidates.length,1);
  assert.equal(candidates[0].visit_category,categoryFor(ageGroup,sex));
 }
 assert.deepEqual(compatibleVisitors(directory,'',''),[]);
 assert.equal(classificationLabel(null,null),'Pendiente de clasificación');
});

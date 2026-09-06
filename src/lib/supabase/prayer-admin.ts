import 'server-only';
import {redirect} from 'next/navigation';
import {createSessionClient} from './server';
export async function requirePrayerAdmin(){
 const db=await createSessionClient();const {data:{user},error}=await db.auth.getUser();
 if(error||!user)redirect('/admin/login');
 const {data:allowed,error:accessError}=await db.rpc('ac_can_moderate_prayers');
 if(accessError||allowed!==true)redirect('/seguimiento');
 return user;
}

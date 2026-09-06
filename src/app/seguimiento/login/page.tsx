import type {Metadata} from 'next';
import FollowupAuthForm from '@/components/seguimiento/auth-form';
export function generateMetadata():Metadata{return {title:'Acceso al seguimiento'};}
export default function Login(){return <FollowupAuthForm/>;}

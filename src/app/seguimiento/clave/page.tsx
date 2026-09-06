import type {Metadata} from 'next';
import FollowupAuthForm from '@/components/seguimiento/auth-form';
export function generateMetadata():Metadata{return {title:'Definir contraseña · Seguimiento'};}
export default function Password(){return <FollowupAuthForm passwordMode/>;}

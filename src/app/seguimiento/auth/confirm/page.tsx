import type {Metadata} from 'next';
import FollowupAuthConfirm from '@/components/seguimiento/auth-confirm';
export function generateMetadata():Metadata{return {title:'Confirmar acceso · Seguimiento'};}
export default function Confirm(){return <FollowupAuthConfirm/>;}

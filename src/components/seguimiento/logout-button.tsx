'use client';
import { useFormStatus } from 'react-dom';
import { secondary } from './ui';
import BusyLabel from './busy-label';

export default function LogoutButton() {
 const { pending } = useFormStatus();
 return <button className={secondary} disabled={pending} aria-busy={pending}>{pending ? <BusyLabel>Cerrando sesión…</BusyLabel> : 'Salir'}</button>;
}

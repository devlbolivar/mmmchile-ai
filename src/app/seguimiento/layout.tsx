import type {Metadata} from 'next';
export const metadata:Metadata={title:'Acompañar · Seguimiento',robots:{index:false,follow:false},referrer:'no-referrer'};
export default function FollowupLayout({children}:{children:React.ReactNode}){return <div className="min-h-dvh bg-slate-50 text-slate-800">{children}</div>;}

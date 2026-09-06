import { LoaderCircle } from 'lucide-react';

export default function BusyLabel({ children }: { children: React.ReactNode }) {
 return <span role="status" className="inline-flex items-center gap-2"><LoaderCircle aria-hidden="true" size={16} className="shrink-0 animate-spin motion-reduce:animate-none"/><span>{children}</span></span>;
}

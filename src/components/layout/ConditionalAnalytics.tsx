'use client';
import {usePathname} from 'next/navigation';
import {GoogleAnalytics} from '@next/third-parties/google';
export default function ConditionalAnalytics({gaId}:{gaId:string}){
 const path=usePathname();
 if(path==='/seguimiento'||path.startsWith('/seguimiento/')||path==='/admin'||path.startsWith('/admin/'))return null;
 return <GoogleAnalytics gaId={gaId}/>;
}

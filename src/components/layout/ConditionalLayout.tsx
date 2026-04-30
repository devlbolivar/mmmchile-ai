'use client'
import { usePathname } from 'next/navigation'
import Header from './Header'
import Footer from './Footer'
import GlobalEvangelisticCTA from './GlobalEvangelisticCTA'
import WhatsAppFloatingBtn from './WhatsAppFloatingBtn'

const STANDALONE_ROUTES = ['/conectate']

export default function ConditionalLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const isStandalone = STANDALONE_ROUTES.some(
    (route) => pathname === route || pathname.startsWith(route + '/')
  )

  if (isStandalone) return <>{children}</>

  return (
    <>
      <Header />
      {children}
      <GlobalEvangelisticCTA />
      <Footer />
      <WhatsAppFloatingBtn />
    </>
  )
}

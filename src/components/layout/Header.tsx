"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import CTAButton from "../shared/CTAButton";

export default function Header() {
    const [scrolled, setScrolled] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 40);
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const navLinks = [
        { name: "Conoce a Jesús", href: "/conoce-a-jesus" },
        { name: "Iglesias", href: "/iglesias" },
        { name: "Blog", href: "/blog" },
        { name: "Doctrina", href: "/doctrina" },
        { name: "Oración", href: "/oracion" },
        { name: "Radio", href: "/radio" },
    ];

    return (
        <>
            <nav
                className={`fixed top-0 left-0 right-0 z-[100] flex items-center justify-between transition-all duration-400 ease-in-out ${scrolled
                    ? "bg-[#0F2035]/95 backdrop-blur-md px-5 md:px-10 py-2.5 shadow-[0_2px_20px_rgba(0,0,0,0.15)]"
                    : "px-5 md:px-10 py-4 bg-gradient-to-b from-black/30 to-transparent"
                    }`}
            >
                <Link href="/" className="flex items-center gap-3 no-underline group">
                    <Image
                        src="/logo.png"
                        alt="MMM Chile Logo"
                        width={80}
                        height={80}
                        quality={100}
                        className="h-[32px] w-auto drop-shadow-md"
                    />
                    <span className="hidden sm:flex flex-col leading-tight">
                        <span className="font-serif text-white text-[20px] font-bold tracking-wide leading-none">
                            MMM <span className="text-[#D4A843]">Chile</span>
                        </span>
                        <span className="text-white/60 text-[10px] tracking-[0.15em] uppercase font-sans leading-none mt-0.5">
                            Movimiento Misionero Mundial
                        </span>
                    </span>
                </Link>

                {/* Desktop nav */}
                <div className="hidden lg:flex gap-7 items-center">
                    {navLinks.map((link, i) => (
                        <Link
                            key={i}
                            href={link.href}
                            className="text-white/80 no-underline text-[14px] font-medium tracking-[0.3px] transition-colors duration-300 hover:text-[#D4A843] flex items-center gap-1.5"
                        >
                            {link.name}
                            {link.name === "Radio" && (
                                <span className="nav-radio-dot" aria-label="En vivo 24/7" />
                            )}
                        </Link>
                    ))}
                    <CTAButton href="/contacto" variant="primary" className="!px-5 !py-2 !rounded-md text-[14px]">
                        Contáctanos
                    </CTAButton>
                </div>

                {/* Hamburger */}
                <button
                    className="lg:hidden bg-transparent border-none cursor-pointer p-2 text-white"
                    onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                    aria-label="Abrir menú"
                >
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        {mobileMenuOpen ? (
                            <>
                                <line x1="18" y1="6" x2="6" y2="18" />
                                <line x1="6" y1="6" x2="18" y2="18" />
                            </>
                        ) : (
                            <>
                                <line x1="3" y1="6" x2="21" y2="6" />
                                <line x1="3" y1="12" x2="21" y2="12" />
                                <line x1="3" y1="18" x2="21" y2="18" />
                            </>
                        )}
                    </svg>
                </button>
            </nav>

            {/* Mobile dropdown */}
            {mobileMenuOpen && (
                <div className="lg:hidden fixed top-[56px] left-0 right-0 z-[99] bg-[#0F2035]/97 backdrop-blur-md px-6 py-5 flex flex-col gap-3">
                    {navLinks.map((link, i) => (
                        <Link
                            key={i}
                            href={link.href}
                            className="text-white/85 no-underline text-[16px] py-2 border-b border-white/5 flex items-center gap-2"
                            onClick={() => setMobileMenuOpen(false)}
                        >
                            {link.name}
                            {link.name === "Radio" && (
                                <span className="nav-radio-dot" aria-label="En vivo 24/7" />
                            )}
                        </Link>
                    ))}
                    <Link
                        href="/contacto"
                        className="text-white/85 no-underline text-[16px] py-2 border-b border-white/5"
                        onClick={() => setMobileMenuOpen(false)}
                    >
                        Contáctanos
                    </Link>
                </div>
            )}

            {/* Pulsing dot — scoped CSS */}
            <style>{`
                .nav-radio-dot {
                    display: inline-block;
                    width: 6px; height: 6px;
                    border-radius: 50%;
                    background: #4ADE80;
                    box-shadow: 0 0 6px #4ADE80;
                    animation: navDotPulse 2s ease-in-out infinite;
                    flex-shrink: 0;
                }
                @keyframes navDotPulse {
                    0%, 100% { opacity: 1; transform: scale(1); }
                    50%       { opacity: 0.4; transform: scale(0.75); }
                }
            `}</style>
        </>
    );
}

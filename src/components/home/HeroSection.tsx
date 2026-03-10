import React from 'react';
import CTAButton from '../shared/CTAButton';

const CrossPattern = ({ opacity = 0.04, color = "#1E3A5F" }) => (
    <svg style={{ position: "absolute", inset: 0, width: "100%", height: "100%", pointerEvents: "none", opacity }}>
        <defs>
            <pattern id="crossPattern" x="0" y="0" width="60" height="60" patternUnits="userSpaceOnUse">
                <line x1="30" y1="18" x2="30" y2="42" stroke={color} strokeWidth="1.2" />
                <line x1="22" y1="28" x2="38" y2="28" stroke={color} strokeWidth="1.2" />
            </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#crossPattern)" />
    </svg>
);

export default function HeroSection() {
    return (
        <section className="relative min-h-screen flex items-center justify-center text-center overflow-hidden">
            {/* Background and Overlay */}
            <div className="absolute inset-0 bg-[linear-gradient(135deg,#1a2a4a_0%,#2d1f3d_40%,#3a2518_70%,#1a2a4a_100%)]">
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_30%_50%,rgba(212,168,67,0.08)_0%,transparent_60%),radial-gradient(ellipse_at_70%_30%,rgba(180,140,200,0.06)_0%,transparent_50%)]" />

                {/* Animated Bokeh Effects */}
                <div className="absolute rounded-full blur-[40px] opacity-[0.12] animate-[float_8s_ease-in-out_infinite] w-[300px] h-[300px] bg-[radial-gradient(circle,rgba(212,168,67,0.5),transparent)] top-[20%] left-[10%]" style={{ animationDelay: "0s" }} />
                <div className="absolute rounded-full blur-[40px] opacity-[0.12] animate-[float_8s_ease-in-out_infinite] w-[250px] h-[250px] bg-[radial-gradient(circle,rgba(180,140,200,0.4),transparent)] top-[40%] right-[15%]" style={{ animationDelay: "2s" }} />
                <div className="absolute rounded-full blur-[40px] opacity-[0.12] animate-[float_8s_ease-in-out_infinite] w-[200px] h-[200px] bg-[radial-gradient(circle,rgba(200,120,80,0.4),transparent)] bottom-[20%] left-[30%]" style={{ animationDelay: "4s" }} />
                <div className="absolute rounded-full blur-[40px] opacity-[0.12] animate-[float_8s_ease-in-out_infinite] w-[180px] h-[180px] bg-[radial-gradient(circle,rgba(212,168,67,0.3),transparent)] top-[60%] right-[30%]" style={{ animationDelay: "1s" }} />
                <div className="absolute rounded-full blur-[40px] opacity-[0.12] animate-[float_8s_ease-in-out_infinite] w-[350px] h-[350px] bg-[radial-gradient(circle,rgba(255,200,150,0.2),transparent)] top-[10%] right-[5%]" style={{ animationDelay: "3s" }} />
            </div>
            <div className="absolute inset-0 bg-gradient-to-b from-[#0F2035]/70 via-[#0F2035]/50 to-[#0F2035]/80" />
            <CrossPattern opacity={0.03} color="white" />

            {/* Content */}
            <div className="relative z-10 max-w-[800px] px-6 mt-16 md:mt-0 animate-fade-in-up">
                <div className="inline-flex items-center gap-2 text-[13px] font-semibold tracking-[2px] uppercase text-[#D4A843] mb-6">
                    <span className="w-[30px] h-[1px] bg-[#D4A843] opacity-60"></span>
                    MMM Chile
                    <span className="w-[30px] h-[1px] bg-[#D4A843] opacity-60"></span>
                </div>

                <h1 className="font-serif text-[clamp(36px,6vw,64px)] text-white leading-[1.15] mb-5 font-normal">
                    ¿Buscas algo más<br />en la vida?
                </h1>

                <p className="text-[clamp(16px,2.2vw,20px)] text-white/80 max-w-[560px] mx-auto mb-10 leading-[1.7] font-light">
                    Miles de personas en Chile han encontrado esperanza, paz y propósito. Tú también puedes.
                </p>

                <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                    <CTAButton href="/conoce-a-jesus" variant="primary" className="w-full sm:w-auto">
                        Quiero Conocer a Jesús
                    </CTAButton>
                    <CTAButton href="/iglesias" variant="outline" className="w-full sm:w-auto">
                        Encuentra una Iglesia Cerca de Ti
                    </CTAButton>
                </div>
            </div>

            {/* Scroll Indicator */}
            <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 animate-[bounce_2.5s_ease-in-out_infinite] opacity-80 cursor-pointer">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.6)" strokeWidth="2" strokeLinecap="round">
                    <polyline points="6 9 12 15 18 9" />
                </svg>
            </div>
        </section>
    );
}

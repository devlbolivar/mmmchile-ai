'use client';

import React from 'react';
import CTAButton from '../shared/CTAButton';
import { trackEvent } from '@/lib/analytics';

export default function WhyBelieveSection() {
    return (
        <section className="relative py-24 bg-[#F8F6F0] overflow-hidden">
            {/* Minimal Background Element */}
            <div className="absolute top-0 right-0 w-1/3 h-full bg-[#D4A843]/5 rounded-bl-[100px] pointer-events-none" />
            
            <div className="container mx-auto px-6 relative z-10">
                <div className="max-w-4xl mx-auto flex flex-col md:flex-row gap-12 items-center">
                    
                    <div className="md:w-1/2">
                        <div className="inline-flex items-center gap-2 text-[13px] font-semibold tracking-[2px] uppercase text-[#1E3A5F] mb-4">
                            <span className="w-[30px] h-[1px] bg-[#1E3A5F] opacity-30"></span>
                            Nuestra Doctrina
                        </div>
                        <h2 className="text-3xl sm:text-4xl font-serif text-[#0F2035] leading-tight mb-6">
                            ¿Por qué creer?
                        </h2>
                        <p className="text-lg text-gray-700 leading-relaxed mb-6">
                            La fe no es solo una serie de reglas; es una <strong>relación viva</strong> que transforma nuestra manera de ver el mundo. Creemos porque hemos experimentado un amor que sana heridas, restaura familias y da sentido a cada día.
                        </p>
                        <p className="text-lg text-gray-700 leading-relaxed mb-8">
                            Nuestra doctrina no está basada en teorías vacías, sino en las <strong>Sagradas Escrituras</strong>, que nos guían hacia una vida llena de propósito y esperanza en medio de un mundo ruidoso.
                        </p>
                        <CTAButton 
                            href="/conoce-a-jesus" 
                            variant="primary"
                            onClick={() => trackEvent('click_why_believe_cta')}
                        >
                            Descubre cómo empezar
                        </CTAButton>
                    </div>

                    <div className="md:w-1/2 relative">
                        <div className="aspect-square bg-[#1E3A5F] rounded-2xl relative overflow-hidden shadow-2xl flex items-center justify-center p-8 text-center text-white/90">
                            {/* Abstract or minimalist visual representation. Can be replaced with Next Image */}
                            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(212,168,67,0.15)_0%,transparent_70%)]" />
                            <blockquote className="relative z-10 text-xl font-serif leading-relaxed italic">
                                "Porque de tal manera amó Dios al mundo, que ha dado a su Hijo unigénito, para que todo aquel que en él cree, no se pierda, mas tenga vida eterna."
                                <span className="block mt-4 text-sm font-sans font-semibold text-[#D4A843] not-italic tracking-wider text-right">
                                    JUAN 3:16
                                </span>
                            </blockquote>
                        </div>
                        
                        {/* Decorational Dots */}
                        <div className="absolute -bottom-6 -right-6 w-24 h-24 bg-[radial-gradient(#D4A843_2px,transparent_2px)] [background-size:12px_12px] opacity-30 -z-10" />
                    </div>
                </div>
            </div>
        </section>
    );
}

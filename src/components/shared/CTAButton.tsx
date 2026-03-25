import Link from 'next/link';
import { ReactNode } from 'react';

type CTAButtonProps = {
    variant?: 'primary' | 'secondary' | 'outline';
    href: string;
    children: ReactNode;
    className?: string;
    onClick?: () => void;
};

export default function CTAButton({ variant = 'primary', href, children, className = '', onClick }: CTAButtonProps) {
    const baseStyles = "inline-flex items-center justify-center font-sans font-semibold rounded-lg transition-all duration-300 text-[15px] sm:text-[16px] px-6 sm:px-8 py-3 sm:py-4";

    const variants = {
        primary: "bg-[#D4A843] text-[#0F2035] shadow-[0_4px_20px_rgba(212,168,67,0.3)] hover:bg-[#E8C976] hover:-translate-y-0.5 hover:shadow-[0_6px_28px_rgba(212,168,67,0.45)]",
        secondary: "bg-[#1E3A5F] text-white shadow-[0_4px_20px_rgba(30,58,95,0.2)] hover:bg-[#2a5280] hover:-translate-y-0.5 hover:shadow-[0_6px_28px_rgba(30,58,95,0.3)]",
        outline: "bg-transparent border-2 border-white/50 text-white hover:border-white hover:bg-white/10"
    };

    return (
        <Link href={href} onClick={onClick} className={`${baseStyles} ${variants[variant]} ${className}`}>
            {children}
        </Link>
    );
}

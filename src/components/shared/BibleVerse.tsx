type BibleVerseProps = {
    verse: string;
    reference: string;
    className?: string;
    bgClass?: string;
    textClass?: string;
    refClass?: string;
};

export default function BibleVerse({
    verse,
    reference,
    className = '',
    bgClass = 'bg-white',
    textClass = 'text-[#2C2C2C]',
    refClass = 'text-[#6B7280]',
}: BibleVerseProps) {
    return (
        <div className={`border-l-4 border-[#D4A843] p-6 shadow-sm rounded-r-lg ${bgClass} ${className}`}>
            <p className={`font-serif italic text-lg md:text-xl leading-relaxed mb-3 ${textClass}`}>
                &quot;{verse}&quot;
            </p>
            <p className={`font-sans text-sm font-semibold uppercase tracking-wider ${refClass}`}>
                — {reference}
            </p>
        </div>
    );
}

import TestimonyCard from './TestimonyCard';

export default function TestimonyGrid({ testimonies }: { testimonies: any[] }) {
    if (testimonies.length === 0) {
        return (
            <div className="text-center py-20 text-muted">
                <p className="text-lg">No se encontraron testimonios en esta categoría.</p>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mx-auto max-w-6xl">
            {testimonies.map((testimony, index) => (
                <div
                    key={testimony.id}
                    className="animate-in fade-in slide-in-from-bottom-4 duration-500 fill-mode-both"
                    style={{ animationDelay: `${index * 100}ms` }}
                >
                    <TestimonyCard testimony={testimony} />
                </div>
            ))}
        </div>
    );
}

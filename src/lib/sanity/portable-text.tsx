import { PortableText, type PortableTextComponents } from '@portabletext/react';

export const components: PortableTextComponents = {
    block: {
        normal: ({ children }) => <p className="mb-4 text-gray-700 leading-relaxed">{children}</p>,
        h2: ({ children }) => <h2 className="text-3xl font-bold mt-10 mb-6 text-gray-900">{children}</h2>,
        h3: ({ children }) => <h3 className="text-2xl font-bold mt-8 mb-4 text-gray-900">{children}</h3>,
        h4: ({ children }) => <h4 className="text-xl font-bold mt-6 mb-4 text-gray-900">{children}</h4>,
        blockquote: ({ children }) => (
            <blockquote className="border-l-4 border-primary-500 pl-4 italic my-6 text-gray-600 bg-gray-50 py-3 pr-4 rounded-r-lg">
                {children}
            </blockquote>
        ),
    },
    list: {
        bullet: ({ children }) => <ul className="list-disc pl-6 mb-6 text-gray-700 space-y-2">{children}</ul>,
        number: ({ children }) => <ol className="list-decimal pl-6 mb-6 text-gray-700 space-y-2">{children}</ol>,
    },
    marks: {
        strong: ({ children }) => <strong className="font-semibold text-gray-900">{children}</strong>,
        link: ({ children, value }) => {
            const rel = !value?.href?.startsWith('/') ? 'noreferrer noopener' : undefined;
            const target = !value?.href?.startsWith('/') ? '_blank' : undefined;
            return (
                <a href={value?.href} rel={rel} target={target} className="text-primary-600 hover:text-primary-800 underline transition-colors">
                    {children}
                </a>
            );
        },
        bibleVerse: ({ children, value }) => {
            return (
                <span className="inline-flex items-baseline gap-1 bg-primary-50 text-primary-800 px-1.5 py-0.5 rounded text-sm font-medium border border-primary-100 group cursor-help" title={value?.reference}>
                    <svg className="w-3 h-3 text-primary-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                    </svg>
                    {children}
                </span>
            );
        },
    },
    types: {
        image: ({ value }) => {
            return (
                <div className="my-8 relative w-full overflow-hidden rounded-xl bg-gray-100 border border-gray-200 aspect-video flex items-center justify-center">
                    <span className="text-sm text-gray-500">Image: {value?.alt || 'No alt text provided'}</span>
                </div>
            );
        },
    },
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function CustomPortableText({ value }: { value: any }) {
    return <PortableText value={value} components={components} />;
}

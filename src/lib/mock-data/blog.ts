// TODO: reemplazar con datos de Sanity

// Interfaces based on the expected Sanity responses (see lib/sanity/queries.ts)
export interface SanityCategory {
    title: string;
    slug: string;
    color?: string;
}

export interface SanityAuthor {
    name: string;
    slug: string;
    photo?: unknown;
    role?: string;
    bio?: unknown;
}

export interface BlogPost {
    _id: string;
    title: string;
    slug: string;
    excerpt: string;
    coverImage?: unknown;
    category: SanityCategory;
    publishedAt: string;
    // Detail fields
    body?: any; // Replaced during Sanity migration
    bibleVerses?: unknown[];
    callToAction?: string;
    seoKeywords?: string[];
    author?: SanityAuthor;

    // Custom mock fields for UI prior to Sanity integration
    readTime?: number;
    coverGradient?: string;
    featured?: boolean;
}

export const MOCK_CATEGORIES: SanityCategory[] = [
    { title: "Preguntas de Vida", slug: "preguntas-de-vida", color: "#7C3AED" },
    { title: "Primeros Pasos", slug: "primeros-pasos", color: "#0891B2" },
    { title: "Vida Cristiana", slug: "vida-cristiana", color: "#059669" },
    { title: "Testimonios", slug: "testimonios", color: "#DC2626" },
];

const authorRoberto: SanityAuthor = { name: "Pastor Roberto Méndez", slug: "roberto-mendez", role: "Pastor principal, MMM Santiago Centro" };
const authorMaria: SanityAuthor = { name: "Dra. María López", slug: "maria-lopez", role: "Consejera pastoral, MMM Coquimbo" };
const authorCarlos: SanityAuthor = { name: "Carlos Vega", slug: "carlos-vega", role: "Maestro bíblico, MMM La Serena" };

export const MOCK_POSTS: BlogPost[] = [
    {
        _id: "post-1",
        slug: "existe-dios",
        featured: true,
        category: MOCK_CATEGORIES[0], // Preguntas de Vida
        title: "¿Existe Dios? Lo que la Ciencia y la Fe Tienen en Común",
        excerpt: "Una mirada honesta y accesible a la pregunta más importante que puedes hacerte. ¿Hay evidencia de un diseño inteligente en el universo?",
        readTime: 8,
        publishedAt: "2026-02-28T12:00:00Z",
        author: authorRoberto,
        coverGradient: "linear-gradient(135deg, #1E3A5F 0%, #2a5280 50%, #1a4a6f 100%)",
        body: {
            intro: "Es quizás la pregunta más antigua de la humanidad. Una pregunta que no distingue entre ricos y pobres, entre científicos y poetas, entre jóvenes y ancianos. ¿Existe Dios? Y si existe, ¿podemos saberlo?",
            sections: [
                {
                    title: "El universo grita diseño",
                    paragraphs: [
                        "Cuando observamos la complejidad del universo — desde la estructura del ADN hasta las leyes de la física que mantienen todo en equilibrio — es difícil no preguntarse: ¿todo esto surgió por casualidad?",
                        "Las constantes fundamentales de la física están calibradas con una precisión de una parte en diez elevado a la potencia 60..."
                    ],
                    verse: { text: "Los cielos cuentan la gloria de Dios, y el firmamento anuncia la obra de sus manos.", ref: "Salmos 19:1" }
                }
            ],
            keyVerse: { text: "Acercaos a Dios, y él se acercará a vosotros.", ref: "Santiago 4:8" }
        }
    },
    {
        _id: "post-2",
        slug: "por-que-siento-un-vacio",
        category: MOCK_CATEGORIES[0], // Preguntas de Vida
        title: "¿Por qué siento un vacío que nada puede llenar?",
        excerpt: "Explorando la insatisfacción constante del corazón humano y cómo encontrar un propósito verdadero más allá del éxito superficial.",
        readTime: 6,
        publishedAt: "2026-02-22T12:00:00Z",
        author: authorMaria,
        coverGradient: "linear-gradient(135deg, #2d1f3d 0%, #4a3560 100%)",
        body: { intro: "Incluso cuando todo parece ir bien, hay una sensación de que algo falta...", sections: [], keyVerse: { text: "Nos hiciste, Señor, para ti, y nuestro corazón está inquieto hasta que descanse en ti.", ref: "Agustín de Hipona" } }
    },
    {
        _id: "post-3",
        slug: "como-superar-la-ansiedad-segun-la-biblia",
        category: MOCK_CATEGORIES[2], // Vida Cristiana
        title: "Cómo superar la ansiedad según la Biblia",
        excerpt: "La ansiedad afecta a millones de personas. Pero hay una fuente de paz que va más allá de las técnicas convencionales.",
        readTime: 7,
        publishedAt: "2026-02-15T12:00:00Z",
        author: authorMaria,
        coverGradient: "linear-gradient(135deg, #059669 0%, #047857 100%)",
        body: { intro: "Si alguna vez has sentido que el peso del mundo cae sobre tus hombros...", sections: [], keyVerse: { text: "Por nada estéis afanosos...", ref: "Filipenses 4:6-7" } }
    },
    {
        _id: "post-4",
        slug: "quien-fue-jesus-realmente",
        category: MOCK_CATEGORIES[0], // Preguntas de Vida
        title: "¿Quién fue Jesús realmente? Más allá de la religión",
        excerpt: "Historiador, maestro, profeta o algo más. Descubre por qué la figura de Jesús partió la historia en dos.",
        readTime: 5,
        publishedAt: "2026-02-10T12:00:00Z",
        author: authorCarlos,
        coverGradient: "linear-gradient(135deg, #0891B2 0%, #0E7490 100%)",
        body: { intro: "Ningún líder ha tenido tanto impacto en la historia humana...", sections: [], keyVerse: { text: "Yo soy el camino, y la verdad, y la vida...", ref: "Juan 14:6" } }
    },
    {
        _id: "post-5",
        slug: "evidencia-historica-resurreccion",
        category: MOCK_CATEGORIES[0], // Preguntas de Vida
        title: "La evidencia histórica de la resurrección",
        excerpt: "¿Es la resurrección de Jesús un mito o un hecho histórico? Analicemos las pruebas desde una perspectiva forense.",
        readTime: 9,
        publishedAt: "2026-02-05T12:00:00Z",
        author: authorRoberto,
        coverGradient: "linear-gradient(135deg, #D4A843 0%, #b8860b 100%)",
        body: { intro: "El cristianismo se sostiene o cae sobre la base de un solo evento: la resurrección...", sections: [], keyVerse: { text: "Mas ahora Cristo ha resucitado de los muertos...", ref: "1 Corintios 15:20" } }
    },
    {
        _id: "post-6",
        slug: "perdonar-cuando-duele",
        category: MOCK_CATEGORIES[2], // Vida Cristiana
        title: "El poder de perdonar (aunque no lo merezcan)",
        excerpt: "El perdón no es para el otro — es para ti. Descubre cómo soltar el peso más pesado que cargas y encontrar sanidad.",
        readTime: 6,
        publishedAt: "2026-02-01T12:00:00Z",
        author: authorMaria,
        coverGradient: "linear-gradient(135deg, #059669 0%, #047857 100%)",
        body: { intro: "Perdonar duele...", sections: [], keyVerse: { text: "Sed benignos unos con otros...", ref: "Efesios 4:32" } }
    },
    {
        _id: "post-7",
        slug: "aceptaste-a-jesus-y-ahora-que",
        category: MOCK_CATEGORIES[1], // Primeros Pasos
        title: "Aceptaste a Jesús, ¿y ahora qué? Tus primeros pasos",
        excerpt: "Guía práctica para nuevos creyentes que quieren crecer en su fe y entender este nuevo camino.",
        readTime: 5,
        publishedAt: "2026-01-25T12:00:00Z",
        author: authorRoberto,
        coverGradient: "linear-gradient(135deg, #0891B2 0%, #0E7490 100%)",
        body: { intro: "Felicidades por dar el paso más importante de tu vida...", sections: [], keyVerse: { text: "Desead como niños recién nacidos, la leche espiritual no adulterada.", ref: "1 Pedro 2:2" } }
    },
    {
        _id: "post-8",
        slug: "testimonio-carlos",
        category: MOCK_CATEGORIES[3], // Testimonios
        title: '"Estaba hundido en la depresión. Hoy tengo esperanza"',
        excerpt: "La dramática historia de recuperación y transformación de un joven santiaguino tras un encuentro radical.",
        readTime: 4,
        publishedAt: "2026-01-18T12:00:00Z",
        author: authorCarlos,
        coverGradient: "linear-gradient(135deg, #DC2626 0%, #B91C1C 100%)",
        body: { intro: "Mi nombre es Carlos. A los 24 años, no quería seguir viviendo...", sections: [], keyVerse: { text: "De oídas te había oído; Mas ahora mis ojos te ven.", ref: "Job 42:5" } }
    },
    {
        _id: "post-9",
        slug: "matrimonio-en-crisis",
        category: MOCK_CATEGORIES[2], // Vida Cristiana
        title: "Cuando tu matrimonio está en crisis",
        excerpt: "Principios bíblicos y pasos prácticos para restaurar lo que parece irreparablemente roto.",
        readTime: 7,
        publishedAt: "2026-01-10T12:00:00Z",
        author: authorRoberto,
        coverGradient: "linear-gradient(135deg, #1E3A5F 0%, #2a5280 100%)",
        body: { intro: "Muchas parejas llegan a un punto de quiebre...", sections: [], keyVerse: { text: "Lo que Dios juntó, no lo separe el hombre.", ref: "Marcos 10:9" } }
    },
    {
        _id: "post-10",
        slug: "leer-la-biblia-primeras-veces",
        category: MOCK_CATEGORIES[1], // Primeros Pasos
        title: "Cómo empezar a leer la Biblia sin frustrarse",
        excerpt: "Consejos prácticos para entender y disfrutar la lectura diaria de las Escrituras para principiantes.",
        readTime: 5,
        publishedAt: "2026-01-05T12:00:00Z",
        author: authorCarlos,
        coverGradient: "linear-gradient(135deg, #0891B2 0%, #0E7490 100%)",
        body: { intro: "La Biblia es una biblioteca, no un solo libro. Y como tal, hay que saber por dónde empezar...", sections: [], keyVerse: { text: "Lámpara es a mis pies tu palabra...", ref: "Salmos 119:105" } }
    }
];

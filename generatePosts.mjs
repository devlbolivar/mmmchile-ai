import fs from 'fs';

const categoriesMap = {
    "preguntas-de-vida": "3ae23e3b-7da2-46c9-89be-a8a1497db90f",
    "primeros-pasos": "abf091a9-d9f2-4114-ad69-6a59d6af0c4e",
    "vida-cristiana": "93a0df1c-b50c-4985-b10c-2ea62dd74ea0",
    "testimonios": "7668c969-e5e2-4aa0-b7aa-79597f5df678"
};

const authorsMap = {
    "roberto-mendez": "d814d6ee-32ca-4aa9-b7ce-f5e6fa604f60",
    "maria-lopez": "d4d4a0fa-016a-4ad8-bd1e-2b8fc3f3ad64",
    "carlos-vega": "d71b5ba0-a1ef-4ec1-9f72-b47201679ef5"
};

const MOCK_CATEGORIES = [
    { title: "Preguntas de Vida", slug: "preguntas-de-vida" },
    { title: "Primeros Pasos", slug: "primeros-pasos" },
    { title: "Vida Cristiana", slug: "vida-cristiana" },
    { title: "Testimonios", slug: "testimonios" },
];

const authorRoberto = { slug: "roberto-mendez" };
const authorMaria = { slug: "maria-lopez" };
const authorCarlos = { slug: "carlos-vega" };

const MOCK_POSTS = [
    {
        _id: "post-1", slug: "existe-dios",
        category: MOCK_CATEGORIES[0], title: "¿Existe Dios? Lo que la Ciencia y la Fe Tienen en Común",
        excerpt: "Una mirada honesta y accesible a la pregunta más importante que puedes hacerte. ¿Hay evidencia de un diseño inteligente en el universo?",
        publishedAt: "2026-02-28T12:00:00Z", author: authorRoberto,
        body: {
            intro: "Es quizás la pregunta más antigua de la humanidad. Una pregunta que no distingue entre ricos y pobres, entre científicos y poetas, entre jóvenes y ancianos. ¿Existe Dios? Y si existe, ¿podemos saberlo?",
            sections: [
                {
                    title: "El universo grita diseño",
                    paragraphs: ["Cuando observamos la complejidad del universo — desde la estructura del ADN hasta las leyes de la física que mantienen todo en equilibrio — es difícil no preguntarse: ¿todo esto surgió por casualidad?", "Las constantes fundamentales de la física están calibradas con una precisión de una parte en diez elevado a la potencia 60..."],
                    verse: { text: "Los cielos cuentan la gloria de Dios, y el firmamento anuncia la obra de sus manos.", ref: "Salmos 19:1" }
                }
            ],
            keyVerse: { text: "Acercaos a Dios, y él se acercará a vosotros.", ref: "Santiago 4:8" }
        }
    },
    {
        _id: "post-2", slug: "por-que-siento-un-vacio", category: MOCK_CATEGORIES[0],
        title: "¿Por qué siento un vacío que nada puede llenar?", excerpt: "Explorando la insatisfacción constante del corazón humano y cómo encontrar un propósito verdadero más allá del éxito superficial.",
        publishedAt: "2026-02-22T12:00:00Z", author: authorMaria,
        body: { intro: "Incluso cuando todo parece ir bien, hay una sensación de que algo falta...", sections: [], keyVerse: { text: "Nos hiciste, Señor, para ti, y nuestro corazón está inquieto hasta que descanse en ti.", ref: "Agustín de Hipona" } }
    },
    {
        _id: "post-3", slug: "como-superar-la-ansiedad-segun-la-biblia", category: MOCK_CATEGORIES[2],
        title: "Cómo superar la ansiedad según la Biblia", excerpt: "La ansiedad afecta a millones de personas. Pero hay una fuente de paz que va más allá de las técnicas convencionales.",
        publishedAt: "2026-02-15T12:00:00Z", author: authorMaria,
        body: { intro: "Si alguna vez has sentido que el peso del mundo cae sobre tus hombros...", sections: [], keyVerse: { text: "Por nada estéis afanosos...", ref: "Filipenses 4:6-7" } }
    },
    {
        _id: "post-4", slug: "quien-fue-jesus-realmente", category: MOCK_CATEGORIES[0],
        title: "¿Quién fue Jesús realmente? Más allá de la religión", excerpt: "Historiador, maestro, profeta o algo más. Descubre por qué la figura de Jesús partió la historia en dos.",
        publishedAt: "2026-02-10T12:00:00Z", author: authorCarlos,
        body: { intro: "Ningún líder ha tenido tanto impacto en la historia humana...", sections: [], keyVerse: { text: "Yo soy el camino, y la verdad, y la vida...", ref: "Juan 14:6" } }
    },
    {
        _id: "post-5", slug: "evidencia-historica-resurreccion", category: MOCK_CATEGORIES[0],
        title: "La evidencia histórica de la resurrección", excerpt: "¿Es la resurrección de Jesús un mito o un hecho histórico? Analicemos las pruebas desde una perspectiva forense.",
        publishedAt: "2026-02-05T12:00:00Z", author: authorRoberto,
        body: { intro: "El cristianismo se sostiene o cae sobre la base de un solo evento: la resurrección...", sections: [], keyVerse: { text: "Mas ahora Cristo ha resucitado de los muertos...", ref: "1 Corintios 15:20" } }
    },
    {
        _id: "post-6", slug: "perdonar-cuando-duele", category: MOCK_CATEGORIES[2],
        title: "El poder de perdonar (aunque no lo merezcan)", excerpt: "El perdón no es para el otro — es para ti. Descubre cómo soltar el peso más pesado que cargas y encontrar sanidad.",
        publishedAt: "2026-02-01T12:00:00Z", author: authorMaria,
        body: { intro: "Perdonar duele...", sections: [], keyVerse: { text: "Sed benignos unos con otros...", ref: "Efesios 4:32" } }
    },
    {
        _id: "post-7", slug: "aceptaste-a-jesus-y-ahora-que", category: MOCK_CATEGORIES[1],
        title: "Aceptaste a Jesús, ¿y ahora qué? Tus primeros pasos", excerpt: "Guía práctica para nuevos creyentes que quieren crecer en su fe y entender este nuevo camino.",
        publishedAt: "2026-01-25T12:00:00Z", author: authorRoberto,
        body: { intro: "Felicidades por dar el paso más importante de tu vida...", sections: [], keyVerse: { text: "Desead como niños recién nacidos, la leche espiritual no adulterada.", ref: "1 Pedro 2:2" } }
    },
    {
        _id: "post-8", slug: "testimonio-carlos", category: MOCK_CATEGORIES[3],
        title: '"Estaba hundido en la depresión. Hoy tengo esperanza"', excerpt: "La dramática historia de recuperación y transformación de un joven santiaguino tras un encuentro radical.",
        publishedAt: "2026-01-18T12:00:00Z", author: authorCarlos,
        body: { intro: "Mi nombre es Carlos. A los 24 años, no quería seguir viviendo...", sections: [], keyVerse: { text: "De oídas te había oído; Mas ahora mis ojos te ven.", ref: "Job 42:5" } }
    },
    {
        _id: "post-9", slug: "matrimonio-en-crisis", category: MOCK_CATEGORIES[2],
        title: "Cuando tu matrimonio está en crisis", excerpt: "Principios bíblicos y pasos prácticos para restaurar lo que parece irreparablemente roto.",
        publishedAt: "2026-01-10T12:00:00Z", author: authorRoberto,
        body: { intro: "Muchas parejas llegan a un punto de quiebre...", sections: [], keyVerse: { text: "Lo que Dios juntó, no lo separe el hombre.", ref: "Marcos 10:9" } }
    },
    {
        _id: "post-10", slug: "leer-la-biblia-primeras-veces", category: MOCK_CATEGORIES[1],
        title: "Cómo empezar a leer la Biblia sin frustrarse", excerpt: "Consejos prácticos para entender y disfrutar la lectura diaria de las Escrituras para principiantes.",
        publishedAt: "2026-01-05T12:00:00Z", author: authorCarlos,
        body: { intro: "La Biblia es una biblioteca, no un solo libro. Y como tal, hay que saber por dónde empezar...", sections: [], keyVerse: { text: "Lámpara es a mis pies tu palabra...", ref: "Salmos 119:105" } }
    }
];

function generateBlockId() {
    return Math.random().toString(36).substring(2, 8);
}

function processBody(body) {
    if (!body) return [];

    let blocks = [];

    if (body.intro) {
        blocks.push({
            _type: 'block', _key: generateBlockId(), style: 'normal',
            children: [{ _type: 'span', _key: generateBlockId(), marks: [], text: body.intro }],
            markDefs: []
        });
    }

    if (body.sections && body.sections.length > 0) {
        body.sections.forEach(sec => {
            if (sec.title) {
                blocks.push({
                    _type: 'block', _key: generateBlockId(), style: 'h2',
                    children: [{ _type: 'span', _key: generateBlockId(), marks: [], text: sec.title }],
                    markDefs: []
                });
            }
            if (sec.paragraphs && sec.paragraphs.length > 0) {
                sec.paragraphs.forEach(p => {
                    blocks.push({
                        _type: 'block', _key: generateBlockId(), style: 'normal',
                        children: [{ _type: 'span', _key: generateBlockId(), marks: [], text: p }],
                        markDefs: []
                    });
                });
            }
            if (sec.verse) {
                blocks.push({
                    _type: 'block', _key: generateBlockId(), style: 'blockquote',
                    children: [{ _type: 'span', _key: generateBlockId(), marks: [], text: `${sec.verse.text} - ${sec.verse.ref}` }],
                    markDefs: []
                });
            }
        });
    }

    if (body.keyVerse) {
        blocks.push({
            _type: 'block', _key: generateBlockId(), style: 'blockquote',
            children: [{ _type: 'span', _key: generateBlockId(), marks: [], text: `${body.keyVerse.text} - ${body.keyVerse.ref}` }],
            markDefs: []
        });
    }

    return blocks.length > 0 ? blocks : undefined;
}

const documents = MOCK_POSTS.map((post, i) => {
    return {
        type: "blogPost",
        content: {
            title: post.title,
            slug: { _type: "slug", current: post.slug },
            excerpt: post.excerpt,
            publishedAt: post.publishedAt,
            author: { _type: "reference", _ref: authorsMap[post.author.slug] },
            category: { _type: "reference", _ref: categoriesMap[post.category.slug] },
            body: processBody(post.body),
        }
    };
});

fs.writeFileSync('posts.json', JSON.stringify(documents, null, 2));

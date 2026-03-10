import { PortableTextBlock } from '@portabletext/types';

export interface MockTestimony {
    _id: string;
    personName: string;
    slug: { current: string };
    headline: string;
    category: "sanidad" | "restauracion" | "provision" | "liberacion" | "salvacion" | "otro";
    photo?: { asset: { url: string } } | null;
    videoUrl?: string | null;
    shortVersion: string;
    fullStory: PortableTextBlock[];
    bibleVerse?: string | null;
    church?: { name: string; city: string } | null;
}

export const mockTestimonies: MockTestimony[] = [
    {
        _id: "test1",
        personName: "Carlos M.",
        slug: { current: "carlos-m" },
        headline: "De la Depresión a la Esperanza",
        category: "sanidad",
        photo: null,
        shortVersion: "Estaba hundido en la depresión. Un día entré a una iglesia sin esperanza, y encontré algo que cambió todo. Hoy tengo paz.",
        fullStory: [
            {
                _type: 'block',
                _key: 'b1',
                style: 'normal',
                markDefs: [],
                children: [{ _type: 'span', _key: 's1', text: 'Durante años luché contra una depresión severa que me impedía ver el color de la vida. Había intentado múltiples terapias, pero el vacío interno persistía.', marks: [] }]
            },
            {
                _type: 'block',
                _key: 'b2',
                style: 'normal',
                markDefs: [],
                children: [{ _type: 'span', _key: 's2', text: 'Un domingo, pasando por una iglesia del Movimiento Misionero Mundial, sentí un fuerte impulso de entrar. Esa noche, durante la predicación, sentí que las palabras eran directamente para mí.', marks: [] }]
            },
            {
                _type: 'block',
                _key: 'b3',
                style: 'normal',
                markDefs: [],
                children: [{ _type: 'span', _key: 's3', text: 'Cuando hicieron el llamado para recibir a Jesús, pasé al altar. Esa misma noche sentí cómo un peso enorme se levantaba de mis hombros. Desde aquel día, el Señor no solo ha sanado mi mente, sino que me ha dado un propósito nuevo.', marks: [] }]
            }
        ],
        bibleVerse: "Él sana a los quebrantados de corazón, Y venda sus heridas. (Salmos 147:3)",
        church: { name: "Iglesia Central", city: "Santiago" }
    },
    {
        _id: "test2",
        personName: "María y José P.",
        slug: { current: "maria-jose-p" },
        headline: "Mismos Votos, Corazones Nuevos",
        category: "restauracion",
        photo: null,
        shortVersion: "Mi matrimonio estaba destruido, a punto del divorcio. A través de la comunidad y la fe, restauramos lo que creíamos perdido para siempre.",
        fullStory: [
            {
                _type: 'block',
                _key: 'b1',
                style: 'normal',
                markDefs: [],
                children: [{ _type: 'span', _key: 's1', text: 'Nuestro matrimonio estaba al borde del colapso. Ya habíamos iniciado los trámites de divorcio y no podíamos ni siquiera hablarnos sin discutir.', marks: [] }]
            },
            {
                _type: 'block',
                _key: 'b2',
                style: 'normal',
                markDefs: [],
                children: [{ _type: 'span', _key: 's2', text: 'Unos vecinos nos invitaron a la iglesia. Decidimos ir por nuestros hijos, pensando que sería nuestra última oportunidad. Dios empezó a trabajar primero en mi corazón, revelándome mi propio orgullo, y luego en el de mi esposo.', marks: [] }]
            },
            {
                _type: 'block',
                _key: 'b3',
                style: 'normal',
                markDefs: [],
                children: [{ _type: 'span', _key: 's3', text: 'Hoy, 5 años después, no solo seguimos juntos, sino que amamos a Dios y nuestro hogar es un lugar de paz. Cristo Jesús restauró lo que el mundo daba por perdido.', marks: [] }]
            }
        ],
        bibleVerse: "Y os restituiré los años que comió la oruga... (Joel 2:25)",
        church: { name: "Iglesia Providencia", city: "Santiago" }
    },
    {
        _id: "test3",
        personName: "Diego R.",
        slug: { current: "diego-r" },
        headline: "Libertad Inesperada",
        category: "liberacion",
        photo: null,
        videoUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ", // Placeholder
        shortVersion: "Las drogas me tenían atrapado en las calles de Antofagasta. Encontré libertad real y un propósito que nunca imaginé que existiera.",
        fullStory: [
            {
                _type: 'block',
                _key: 'b1',
                style: 'normal',
                markDefs: [],
                children: [{ _type: 'span', _key: 's1', text: 'La calle se había convertido en mi hogar y las drogas en mi prisión. Mi familia me había dado por perdido y yo mismo ya no tenía esperanza de salir de allí.', marks: [] }]
            },
            {
                _type: 'block',
                _key: 'b2',
                style: 'normal',
                markDefs: [],
                children: [{ _type: 'span', _key: 's2', text: 'Un grupo de hermanos de la iglesia realizando trabajo evangelístico en las calles se acercó a mí. No me juzgaron, solo me hablaron del amor de un Dios que podía transformarlo todo.', marks: [] }]
            },
            {
                _type: 'block',
                _key: 'b3',
                style: 'normal',
                markDefs: [],
                children: [{ _type: 'span', _key: 's3', text: 'Ese día clamé a Dios desde el fondo de mi miseria. Me recogieron, me llevaron a la iglesia, y el Señor rompió mis cadenas. Llevo 3 años libre de ataduras y sirviendo a la juventud.', marks: [] }]
            }
        ],
        bibleVerse: "Así que, si el Hijo os libertare, seréis verdaderamente libres. (Juan 8:36)",
        church: { name: "Centro de Fe Antofagasta", city: "Antofagasta" }
    },
    {
        _id: "test4",
        personName: "Familia Soto",
        slug: { current: "familia-soto" },
        headline: "Milagro Financiero en Tiempo de Crisis",
        category: "provision",
        photo: null,
        shortVersion: "Perdimos nuestro negocio y no teníamos para comer. Dios proveyó de manera milagrosa en el momento de mayor desesperación.",
        fullStory: [
            {
                _type: 'block',
                _key: 'b1',
                style: 'normal',
                markDefs: [],
                children: [{ _type: 'span', _key: 's1', text: 'Con la pandemia, nuestro pequeño negocio familiar quebró. Las deudas se acumularon y llegó el día en que literalmente no teníamos comida en la mesa para nuestros hijos.', marks: [] }]
            },
            {
                _type: 'block',
                _key: 'b2',
                style: 'normal',
                markDefs: [],
                children: [{ _type: 'span', _key: 's2', text: 'Nos arrodillamos a orar como familia, entregando nuestra preocupación a Dios e intercediendo a través del muro de oración de la iglesia online.', marks: [] }]
            },
            {
                _type: 'block',
                _key: 'b3',
                style: 'normal',
                markDefs: [],
                children: [{ _type: 'span', _key: 's3', text: 'Al día siguiente, sin que nosotros le contáramos a nadie de nuestra situación exacta, una persona se acercó con provisiones y una ofrenda económica. Fue el inicio de una serie de milagros que Dios usó para sostenernos y luego abrirnos nuevas puertas de trabajo.', marks: [] }]
            }
        ],
        bibleVerse: "Mi Dios, pues, suplirá todo lo que os falta conforme a sus riquezas en gloria en Cristo Jesús. (Filipenses 4:19)",
        church: { name: "Iglesia Osorno", city: "Osorno" }
    },
    {
        _id: "test5",
        personName: "Andrea V.",
        slug: { current: "andrea-v" },
        headline: "Un Diagnóstico Revertido",
        category: "sanidad",
        photo: null,
        shortVersion: "Los médicos me dieron meses de vida debido a una enfermedad terminal. La iglesia oró y Dios obró un milagro innegable.",
        fullStory: [
            {
                _type: 'block',
                _key: 'b1',
                style: 'normal',
                markDefs: [],
                children: [{ _type: 'span', _key: 's1', text: 'Las palabras del doctor resonaban en mi cabeza: "No hay nada más que hacer". Un cáncer agresivo amenazaba con llevarse mi vida en cuestión de semanas.', marks: [] }]
            },
            {
                _type: 'block',
                _key: 'b2',
                style: 'normal',
                markDefs: [],
                children: [{ _type: 'span', _key: 's2', text: 'Mis hermanos en Cristo se unieron en ayuno y oración constante. En el siguiente chequeo preparatorio, los exámenes mostraron una remisión total e inexplicable para la ciencia.', marks: [] }]
            },
            {
                _type: 'block',
                _key: 'b3',
                style: 'normal',
                markDefs: [],
                children: [{ _type: 'span', _key: 's3', text: 'Hoy, mi testimonio de vida habla más fuerte por la misericordia de Dios. Él todavía hace milagros hoy.', marks: [] }]
            }
        ],
        bibleVerse: "Yo soy Jehová tu sanador. (Éxodo 15:26)",
        church: { name: "Iglesia Valparaíso Sur", city: "Valparaíso" }
    },
    {
        _id: "test6",
        personName: "Javier L.",
        slug: { current: "javier-l" },
        headline: "De la Religión a una Relación",
        category: "salvacion",
        photo: null,
        shortVersion: "Pensaba que ser bueno bastaba. Hasta que comprendí la gracia y mi vida cambió por completo al aceptar a Cristo.",
        fullStory: [
            {
                _type: 'block',
                _key: 'b1',
                style: 'normal',
                markDefs: [],
                children: [{ _type: 'span', _key: 's1', text: 'Fui criado creyendo en Dios, pero mi religión era solo una lista de reglas que cumplir para intentar ser "bueno". Por dentro me sentía vacío y juzgado.', marks: [] }]
            },
            {
                _type: 'block',
                _key: 'b2',
                style: 'normal',
                markDefs: [],
                children: [{ _type: 'span', _key: 's2', text: 'Un compañero de trabajo del MMM me habló, no de reglas, sino de una relación viva con Jesús y del perdón total de los pecados por gracia, no por obras.', marks: [] }]
            },
            {
                _type: 'block',
                _key: 'b3',
                style: 'normal',
                markDefs: [],
                children: [{ _type: 'span', _key: 's3', text: 'Cuando lo entendí, entregué mi corazón verdaderamente al Señor. Desde ese momento, mi fe no es una carga pesada, es gozo y esperanza diaria.', marks: [] }]
            }
        ],
        bibleVerse: "Porque por gracia sois salvos por medio de la fe... (Efesios 2:8)",
        church: { name: "Templo Central", city: "Concepción" }
    }
];

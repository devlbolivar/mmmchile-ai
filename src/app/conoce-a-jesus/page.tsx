import { Metadata } from 'next';
import GospelHero from '@/components/gospel/GospelHero';
import GospelChapter from '@/components/gospel/GospelChapter';
import SalvationPrayer from '@/components/gospel/SalvationPrayer';
import DecisionForm from '@/components/gospel/DecisionForm';
import GospelFAQ from '@/components/gospel/GospelFAQ';
import GospelShare from '@/components/gospel/GospelShare';
import PrayerLink from '@/components/gospel/PrayerLink';
import ProgressDots from '@/components/gospel/ProgressDots';
import { HandsLight, BrokenVessel, CrossLight, SunriseIcon } from '@/components/gospel/Icons';
import Breadcrumb from '@/components/shared/Breadcrumb';

export const metadata: Metadata = {
    title: "Conoce a Jesús | El Camino a la Vida Eterna",
    description: "Descubre el amor de Dios y cómo iniciar una relación personal con Jesucristo hoy mismo.",
    alternates: {
        canonical: '/conoce-a-jesus',
    },
};

export default function GospelPage() {
    const chapters = [
        {
            id: "ch-1", colorTheme: "ch-1" as const, num: "1",
            title: "No eres un accidente",
            icon: <HandsLight />,
            paragraphs: [
                "Antes de que existiera el universo, antes de que las estrellas comenzaran a brillar, ya había un plan para tu vida. No llegaste a este mundo por casualidad — fuiste pensado, diseñado, deseado.",
                "Cada parte de ti — tu personalidad, tus sueños, incluso las cosas que te hacen diferente — tiene un propósito. Hay un Creador que te conoce más profundamente de lo que tú te conoces a ti mismo, y su intención siempre fue que vivieras una vida plena, con sentido y con amor.",
                "Tal vez nadie te lo ha dicho así antes. Pero es la verdad: eres profundamente valioso."
            ],
            verse: "Antes que te formases en el vientre te conocí, y antes que nacieses te santifiqué.",
            verseRef: "Jeremías 1:5",
        },
        {
            id: "ch-2", colorTheme: "ch-2" as const, num: "2",
            title: "¿Por qué siento un vacío?",
            icon: <BrokenVessel />,
            paragraphs: [
                "Si alguna vez has sentido que algo falta — aunque por fuera todo parezca estar bien — no estás solo. Esa sensación de vacío, de ansiedad persistente, de buscar algo sin saber exactamente qué… es más común de lo que imaginas.",
                "La realidad es que algo se rompió. Nos alejamos de la fuente de vida para la que fuimos creados. Ese alejamiento tiene un nombre antiguo — pecado — pero no se trata solo de 'cosas malas'. Es vivir desconectado de quien te diseñó. Es intentar llenar con éxito, relaciones, dinero o placer un espacio que fue hecho para algo más grande.",
                "Y por más que lo intentemos, ese vacío sigue ahí. Porque no se llena con cosas. Se llena con alguien."
            ],
            verse: "Por cuanto todos pecaron y están destituidos de la gloria de Dios.",
            verseRef: "Romanos 3:23",
        },
        {
            id: "ch-3", colorTheme: "ch-3" as const, num: "3",
            title: "El Amor Más Grande de la Historia",
            icon: <CrossLight />,
            paragraphs: [
                "Aquí es donde la historia cambia. Dios vio nuestra situación — el vacío, el dolor, la desconexión — y en lugar de dejarnos solos, hizo algo extraordinario: envió a su propio Hijo, Jesús.",
                "Jesús vivió como uno de nosotros. Conoció el cansancio, la tristeza, la injusticia. Y entonces, voluntariamente, dio su vida en una cruz para pagar el precio de todo lo que nos separaba de Dios. No porque lo mereciéramos, sino porque nos amaba.",
                "Tres días después, resucitó. Venció la muerte. Y con eso abrió un camino de regreso a casa — un camino que está disponible para ti, hoy, ahora mismo."
            ],
            verse: "Porque de tal manera amó Dios al mundo, que ha dado a su Hijo unigénito, para que todo aquel que en él cree, no se pierda, mas tenga vida eterna.",
            verseRef: "Juan 3:16",
        },
        {
            id: "ch-4", colorTheme: "ch-4" as const, num: "4",
            title: "Una Nueva Vida Te Espera",
            icon: <SunriseIcon />,
            paragraphs: [
                "Imagina que llevas años cargando un peso enorme sobre tus hombros. Y de repente, alguien te dice: \"Puedes soltarlo. Yo lo cargo por ti.\" Eso es exactamente lo que Jesús ofrece.",
                "No necesitas ser perfecto. No necesitas tener todo resuelto. No necesitas entender cada detalle. Solo necesitas abrir la puerta. Recibir a Cristo es como aceptar un regalo — no lo puedes ganar, solo puedes recibirlo con gratitud.",
                "Hoy puede ser el primer día de una vida completamente nueva. Una vida con propósito, con paz, con esperanza real. Una vida conectada al amor que siempre buscaste."
            ],
            verse: "De modo que si alguno está en Cristo, nueva criatura es; las cosas viejas pasaron; he aquí todas son hechas nuevas.",
            verseRef: "2 Corintios 5:17",
        },
    ];

    return (
        <main className="min-h-screen font-sans text-[#2C2C2C] bg-white">
            <ProgressDots />
            <GospelHero />

            {/* Breadcrumb */}
            <div className="max-w-5xl mx-auto px-6 py-4">
                <Breadcrumb items={[{ label: 'Conoce a Jesús' }]} />
            </div>
            {chapters.map((ch) => (
                <GospelChapter
                    key={ch.id}
                    id={ch.id}
                    num={ch.num}
                    title={ch.title}
                    paragraphs={ch.paragraphs}
                    verse={ch.verse}
                    verseRef={ch.verseRef}
                    icon={ch.icon}
                    colorTheme={ch.colorTheme}
                />
            ))}

            <SalvationPrayer />
            <DecisionForm />
            <PrayerLink />
            <GospelFAQ />
            <GospelShare />
        </main>
    );
}

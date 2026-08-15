export interface RetreatImage {
  id: string
  /** Ruta relativa dentro de /public/recursos/retiro-damas-2026/ */
  src: string
  alt: string
}

export const retiroDamasInfo = {
  slug: 'retiro-damas-2026',
  lema: 'Mujeres Sanadas para Edificar Desde el Corazón',
  fechas: '13 al 15 de agosto',
  lugar: 'Lugar Ejército de Salvación',
  organiza: 'Ministerio de Familia — MMM · Retiro Chile Damas',
}

export const retiroDamasImages: RetreatImage[] = [
  {
    id: 'gladys-aylward',
    src: '/recursos/retiro-damas-2026/gladys-aylward.jpg',
    alt: 'Infografía: Gladys Aylward, la pequeña mujer que impactó China',
  },
  {
    id: 'susanna-wesley',
    src: '/recursos/retiro-damas-2026/susanna-wesley.jpg',
    alt: 'Infografía: Susanna Wesley, la madre que formó un avivamiento desde su hogar',
  },
  {
    id: 'pandita-ramabai',
    src: '/recursos/retiro-damas-2026/pandita-ramabai.jpg',
    alt: 'Infografía: Pandita Ramabai, la mujer que llevó esperanza a miles de mujeres',
  },
  {
    id: 'corrie-ten-boom',
    src: '/recursos/retiro-damas-2026/corrie-ten-boom.jpg',
    alt: 'Infografía: Corrie ten Boom, la mujer que oró en medio del sufrimiento',
  },
  {
    id: 'catherine-booth',
    src: '/recursos/retiro-damas-2026/catherine-booth.jpg',
    alt: 'Infografía: Catherine Booth, la madre espiritual de miles',
  },
]

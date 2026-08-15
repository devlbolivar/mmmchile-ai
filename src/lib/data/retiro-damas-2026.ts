export interface RetreatImage {
  id: string
  /** Ruta relativa dentro de /public/recursos/retiro-damas-2026/ */
  src: string
  alt: string
  width: number
  height: number
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
    width: 1600,
    height: 900,
  },
  {
    id: 'susanna-wesley',
    src: '/recursos/retiro-damas-2026/susanna-wesley.jpg',
    alt: 'Infografía: Susanna Wesley, la madre que formó un avivamiento desde su hogar',
    width: 1600,
    height: 900,
  },
  {
    id: 'pandita-ramabai',
    src: '/recursos/retiro-damas-2026/pandita-ramabai.jpg',
    alt: 'Infografía: Pandita Ramabai, la mujer que llevó esperanza a miles de mujeres',
    width: 1600,
    height: 900,
  },
  {
    id: 'corrie-ten-boom',
    src: '/recursos/retiro-damas-2026/corrie-ten-boom.jpg',
    alt: 'Infografía: Corrie ten Boom, la mujer que oró en medio del sufrimiento',
    width: 1600,
    height: 900,
  },
  {
    id: 'catherine-booth',
    src: '/recursos/retiro-damas-2026/catherine-booth.jpg',
    alt: 'Infografía: Catherine Booth, la madre espiritual de miles',
    width: 1600,
    height: 900,
  },
  {
    id: 'amy-carmichael',
    src: '/recursos/retiro-damas-2026/amy-carmichael.jpg',
    alt: 'Infografía: Amy Carmichael, la mujer que rescató niños mediante la oración',
    width: 1600,
    height: 900,
  },
  {
    id: 'maria-woodworth-etter',
    src: '/recursos/retiro-damas-2026/maria-woodworth-etter.jpg',
    alt: 'Infografía: María Woodworth-Etter, una evangelista que preparó el camino para el avivamiento pentecostal',
    width: 1024,
    height: 1536,
  },
]

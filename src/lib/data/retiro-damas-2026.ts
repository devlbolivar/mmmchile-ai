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
    id: 'lema',
    src: '/lema.png',
    alt: 'Lema del Retiro de Damas 2026: Mujeres Sanadas para Edificar Desde el Corazón',
  },
]

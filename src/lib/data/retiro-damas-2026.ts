export interface RetreatResource {
  id: string
  title: string
  description: string
  type: 'pdf' | 'audio' | 'video' | 'image'
  /** Ruta relativa dentro de /public/recursos/retiro-damas-2026/. Vacío = aún no cargado. */
  fileUrl?: string
}

export const retiroDamasInfo = {
  slug: 'retiro-damas-2026',
  lema: 'Mujeres Sanadas para Edificar Desde el Corazón',
  fechas: '13 al 15 de agosto',
  lugar: 'Lugar Ejército de Salvación',
  organiza: 'Ministerio de Familia — MMM · Retiro Chile Damas',
}

export const retiroDamasResources: RetreatResource[] = [
  {
    id: 'guia-estudio',
    title: 'Guía de estudio del retiro',
    description: 'Material de apoyo con las bases bíblicas trabajadas en cada sesión.',
    type: 'pdf',
  },
  {
    id: 'predicas-audio',
    title: 'Prédicas en audio',
    description: 'Grabaciones de las enseñanzas compartidas durante el retiro.',
    type: 'audio',
  },
  {
    id: 'cancionero',
    title: 'Cancionero de alabanza',
    description: 'Letras de los cánticos usados en los tiempos de adoración.',
    type: 'pdf',
  },
  {
    id: 'material-grafico',
    title: 'Material gráfico del retiro',
    description: 'Logo y lema oficial para compartir en redes sociales.',
    type: 'image',
    fileUrl: '/lema.png',
  },
]

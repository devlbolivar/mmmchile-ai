export interface DoctrinePoint {
  id: string
  order: number
  icon: string
  title: string
  summary: string
  fullExplanation: string
  mainVerseText: string
  mainVerseRef: string
  bibleReferences: string[]
}

export const doctrinePoints: DoctrinePoint[] = [
  {
    id: 'la-biblia',
    order: 1,
    icon: 'BookOpen',
    title: 'La Biblia',
    summary: 'Palabra inspirada de Dios, regla infalible de fe y práctica.',
    fullExplanation:
      'Creemos que la Biblia es la Palabra de Dios, divinamente inspirada, y constituye la regla infalible de fe y conducta para todo creyente. Es la fuente suprema de verdad para la vida cristiana y el ministerio.',
    mainVerseText: 'Toda la Escritura es inspirada por Dios, y útil para enseñar, para redargüir, para corregir, para instruir en justicia, a fin de que el hombre de Dios sea perfecto, enteramente preparado para toda buena obra.',
    mainVerseRef: '2 Timoteo 3:16-17',
    bibleReferences: ['2 Timoteo 3:16-17', '2 Pedro 1:21'],
  },
  {
    id: 'la-salvacion',
    order: 2,
    icon: 'Heart',
    title: 'La Salvación',
    summary: 'Transformación del corazón mediante el nuevo nacimiento en Cristo.',
    fullExplanation:
      'Creemos en la salvación del alma mediante el arrepentimiento de los pecados y la fe en Jesucristo. Este nuevo nacimiento produce una transformación radical en la vida del creyente, haciéndolo una nueva criatura en Cristo.',
    mainVerseText: 'Porque de tal manera amó Dios al mundo, que ha dado a su Hijo unigénito, para que todo aquel que en él cree, no se pierda, mas tenga vida eterna.',
    mainVerseRef: 'Juan 3:16',
    bibleReferences: ['Lucas 24:47', 'Juan 3:16', 'Romanos 10:13'],
  },
  {
    id: 'el-bautismo-en-agua',
    order: 3,
    icon: 'Droplets',
    title: 'El Bautismo en Agua',
    summary: 'Mandato bíblico para todo aquel que se ha arrepentido.',
    fullExplanation:
      'Creemos que el bautismo en agua por inmersión es un mandato bíblico para todo creyente que se ha arrepentido de sus pecados. Es un acto de obediencia que simboliza la muerte al pecado y la resurrección a una nueva vida en Cristo.',
    mainVerseText: 'Pedro les dijo: Arrepentíos, y bautícese cada uno de vosotros en el nombre de Jesucristo para perdón de los pecados; y recibiréis el don del Espíritu Santo.',
    mainVerseRef: 'Hechos 2:38',
    bibleReferences: ['Mateo 28:19', 'Hechos 2:38', 'Romanos 6:4'],
  },
  {
    id: 'el-bautismo-del-espiritu-santo',
    order: 4,
    icon: 'Flame',
    title: 'El Bautismo del Espíritu Santo',
    summary: 'Investidura de poder con la evidencia de hablar en otras lenguas.',
    fullExplanation:
      'Creemos en el bautismo del Espíritu Santo como una experiencia posterior a la salvación, disponible para todo creyente. Esta investidura de poder va acompañada por la evidencia inicial de hablar en otras lenguas según el Espíritu da que hablen.',
    mainVerseText: 'Pero recibiréis poder, cuando haya venido sobre vosotros el Espíritu Santo, y me seréis testigos en Jerusalén, en toda Judea, en Samaria, y hasta lo último de la tierra.',
    mainVerseRef: 'Hechos 1:8',
    bibleReferences: ['Hechos 1:8', 'Hechos 2:4', 'Hechos 10:44-46'],
  },
  {
    id: 'la-sanidad-divina',
    order: 5,
    icon: 'Cross',
    title: 'La Sanidad Divina',
    summary: 'Provisión de Dios tanto para el perdón del pecado como para la enfermedad.',
    fullExplanation:
      'Creemos que la sanidad divina es parte de la provisión de Dios en la expiación de Cristo. Por sus llagas somos sanados. Dios puede sanar enfermedades y dolencias milagrosamente, y esta promesa es para la Iglesia de hoy.',
    mainVerseText: 'Mas él herido fue por nuestras rebeliones, molido por nuestros pecados; el castigo de nuestra paz fue sobre él, y por su llaga fuimos nosotros curados.',
    mainVerseRef: 'Isaías 53:5',
    bibleReferences: ['Isaías 53:4-5', 'Marcos 16:18', 'Santiago 5:14-15'],
  },
  {
    id: 'los-dones-del-espiritu',
    order: 6,
    icon: 'Gift',
    title: 'Los Dones del Espíritu',
    summary: 'Dones espirituales que operan con amor y frutos del Espíritu.',
    fullExplanation:
      'Creemos en la operación de los nueve dones del Espíritu Santo en la Iglesia. Estos dones deben funcionar en amor y acompañados de los frutos del Espíritu, para la edificación del cuerpo de Cristo y la extensión del Reino de Dios.',
    mainVerseText: 'Pero todas estas cosas las hace uno y el mismo Espíritu, repartiendo a cada uno en particular como él quiere.',
    mainVerseRef: '1 Corintios 12:11',
    bibleReferences: ['1 Corintios 12:1-11', '1 Corintios 13:1-2', 'Gálatas 5:22-23'],
  },
  {
    id: 'la-santidad',
    order: 7,
    icon: 'Shield',
    title: 'La Santidad',
    summary: 'Aspecto interno y externo que distingue al pueblo de Dios.',
    fullExplanation:
      'Creemos que la santidad es un requisito para todo creyente, tanto en el aspecto interno del corazón como en la conducta externa y la apariencia. Dios llama a su pueblo a vivir apartado del pecado y del mundo.',
    mainVerseText: 'Sino, como aquel que os llamó es santo, sed también vosotros santos en toda vuestra manera de vivir; porque escrito está: Sed santos, porque yo soy santo.',
    mainVerseRef: '1 Pedro 1:15-16',
    bibleReferences: ['1 Tesalonicenses 4:3', '1 Pedro 1:15-16', 'Hebreos 12:14'],
  },
  {
    id: 'el-deber-cristiano',
    order: 8,
    icon: 'Users',
    title: 'El Deber Cristiano',
    summary: 'Reunión, comunión, servicio, adoración y evangelización.',
    fullExplanation:
      'Creemos que todo creyente tiene el deber de congregarse regularmente, mantener comunión con otros hermanos, servir en la iglesia local, adorar a Dios en espíritu y en verdad, y participar activamente en la evangelización.',
    mainVerseText: 'No dejando de congregarnos, como algunos tienen por costumbre, sino exhortándonos; y tanto más, cuanto veis que aquel día se acerca.',
    mainVerseRef: 'Hebreos 10:25',
    bibleReferences: ['Hebreos 10:25', 'Hechos 2:42-47', 'Mateo 28:19-20'],
  },
  {
    id: 'los-diezmos-y-ofrendas',
    order: 9,
    icon: 'Coins',
    title: 'Los Diezmos y Ofrendas',
    summary: 'Obligación del creyente para sostener la obra de Dios.',
    fullExplanation:
      'Creemos que los diezmos y ofrendas son una obligación bíblica del creyente para el sostenimiento de la obra de Dios. El diezmo, la décima parte de los ingresos, pertenece a Dios y debe ser traído a la casa del Señor con fidelidad.',
    mainVerseText: 'Traed todos los diezmos al alfolí y haya alimento en mi casa; y probadme ahora en esto, dice Jehová de los ejércitos, si no os abriré las ventanas de los cielos, y derramaré sobre vosotros bendición hasta que sobreabunde.',
    mainVerseRef: 'Malaquías 3:10',
    bibleReferences: ['Malaquías 3:7-10', 'Mateo 23:23', '2 Corintios 9:6-7'],
  },
  {
    id: 'la-resurreccion',
    order: 10,
    icon: 'Sunrise',
    title: 'La Resurrección',
    summary: 'Promesa de resurrección de los muertos en Cristo.',
    fullExplanation:
      'Creemos en la resurrección literal y corporal de los muertos. Los que murieron en Cristo resucitarán primero, y luego los que estén vivos serán transformados para encontrarse con el Señor. También habrá resurrección de condenación para los incrédulos.',
    mainVerseText: 'Porque el Señor mismo con voz de mando, con voz de arcángel, y con trompeta de Dios, descenderá del cielo; y los muertos en Cristo resucitarán primero.',
    mainVerseRef: '1 Tesalonicenses 4:16',
    bibleReferences: ['1 Corintios 15:51-52', '1 Tesalonicenses 4:13-17', 'Juan 5:28-29'],
  },
  {
    id: 'la-segunda-venida',
    order: 11,
    icon: 'CloudSun',
    title: 'La Segunda Venida',
    summary: 'La gloriosa aparición de Cristo que librará a Israel y establecerá su reino.',
    fullExplanation:
      'Creemos en la segunda venida personal, visible y gloriosa de Jesucristo. Él vendrá por su Iglesia en el arrebatamiento y posteriormente regresará con sus santos para establecer su reino milenial, liberando a Israel y juzgando a las naciones.',
    mainVerseText: 'Aguardando la esperanza bienaventurada y la manifestación gloriosa de nuestro gran Dios y Salvador Jesucristo.',
    mainVerseRef: 'Tito 2:13',
    bibleReferences: ['Zacarías 14:1-9', 'Tito 2:13', '1 Tesalonicenses 4:16-17'],
  },
]

export type Company = {
  id: string; name: string; short: string; sector: string; image: string;
  accent: string; headline: string; intro: string; description: string;
  services: {title: string; text: string}[]; note: string; source?: string;
  sourceLabel?: string; phone?: string; email?: string; inquiry: string[];
};
export const companies: Company[] = [
  {
    id: 'gr-vallados', name: 'GR Vallados', short: 'GR Vallados', sector: 'Vallados para obras y eventos', image: 'vallados', accent: '#c9a366',
    headline: 'Cada espacio,\nbien delimitado.',
    intro: 'Alquiler y fabricación de vallados para obras, eventos y acontecimientos, con medidas por pedido.',
    description: 'Una especialidad concreta: delimitar espacios con soluciones de vallado. Su publicación comercial en Paraguay presenta opciones de alquiler y fabricación, ajustadas a las medidas solicitadas.',
    services: [
      { title: 'Alquiler de vallados', text: 'Alternativas para delimitar obras y eventos. Las medidas y el tiempo de uso se consultan para cada necesidad.' },
      { title: 'Fabricación por pedido', text: 'Vallados con medidas solicitadas por el cliente, según las condiciones acordadas con la empresa.' },
      { title: 'Obras y acontecimientos', text: 'Una misma especialidad aplicada a distintos espacios: frentes de obra, eventos y otros acontecimientos.' }
    ],
    note: 'Actividad verificada en una publicación de GR Vallados en Clasipar, a nombre de Rubén Darío González Pitta. El teléfono directo y las condiciones actuales deben confirmarse.',
    source: 'https://clasipar.paraguay.com/inmuebles/otros-inmuebles/alquiler-de-vallados-y-fabricacion-para-obras-y-eventos-gr-vallados-49390', sourceLabel: 'Publicación de GR Vallados',
    inquiry: ['Ubicación del espacio', 'Medidas aproximadas', 'Alquiler o fabricación', 'Fecha y tiempo de uso']
  },
  {
    id: 'del-sol-ingenieria', name: 'Del Sol Ingeniería S.A.', short: 'Del Sol Ingeniería', sector: 'Ingeniería y soluciones para obra', image: 'ingenieria', accent: '#92aebc',
    headline: 'Criterio técnico.\nVisión de conjunto.',
    intro: 'Un espacio propio para presentar el área de ingeniería del grupo y orientar las consultas técnicas.',
    description: 'Del Sol Ingeniería S.A. figura en la Guía Comercial Paraguaya con contacto en Mariano Roque Alonso. Una publicación conjunta con Del Sol Constructora presenta venta y colocación de elementos de seguridad vial.',
    services: [
      { title: 'Tachas reflectivas', text: 'Venta y colocación de tachas viales, también conocidas como ojos de gato, según la publicación comercial conjunta.' },
      { title: 'Reductores de velocidad', text: 'Presentados junto a las tachas viales en su oferta comercial. Características y disponibilidad a consultar.' },
      { title: 'Consulta técnica', text: 'Contacto con la empresa para conocer el alcance de su intervención y evaluar una necesidad específica.' }
    ],
    note: 'El teléfono y el correo provienen de la Guía Comercial Paraguaya. Los elementos viales aparecen en una publicación conjunta de las dos empresas Del Sol; la distribución de responsabilidades debe confirmarse.',
    source: 'https://sgpro.com.py/EmpresaDetalle.aspx?id=10382', sourceLabel: 'Ficha en la Guía Comercial Paraguaya', phone: '+595981244221', email: 'rubenpitta@gmail.com',
    inquiry: ['Tipo de consulta', 'Ubicación de la intervención', 'Medidas o documentación disponible', 'Fecha estimada']
  },
  {
    id: 'del-sol-constructora', name: 'Del Sol Constructora', short: 'Del Sol Constructora', sector: 'Construcción y soluciones para obra', image: 'hero', accent: '#ba8d78',
    headline: 'Una nueva forma\nde dar forma.',
    intro: 'La empresa del grupo vinculada a la construcción, con una presentación independiente y un canal de consulta directo.',
    description: 'Del Sol Constructora tiene una referencia pública en la zona de Remanso, Mariano Roque Alonso. También aparece, junto a Del Sol Ingeniería S.A., en una publicación de venta y colocación de elementos viales.',
    services: [
      { title: 'Construcción', text: 'Presentación general del área. Las tipologías de obra y el alcance de los trabajos se definirán con la empresa.' },
      { title: 'Elementos viales', text: 'Una publicación conjunta con Del Sol Ingeniería S.A. incluye tachas reflectivas y reductores de velocidad.' },
      { title: 'Consultas por obra', text: 'Un contacto directo para conversar sobre la ubicación, las características y la documentación de cada consulta.' }
    ],
    note: 'Nombre, zona y teléfono contrastados en un directorio público. La oferta vial está publicada conjuntamente con Del Sol Ingeniería S.A. No se atribuyen edificios, clientes ni obras sin documentación.',
    source: 'https://clasipar.paraguay.com/herramientas-de-construccion-y-oficina/construccion/reductores-de-velocidad-ventas-y-colocacion-de-tachas-ojos-de-gato-vial-49386', sourceLabel: 'Publicación comercial conjunta', phone: '+595981244221',
    inquiry: ['Ubicación de la obra', 'Descripción de la necesidad', 'Planos o medidas disponibles', 'Plazo previsto']
  },
  {
    id: 'eco-asfalto', name: 'Eco Asfalto S.A.', short: 'Eco Asfalto', sector: 'Área de asfalto · presentación referencial', image: 'asfalto', accent: '#a2b59d',
    headline: 'Una perspectiva\nsobre el camino.',
    intro: 'Una de las cuatro empresas presentadas por el grupo, con un espacio dedicado a su actividad y sus consultas.',
    description: 'Esta sección muestra cómo podría presentarse el área de asfalto dentro de la web institucional. Su catálogo de productos, servicios y aplicaciones será incorporado una vez validado por la empresa.',
    services: [
      { title: 'Presentación empresarial', text: 'Espacio reservado para describir la actividad concreta de Eco Asfalto S.A. con información aprobada por la empresa.' },
      { title: 'Productos y servicios', text: 'Catálogo pendiente de confirmación. La demostración no atribuye fórmulas, tecnologías ni prestaciones técnicas.' },
      { title: 'Consultas específicas', text: 'La información comercial y el contacto directo se incorporarán luego de validar los datos de esta empresa.' }
    ],
    note: 'Existen referencias públicas históricas a Eco Asfalto S.A., pero no fue posible vincular de forma inequívoca un catálogo o contacto vigente al grupo de Rubén. Esta presentación es referencial y requiere validación.',
    inquiry: ['Tipo de necesidad', 'Ubicación', 'Descripción de la superficie', 'Fecha estimada']
  }
];
export const pages = [
  {id:'index',label:'Inicio'}, {id:'grupo',label:'El Grupo'}, {id:'empresas',label:'Empresas'}, {id:'contacto',label:'Contacto'}
];
export const base = import.meta.env.BASE_URL;
export const href = (id:string) => `${base}${id === 'index' ? '' : `${id}.html`}`;
export const imagePath = (name:string,width=1600) => `${base}images/${name}-${width}.webp`;

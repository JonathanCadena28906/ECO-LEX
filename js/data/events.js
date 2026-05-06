// BANCO DE EVENTOS ALEATORIOS ECO-LEX
const EVENTS_BANK = [
    // EVENTOS LEGALES
    {
        id: 'event_legal_1',
        phase: ['legal', 'environmental', 'crisis'],
        title: 'Nueva Regulación de Transparencia',
        description: 'El Ministerio de Justicia acaba de emitir la Ley 2045 de Transparencia Contractual. A partir de ahora, toda solicitud debe incluir una declaración jurada de origen de fondos.',
        type: 'legal',
        options: [
            {
                id: 'opt_1',
                title: 'Incluir declaración jurada',
                description: 'Cumple con el requisito inmediatamente',
                consequence: { score: 10, time: 0, resources: {} }
            },
            {
                id: 'opt_2',
                title: 'Solicitar prórroga',
                description: 'Gana tiempo pero arriesga sanciones futuras',
                consequence: { score: -5, time: 120, resources: {} }
            },
            {
                id: 'opt_3',
                title: 'Ignorar el cambio',
                description: 'El riesgo es la sanción temporal',
                consequence: { score: -20, time: -180, resources: {} }
            }
        ],
        severity: 'medium',
        icon: '⚖️'
    },
    {
        id: 'event_legal_2',
        phase: ['legal', 'environmental'],
        title: 'Requisito DIAN de Paz y Salvo',
        description: 'La DIAN exige certificado de paz y salvo tributario para continuar con trámites ambientales. Este requisito no estaba en la lista inicial.',
        type: 'legal',
        options: [
            {
                id: 'opt_1',
                title: 'Gestionar inmediatamente',
                description: 'Costo adicional pero continúa el proceso',
                consequence: { score: 5, time: 60, resources: { budget: -15_000_000 } }
            },
            {
                id: 'opt_2',
                title: 'Delegar a asesor externo',
                description: 'Demora pero reduce riesgo',
                consequence: { score: 0, time: 120, resources: { budget: -35_000_000 } }
            }
        ],
        severity: 'low',
        icon: '📋'
    },
    {
        id: 'event_legal_3',
        phase: ['legal'],
        title: 'Investigación de Antecedentes',
        description: 'El director anterior de su empresa fue investigado por incumplimiento. Deben adjuntar certificado de antecedentes disciplinarios para continuar.',
        type: 'legal',
        options: [
            {
                id: 'opt_1',
                title: 'Entregar documentación completa',
                description: 'Transparencia total',
                consequence: { score: 15, time: 0, resources: {} }
            },
            {
                id: 'opt_2',
                title: 'Argumentar cambio de administración',
                description: 'Riesgo moderado de rechazo',
                consequence: { score: -10, time: 60, resources: {} }
            }
        ],
        severity: 'high',
        icon: '🔍'
    },
    // EVENTOS COMUNITARIOS
    {
        id: 'event_community_1',
        phase: ['environmental', 'crisis'],
        title: 'Tutela de Líderes Indígenas',
        description: 'Un grupo de líderes indígenas ha presentado una tutela contra su proyecto. Debe demostrar consulta previa o su proceso se congela temporalmente.',
        type: 'community',
        options: [
            {
                id: 'opt_1',
                title: 'Iniciar consulta previa',
                description: 'Demuestra buena fe pero consume tiempo',
                consequence: { score: 20, time: 180, resources: { community: 30 } }
            },
            {
                id: 'opt_2',
                title: 'Ofrecer compensación inicial',
                description: 'Ayuda pero no resuelve completamente',
                consequence: { score: 5, time: 120, resources: { budget: -60_000_000, community: 20 } }
            },
            {
                id: 'opt_3',
                title: 'Ignorar y continuar',
                description: 'Alto riesgo de paralización',
                consequence: { score: -30, time: -300, resources: {} }
            }
        ],
        severity: 'critical',
        icon: '👥'
    },
    {
        id: 'event_community_2',
        phase: ['environmental'],
        title: 'Bloqueo de Acceso Comunitario',
        description: 'La Junta de Acción Comunal del área ha bloqueado el acceso al sitio del proyecto. Solo puede continuar si presenta un plan de compensación visible.',
        type: 'community',
        options: [
            {
                id: 'opt_1',
                title: 'Presentar plan de compensación',
                description: 'Inversión en comunidad local',
                consequence: { score: 15, time: 90, resources: { budget: -80_000_000, community: 40 } }
            },
            {
                id: 'opt_2',
                title: 'Negociar acceso temporal',
                description: 'Solución rápida pero frágil',
                consequence: { score: -5, time: 30, resources: { budget: -15_000_000 } }
            }
        ],
        severity: 'high',
        icon: '🚫'
    },
    {
        id: 'event_community_3',
        phase: ['crisis'],
        title: 'Demanda Colectiva por Contaminación',
        description: 'La comunidad presentó una demanda colectiva por ruido y contaminación potencial del acuífero. El medio de comunicación local cubrió la noticia.',
        type: 'community',
        options: [
            {
                id: 'opt_1',
                title: 'Aceptar responsabilidad parcial',
                description: 'Muestra disposición a dialogar',
                consequence: { score: 10, time: 0, resources: { budget: -100_000_000 } }
            },
            {
                id: 'opt_2',
                title: 'Refutar acusaciones públicamente',
                description: 'Riesgo de mayor polarización',
                consequence: { score: -15, time: 120, resources: {} }
            }
        ],
        severity: 'critical',
        icon: '⚠️'
    },
    // EVENTOS AMBIENTALES
    {
        id: 'event_env_1',
        phase: ['environmental'],
        title: 'Contaminación de Fuente Hídrica',
        description: 'Se detectaron niveles altos de mercurio en la fuente hídrica cercana. La ANLA exige un nuevo estudio de impacto ambiental complementario.',
        type: 'environmental',
        options: [
            {
                id: 'opt_1',
                title: 'Encargar estudio ambiental',
                description: 'Cumplimiento riguroso',
                consequence: { score: 20, time: 120, resources: { budget: -90_000_000, water: -8 } }
            },
            {
                id: 'opt_2',
                title: 'Argumentar fuente externa',
                description: 'Riesgos de rechazo regulatorio',
                consequence: { score: -10, time: 60, resources: { budget: -25_000_000 } }
            }
        ],
        severity: 'high',
        icon: '💧'
    },
    {
        id: 'event_env_2',
        phase: ['environmental'],
        title: 'Alerta por Sequía Regional',
        description: 'Alerta por sequía en la región: el recurso de agua disponible se reduce en un 30% inmediatamente. El proyecto debe ajustar sus estimaciones.',
        type: 'environmental',
        options: [
            {
                id: 'opt_1',
                title: 'Reducir consumo de agua',
                description: 'Afecta el alcance del proyecto',
                consequence: { score: 0, time: 0, resources: { water: -20 } }
            },
            {
                id: 'opt_2',
                title: 'Implementar sistema de reciclaje',
                description: 'Inversión adicional',
                consequence: { score: 15, time: 90, resources: { water: -10, budget: -60_000_000 } }
            }
        ],
        severity: 'medium',
        icon: '🌡️'
    },
    {
        id: 'event_env_3',
        phase: ['environmental'],
        title: 'Descubrimiento de Especie Protegida',
        description: 'Estudios previos revelan la presencia de una especie protegida en el área del proyecto. Se requiere plan de conservación.',
        type: 'environmental',
        options: [
            {
                id: 'opt_1',
                title: 'Crear corredor ecológico',
                description: 'Solución integrada',
                consequence: { score: 25, time: 150, resources: { budget: -80_000_000, land: -15 } }
            },
            {
                id: 'opt_2',
                title: 'Modificar límites del proyecto',
                description: 'Reduce impacto pero cambios mayores',
                consequence: { score: 10, time: 60, resources: { land: -20 } }
            }
        ],
        severity: 'high',
        icon: '🦜'
    },
    // EVENTOS INSTITUCIONALES
    {
        id: 'event_inst_1',
        phase: ['legal', 'environmental'],
        title: 'Cambio de Gobierno',
        description: 'Cambio de gobierno: el nuevo Ministerio de Ambiente exige que todos los proyectos presenten su plan de compensación de carbono detallado.',
        type: 'institutional',
        options: [
            {
                id: 'opt_1',
                title: 'Adaptarse a nuevos requisitos',
                description: 'Cumplimiento con la nueva administración',
                consequence: { score: 10, time: 120, resources: { budget: -50_000_000 } }
            },
            {
                id: 'opt_2',
                title: 'Apelar decisión',
                description: 'Riesgo de mayor retraso',
                consequence: { score: -10, time: 180, resources: {} }
            }
        ],
        severity: 'medium',
        icon: '🏛️'
    },
    {
        id: 'event_inst_2',
        phase: ['crisis'],
        title: 'Auditoria Externa Sorpresiva',
        description: 'La Procuraduría iniciará auditoría sorpresiva sobre cumplimiento de requisitos legales en su proyecto. Se notificará en 24 horas.',
        type: 'institutional',
        options: [
            {
                id: 'opt_1',
                title: 'Preparar documentación completa',
                description: 'Garantiza transparencia',
                consequence: { score: 20, time: 60, resources: { budget: -30_000_000 } }
            },
            {
                id: 'opt_2',
                title: 'Solicitar prórroga',
                description: 'Señal de debilidad',
                consequence: { score: -15, time: 120, resources: {} }
            }
        ],
        severity: 'high',
        icon: '📊'
    },
    // EVENTOS DE CRISIS
    {
        id: 'event_crisis_1',
        phase: ['crisis'],
        title: 'Deslizamiento Destruye Obra',
        description: 'Un deslizamiento destruyó el 30% de la infraestructura construida. Se requiere reestructuración del plan ambiental e inversión adicional.',
        type: 'crisis',
        options: [
            {
                id: 'opt_1',
                title: 'Reconstruir y mejorar',
                description: 'Mayor inversión pero mejor sostenibilidad',
                consequence: { score: 15, time: 180, resources: { budget: -150_000_000, land: -10 } }
            },
            {
                id: 'opt_2',
                title: 'Reconstruir idénticamente',
                description: 'Más rápido pero sin mejoras',
                consequence: { score: 0, time: 120, resources: { budget: -80_000_000 } }
            }
        ],
        severity: 'critical',
        icon: '🏚️'
    },
    {
        id: 'event_crisis_2',
        phase: ['crisis'],
        title: 'Escándalo en Medios',
        description: 'Un medio de comunicación nacional publicó que el estudio de impacto fue elaborado sin visita de campo. El proyecto está en pausa regulatoria.',
        type: 'crisis',
        options: [
            {
                id: 'opt_1',
                title: 'Respuesta pública inmediata',
                description: 'Rectificar y comprobar acceso',
                consequence: { score: 10, time: 90, resources: { budget: -80_000_000 } }
            },
            {
                id: 'opt_2',
                title: 'Silencio y esperar',
                description: 'Riesgo de daño reputacional mayor',
                consequence: { score: -25, time: 180, resources: {} }
            }
        ],
        severity: 'critical',
        icon: '📰'
    }
];

// Función para obtener eventos por fase
function getEventsByPhase(phase) {
    return EVENTS_BANK.filter(event => event.phase.includes(phase));
}

// Función para obtener evento aleatorio
function getRandomEvent(phase) {
    const phaseEvents = getEventsByPhase(phase);
    if (phaseEvents.length === 0) return null;
    return phaseEvents[Math.floor(Math.random() * phaseEvents.length)];
}

// ============================================
// BIBLIOTECA DE CRISIS - Para Dashboard
// ============================================

const EVENT_LIBRARY = {
    crises: [
        {
            id: 'crisis_litio_spill',
            title: 'Derrame de Químicos en Mina',
            description: 'Un incidente operativo causó el derrame de 5,000 litros de solución química hacia el río. La comunidad está en alerta máxima.',
            options: [
                {
                    id: 'opt_containment',
                    title: 'Contención inmediata y compensación',
                    description: 'Movilizar equipo de emergencia y ofrecer ayuda directa',
                    impact: { community: -30, water: -20, budget: -70_000_000 }
                },
                {
                    id: 'opt_denial',
                    title: 'Argumentar causa externa',
                    description: 'Culpar a factores naturales o de terceros',
                    impact: { community: -60, impact: 20, budget: -20_000_000 }
                },
                {
                    id: 'opt_transparency',
                    title: 'Transparencia total y remedación',
                    description: 'Aceptar responsabilidad, lanzar plan de descontaminación',
                    impact: { community: 15, water: -30, budget: -120_000_000, impact: -15 }
                }
            ]
        },
        {
            id: 'crisis_amazon_deforestation',
            title: 'Tala Ilegal Detectada en Límites',
            description: 'Se detectó tala ilegal en el perímetro de amortiguación del proyecto. Parece conectada con actores externos, pero su proyecto está bajo sospecha.',
            options: [
                {
                    id: 'opt_collaboration',
                    title: 'Colaborar con autoridades',
                    description: 'Trabajar con Fiscalía para investigación',
                    impact: { community: 20, land: 10, budget: -40_000_000 }
                },
                {
                    id: 'opt_distance',
                    title: 'Tomar distancia del incidente',
                    description: 'Alegación de independencia del proyecto',
                    impact: { community: -40, impact: 15 }
                }
            ]
        },
        {
            id: 'crisis_hydro_displacement',
            title: 'Resistencia Violenta al Reasentamiento',
            description: 'Familias se niegan al reasentamiento. Hay enfrentamientos en la zona. Los medios cubren protestas diarias.',
            options: [
                {
                    id: 'opt_negotiation',
                    title: 'Mesa de negociación extendida',
                    description: 'Diálogo profundo y rediseño del plan',
                    impact: { community: 30, budget: -140_000_000, impact: -10 }
                },
                {
                    id: 'opt_force',
                    title: 'Proceder con fuerza legal',
                    description: 'Ejecutar órdenes judiciales',
                    impact: { community: -80, impact: 40, budget: -60_000_000 }
                }
            ]
        },
        {
            id: 'crisis_sky_city_pollution',
            title: 'Contaminación del Acuífero en Pruebas',
            description: 'Las pruebas piloto del hotel contaminaron el acuífero subterráneo con residuos. Esto afecta a 3 pueblos cercanos.',
            options: [
                {
                    id: 'opt_shutdown',
                    title: 'Pausa operaciones y remediación',
                    description: 'Cerrar temporalmente, limpiar acuífero',
                    impact: { water: 20, budget: -180_000_000, community: -20 }
                },
                {
                    id: 'opt_minimize',
                    title: 'Minimizar alcance del incidente',
                    description: 'Argumentar que el daño es mínimo',
                    impact: { community: -50, water: -20, impact: 25 }
                }
            ]
        },
        {
            id: 'crisis_agro_pesticide_leak',
            title: 'Fuga de Pesticidas Prohibidos',
            description: 'Se descubrió que usó pesticidas prohibidos en Colombia (adquiridos ilegalmente). Reguladores están investigando.',
            options: [
                {
                    id: 'opt_cooperate',
                    title: 'Cooperación total con investigación',
                    description: 'Suspender pesticidas prohibidos, cambiar a legales',
                    impact: { community: 10, water: 12, budget: -100_000_000 }
                },
                {
                    id: 'opt_coverup',
                    title: 'Encubrimiento parcial',
                    description: 'Negar conocimiento de prohibición',
                    impact: { community: -60, impact: 20, budget: -60_000_000 }
                }
            ]
        }
    ]
};

// ============================================
// BANCO DE PREGUNTAS DE RESCATE (TRIVIA)
// ============================================
const TRIVIA_QUESTIONS = {
    budget: [
        {
            q: '¿Qué entidad otorga las licencias ambientales de grandes proyectos (como minería e hidrocarburos) en Colombia?',
            options: [
                'CAR (Corporación Autónoma Regional)',
                'ANLA (Autoridad Nacional de Licencias Ambientales)',
                'MADS (Ministerio de Ambiente y Desarrollo Sostenible)'
            ],
            correct: 1
        },
        {
            q: 'El ICA es un reporte obligatorio que se debe entregar a la autoridad ambiental. ¿Qué significan sus siglas?',
            options: [
                'Informe de Cumplimiento Ambiental',
                'Índice de Contaminación Atmosférica',
                'Instituto Colombiano Agropecuario'
            ],
            correct: 0
        }
    ],
    water: [
        {
            q: '¿Qué entidad es responsable de otorgar concesiones de agua superficial a nivel regional en Colombia?',
            options: [
                'ANLA (Autoridad Nacional de Licencias Ambientales)',
                'CAR (Corporación Autónoma Regional)',
                'IDEAM (Instituto de Hidrología, Meteorología y Estudios Ambientales)'
            ],
            correct: 1
        },
        {
            q: 'Según la normativa colombiana, ¿qué significa PUEAA?',
            options: [
                'Plan de Uso Eficiente y Ahorro de Agua',
                'Programa Único de Evaluación Ambiental Acuática',
                'Permiso de Uso Especial de Aguas y Afluentes'
            ],
            correct: 0
        }
    ],
    land: [
        {
            q: '¿Qué instrumento de planificación define los usos permitidos del suelo en el perímetro urbano y rural de un municipio?',
            options: [
                'EIA (Estudio de Impacto Ambiental)',
                'POT (Plan de Ordenamiento Territorial)',
                'PMA (Plan de Manejo Ambiental)'
            ],
            correct: 1
        },
        {
            q: 'Las zonas de amortiguación alrededor de áreas protegidas son administradas bajo lineamientos de:',
            options: [
                'Agencia Nacional de Tierras (ANT)',
                'Ministerio del Interior',
                'Parques Nacionales Naturales de Colombia (PNNC)'
            ],
            correct: 2
        }
    ],
    community: [
        {
            q: '¿Qué mecanismo constitucional protege el derecho de las comunidades étnicas a decidir sobre proyectos en sus territorios?',
            options: [
                'Acción Popular',
                'Acción de Tutela',
                'Consulta Previa (Convenio 169 de la OIT)'
            ],
            correct: 2
        },
        {
            q: '¿Quién debe certificar la presencia de comunidades indígenas o afrodescendientes en el área de influencia de un proyecto?',
            options: [
                'Dirección de la Autoridad Nacional de Consulta Previa (Ministerio del Interior)',
                'Gobernación Departamental',
                'Alcaldía Municipal'
            ],
            correct: 0
        }
    ]
};

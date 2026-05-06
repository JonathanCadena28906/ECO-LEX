// REQUISITOS Y NORMAS LEGALES - FASE 1
const LEGAL_REQUIREMENTS = {
    // Requisitos obligatorios generales
    mandatory: [
        {
            id: 'env_license',
            name: 'Licencia Ambiental Preliminar',
            description: 'Requisito fundamental para todo proyecto de infraestructura',
            applicable: true,
            regulation: 'Decreto 1076 de 2015'
        },
        {
            id: 'impact_study',
            name: 'Estudio de Impacto Ambiental (EIA)',
            description: 'Análisis detallado de efectos ambientales del proyecto',
            applicable: true,
            regulation: 'Ley 99 de 1993'
        },
        {
            id: 'liability_insurance',
            name: 'Seguro de Responsabilidad Civil',
            description: 'Cobertura de daños a terceros durante la ejecución',
            applicable: true,
            regulation: 'Estándar de la industria'
        }
    ],

    // Requisitos condicionales por tipo de proyecto
    conditional: {
        litio: [
            {
                id: 'water_permit',
                name: 'Permiso de Uso de Agua',
                description: 'Esencial para extractiva con alto consumo hídrico',
                applicable: true,
                regulation: 'Ley 1931 de 2018'
            },
            {
                id: 'indigenous_consultation',
                name: 'Consulta Previa con Comunidades Indígenas',
                description: 'Requisito en territorios ancestrales',
                applicable: true,
                regulation: 'Sentencias de la Corte Constitucional'
            },
            {
                id: 'mining_permit',
                name: 'Permiso de Minería',
                description: 'Autorización de la Autoridad Minera',
                applicable: true,
                regulation: 'Código de Minas'
            }
        ],
        amazon: [
            {
                id: 'forest_permit',
                name: 'Permiso de Aprovechamiento Forestal',
                description: 'Para áreas adyacentes a bosque protegido',
                applicable: true,
                regulation: 'Decreto 1076 de 2015'
            },
            {
                id: 'traffic_plan',
                name: 'Plan de Tráfico y Transporte',
                description: 'Gestión de carga pesada e impacto vial',
                applicable: true,
                regulation: 'Manual de Gestión de Tráfico'
            }
        ],
        hydro: [
            {
                id: 'water_permit',
                name: 'Permiso de Concesión de Agua',
                description: 'Para aprovechamiento hidroeléctrico',
                applicable: true,
                regulation: 'Ley 99 de 1993'
            },
            {
                id: 'resettlement_plan',
                name: 'Plan de Reasentamiento',
                description: 'Para comunidades afectadas por inundación',
                applicable: true,
                regulation: 'Sentencias de Desplazamiento'
            }
        ],
        skyCity: [
            {
                id: 'wetland_protection',
                name: 'Protección de Ecosistema Humedal',
                description: 'Medidas específicas para páramo/humedal',
                applicable: true,
                regulation: 'Ley 2173 de 2021'
            },
            {
                id: 'waste_management',
                name: 'Plan de Gestión de Residuos',
                description: 'Manejo de residuos hoteleros masivos',
                applicable: true,
                regulation: 'NTC 1692'
            }
        ],
        agroChemical: [
            {
                id: 'pesticide_permit',
                name: 'Autorización de Uso de Pesticidas',
                description: 'Control del ICA para químicos',
                applicable: true,
                regulation: 'Decreto 1843 de 1991'
            },
            {
                id: 'aquifer_protection',
                name: 'Plan de Protección del Acuífero',
                description: 'Prevención de contaminación química',
                applicable: true,
                regulation: 'Resolución 304 de 2008'
            }
        ]
    },

    // Normas generales colombianas
    regulations: [
        {
            id: 'law_80_1993',
            name: 'Ley 80 de 1993',
            description: 'Contratación pública (solo si hay financiamiento estatal)',
            applicableTo: ['hydro'], // Más probable en proyectos públicos
            isApplicable: function(project) {
                return this.applicableTo.includes(project.id) || false;
            }
        },
        {
            id: 'law_99_1993',
            name: 'Ley 99 de 1993',
            description: 'Marcos de gestión ambiental nacional',
            applicableTo: ['litio', 'amazon', 'hydro', 'skyCity', 'agroChemical'],
            isApplicable: function(project) {
                return true; // Aplica a todos
            }
        },
        {
            id: 'decree_1076_2015',
            name: 'Decreto 1076 de 2015',
            description: 'Gestión ambiental territorial',
            applicableTo: ['litio', 'amazon', 'hydro', 'skyCity', 'agroChemical'],
            isApplicable: function(project) {
                return true;
            }
        },
        {
            id: 'law_1931_2018',
            name: 'Ley 1931 de 2018',
            description: 'Cambio climático y licencias ambientales',
            applicableTo: ['litio', 'amazon', 'hydro', 'skyCity', 'agroChemical'],
            isApplicable: function(project) {
                return true;
            }
        },
        {
            id: 'law_2173_2021',
            name: 'Ley 2173 de 2021',
            description: 'Restauración ecológica',
            applicableTo: ['skyCity', 'amazon', 'litio'],
            isApplicable: function(project) {
                return this.applicableTo.includes(project.id);
            }
        },
        {
            id: 'sustantive_labor_code',
            name: 'Código Sustantivo del Trabajo',
            description: 'Protección de derechos laborales del proyecto',
            applicableTo: ['litio', 'amazon', 'hydro', 'skyCity', 'agroChemical'],
            isApplicable: function(project) {
                return true;
            }
        },
        {
            id: 'iso_14001',
            name: 'NTC-ISO 14001',
            description: 'Sistema de Gestión Ambiental',
            applicableTo: ['litio', 'amazon', 'hydro', 'skyCity', 'agroChemical'],
            isApplicable: function(project) {
                return true;
            }
        }
    ],

    // Trampas legales (requisitos que NO aplican a proyecto privado)
    traps: [
        {
            id: 'trap_1',
            name: 'Ley 80 de 1993',
            description: 'Solo aplica a contratación PÚBLICA',
            why: 'Este proyecto es privado'
        },
        {
            id: 'trap_2',
            name: 'Resolución de Presupuesto Estatal',
            description: 'No es un requisito real para proyectos privados',
            why: 'No existe en marco legal colombiano'
        },
        {
            id: 'trap_3',
            name: 'Licencia de Importación General',
            description: 'Solo si importa equipos específicos',
            why: 'No es requisito genérico del proyecto'
        }
    ]
};

// Función para obtener requisitos por proyecto
function getRequirementsForProject(project) {
    const requirements = [...LEGAL_REQUIREMENTS.mandatory];
    if (LEGAL_REQUIREMENTS.conditional[project.id]) {
        requirements.push(...LEGAL_REQUIREMENTS.conditional[project.id]);
    }
    return requirements;
}

// Función para validar conjunto de requisitos
function validateRequirements(selectedRequirements, project) {
    const mandatory = LEGAL_REQUIREMENTS.mandatory.map(r => r.id);
    const conditional = LEGAL_REQUIREMENTS.conditional[project.id]?.map(r => r.id) || [];
    const required = [...mandatory, ...conditional];

    const isComplete = required.every(req => selectedRequirements.includes(req));
    const hasUnneeded = selectedRequirements.some(req => !required.includes(req));

    return {
        isComplete,
        hasUnneeded,
        missing: required.filter(req => !selectedRequirements.includes(req)),
        unnecessary: selectedRequirements.filter(req => !required.includes(req))
    };
}

// Función para obtener regulaciones aplicables
function getApplicableRegulations(project) {
    return LEGAL_REQUIREMENTS.regulations.filter(reg => reg.isApplicable(project));
}

// ============================================
// ESTRUCTURA LEGAL_DATA - Para Dashboard
// ============================================

const LEGAL_DATA = {
    // Documentos disponibles para drag & drop
    documents: [
        { id: 'env_license', name: 'Licencia Ambiental', icon: '📜', category: 'essential', usage: 'Requisito fundamental para todo tipo de proyecto' },
        { id: 'eia', name: 'Estudio de Impacto Ambiental', icon: '📊', category: 'essential', usage: 'Análisis requerido en proyectos con impacto ambiental' },
        { id: 'water_permit', name: 'Permiso de Agua', icon: '💧', category: 'conditional', usage: 'Se requiere en proyectos con alto consumo hídrico (minería, hidroeléctrica, agroindustria)' },
        { id: 'indigenous_consultation', name: 'Consulta Previa', icon: '🤝', category: 'conditional', usage: 'Obligatoria en territorios ancestrales indígenas o de comunidades' },
        { id: 'mining_permit', name: 'Permiso de Minería', icon: '⛏️', category: 'conditional', usage: 'Autorización necesaria para proyectos extractivos de minerales' },
        { id: 'forest_permit', name: 'Permiso Forestal', icon: '🌲', category: 'conditional', usage: 'Se requiere en proyectos donde se vean involucrados bosques' },
        { id: 'waste_plan', name: 'Plan de Residuos', icon: '♻️', category: 'conditional', usage: 'Necesario en proyectos que generan residuos significativos' },
        { id: 'social_plan', name: 'Plan Social', icon: '👥', category: 'conditional', usage: 'Requerido cuando hay comunidades afectadas por el proyecto' },
        { id: 'budget_approval', name: 'Aprobación de Presupuesto', icon: '💰', category: 'trap', usage: 'Trámite administrativo del proyecto' },
        { id: 'import_license', name: 'Licencia de Importación', icon: '📦', category: 'trap', usage: 'Solo aplica si el proyecto importa equipos (no siempre requerido)' },
        { id: 'public_contract_law', name: 'Ley Contratación Pública', icon: '⚖️', category: 'trap', usage: 'Solo aplica si hay financiamiento estatal o licitación pública' }
    ],

    // Requisitos por proyecto
    requirements: {
        litio: ['env_license', 'eia', 'water_permit', 'indigenous_consultation', 'mining_permit'],
        amazon: ['env_license', 'eia', 'forest_permit', 'social_plan'],
        hydro: ['env_license', 'eia', 'water_permit', 'social_plan'],
        skyCity: ['env_license', 'eia', 'waste_plan'],
        agroChemical: ['env_license', 'eia', 'water_permit', 'waste_plan']
    }
};

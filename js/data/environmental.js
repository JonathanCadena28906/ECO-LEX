// DECISIONES Y INDICADORES AMBIENTALES - FASE 2
const ENVIRONMENTAL_DECISIONS = {
    // Decisiones ambientales secuenciales
    decisions: [
        {
            id: 'wastewater',
            title: '¿Cómo manejarán las aguas residuales del proyecto?',
            description: 'La disposición final de residuos líquidos es crítica',
            options: [
                {
                    id: 'own_plant',
                    title: 'Planta de tratamiento propia',
                    description: 'Estándar más riguroso, máximo control',
                    impact: { water: -5, budget: -300, impact: -20, community: 15 }
                },
                {
                    id: 'certified_contractor',
                    title: 'Contrato con empresa certificada',
                    description: 'Balance entre costo y calidad',
                    impact: { water: -10, budget: -150, impact: -10, community: 10 }
                },
                {
                    id: 'permitted_discharge',
                    title: 'Vertimiento controlado con permiso',
                    description: 'Costo mínimo pero riesgo regulatorio',
                    impact: { water: -20, budget: 0, impact: 15, community: -10 }
                }
            ]
        },
        {
            id: 'land_use',
            title: '¿Cómo abordarán el uso del suelo en zona de amortiguación?',
            description: 'Gestión de la superficie y minimización de huella',
            options: [
                {
                    id: 'reduce_area',
                    title: 'Reducir el área del proyecto en un 20%',
                    description: 'Minimiza impacto pero reduce viabilidad',
                    impact: { land: -20, budget: -100, impact: -15, community: 20 }
                },
                {
                    id: 'ecological_compensation',
                    title: 'Plan de compensación ecológica (siembra de árboles)',
                    description: 'Allinea con Ley 2173 de 2021',
                    impact: { land: -5, budget: -200, impact: -10, community: 25 }
                },
                {
                    id: 'technical_exception',
                    title: 'Solicitar excepción técnica al Ministerio',
                    description: 'Riesgo de rechazo regulatorio',
                    impact: { land: 0, budget: -50, impact: 10, community: -15 }
                }
            ]
        },
        {
            id: 'water_conservation',
            title: '¿Qué enfoque de conservación de agua implementarán?',
            description: 'Eficiencia hídrica en operaciones',
            options: [
                {
                    id: 'recycling_system',
                    title: 'Sistema de reciclaje y reutilización',
                    description: 'Tecnología avanzada de eficiencia',
                    impact: { water: 20, budget: -350, impact: -15, community: 20 }
                },
                {
                    id: 'efficient_technology',
                    title: 'Tecnología eficiente estándar',
                    description: 'Solución balanceada',
                    impact: { water: 10, budget: -100, impact: -5, community: 10 }
                },
                {
                    id: 'standard_use',
                    title: 'Uso estándar sin medidas especiales',
                    description: 'Mínima inversión',
                    impact: { water: -15, budget: 0, impact: 10, community: -5 }
                }
            ]
        },
        {
            id: 'biodiversity',
            title: '¿Cómo protegerán la biodiversidad local?',
            description: 'Especies endémicas y ecosistema',
            options: [
                {
                    id: 'corridor_creation',
                    title: 'Crear corredor ecológico completo',
                    description: 'Máxima protección de hábitats',
                    impact: { land: -15, budget: -400, impact: -25, community: 30 }
                },
                {
                    id: 'habitat_restoration',
                    title: 'Plan de restauración de hábitats',
                    description: 'Enfoque de mitigación',
                    impact: { land: -5, budget: -200, impact: -10, community: 20 }
                },
                {
                    id: 'minimal_measures',
                    title: 'Medidas mínimas de protección',
                    description: 'Cumplimiento básico',
                    impact: { land: 0, budget: -50, impact: 5, community: 0 }
                }
            ]
        },
        {
            id: 'emissions',
            title: '¿Cómo manejarán las emisiones atmosféricas?',
            description: 'Control de contaminación del aire',
            options: [
                {
                    id: 'clean_tech',
                    title: 'Tecnología limpia con monitoreo continuo',
                    description: 'Estándar ambiental más alto',
                    impact: { budget: -250, impact: -20, community: 25 }
                },
                {
                    id: 'mitigation_plan',
                    title: 'Plan de mitigación estándar',
                    description: 'Cumplimiento normativo básico',
                    impact: { budget: -100, impact: -5, community: 10 }
                },
                {
                    id: 'no_special_measures',
                    title: 'No hay medidas especiales',
                    description: 'Depende de regulación base',
                    impact: { budget: 0, impact: 15, community: -10 }
                }
            ]
        },
        {
            id: 'community_engagement',
            title: '¿Qué nivel de compromiso comunitario implementarán?',
            description: 'Participación y beneficios locales',
            options: [
                {
                    id: 'strong_program',
                    title: 'Programa integral de beneficios comunitarios',
                    description: 'Empleo, educación, infraestructura',
                    impact: { budget: -300, impact: -10, community: 50 }
                },
                {
                    id: 'moderate_program',
                    title: 'Programa moderado de beneficios',
                    description: 'Empleo local y educación básica',
                    impact: { budget: -150, impact: 0, community: 25 }
                },
                {
                    id: 'minimal_engagement',
                    title: 'Cumplimiento legal mínimo',
                    description: 'Solo lo requerido',
                    impact: { budget: 0, impact: 10, community: -10 }
                }
            ]
        },
        {
            id: 'monitoring',
            title: '¿Qué sistema de monitoreo ambiental implementarán?',
            description: 'Vigilancia de indicadores ambientales',
            options: [
                {
                    id: 'advanced_monitoring',
                    title: 'Sistema de monitoreo avanzado en tiempo real',
                    description: 'Tecnología IoT y análisis continuo',
                    impact: { budget: -200, impact: -20, community: 15 }
                },
                {
                    id: 'standard_monitoring',
                    title: 'Monitoreo estándar trimestral',
                    description: 'Suficiente para regulación',
                    impact: { budget: -80, impact: -5, community: 5 }
                },
                {
                    id: 'basic_monitoring',
                    title: 'Auditoría anual solamente',
                    description: 'Mínimo requerido',
                    impact: { budget: -30, impact: 10, community: 0 }
                }
            ]
        }
    ],

    // Indicadores ambientales
    indicators: {
        water: {
            name: '💧 Agua Disponible',
            min: 0,
            max: 100,
            critical: 20,
            warning: 40,
            description: 'Recursos hídricos disponibles para operación'
        },
        land: {
            name: '🌍 Uso de Suelo Permitido',
            min: 0,
            max: 100,
            critical: 10,
            warning: 30,
            description: 'Área disponible sin exceder límites'
        },
        budget: {
            name: '💰 Presupuesto Restante',
            min: 0,
            max: 100,
            critical: 20,
            warning: 40,
            description: 'Fondos disponibles para proyecto'
        },
        impact: {
            name: '🌿 Impacto Ambiental',
            min: 0,
            max: 100,
            critical: 70,
            warning: 50,
            description: 'Cumulative environmental impact (menor es mejor)'
        },
        community: {
            name: '🤝 Aprobación Comunitaria',
            min: 0,
            max: 100,
            critical: 30,
            warning: 50,
            description: 'Nivel de aceptación y apoyo comunitario'
        }
    }
};

// Función para aplicar impacto de decisión
function applyDecisionImpact(currentState, decision) {
    const newState = { ...currentState };
    const impact = decision.impact;

    if (impact.water) newState.water = Math.max(0, Math.min(100, newState.water + impact.water));
    if (impact.land) newState.land = Math.max(0, Math.min(100, newState.land + impact.land));
    if (impact.budget) newState.budget = Math.max(0, Math.min(100, newState.budget + impact.budget));
    if (impact.impact) newState.impact = Math.max(0, Math.min(100, newState.impact + impact.impact));
    if (impact.community) newState.community = Math.max(0, Math.min(100, newState.community + impact.community));

    return newState;
}

// Función para mezclar array (Fisher-Yates shuffle)
function shuffleArray(array) {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
}

// Función para obtener decisiones del proyecto con decisiones aleatorias
function getDecisionsForPhase2() {
    // Números de decisiones según dificultad del proyecto
    const decisionCount = {
        'high': 5,
        'critical': 6
    };
    
    const numDecisions = decisionCount[gameState.project.difficulty] || 4;
    const allDecisions = ENVIRONMENTAL_DECISIONS.decisions;
    const shuffled = shuffleArray(allDecisions);
    
    return shuffled.slice(0, numDecisions);
}

// Función para evaluar estado ambiental
function evaluateEnvironmentalApproval(indicators) {
    let verdict = 'approved';
    let message = 'Aval Ambiental Completo';
    let score = 100;

    if (indicators.impact > 70) {
        verdict = 'rejected';
        message = 'Impacto ambiental demasiado alto. RECHAZADO.';
        score = 30;
    } else if (indicators.impact > 50) {
        verdict = 'conditional';
        message = 'Aval Ambiental Condicionado - Requiere medidas adicionales';
        score = 60;
    } else if (indicators.community < 30) {
        verdict = 'conditional';
        message = 'Aprobación comunitaria insuficiente - Requiere diálogo adicional';
        score = 50;
    } else if (indicators.water < 20 || indicators.land < 10 || indicators.budget < 20) {
        verdict = 'conditional';
        message = 'Recursos críticos insuficientes - Revisión de viabilidad requerida';
        score = 55;
    }

    return { verdict, message, score };
}

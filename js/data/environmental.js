// DECISIONES E INDICADORES AMBIENTALES - FASE 2
// ─────────────────────────────────────────────
// Unidades de los impactos:
//   budget   → pesos COP (ej. -8_000_000_000 = menos ocho mil millones = -$8 MM)
//   water    → m³/s  (caudal disponible)
//   land     → hectáreas (Ha)
//   impact   → toneladas de CO₂ equivalente (tCO₂e)  — menor es mejor
//   community→ porcentaje de aprobación 0-100  — mayor es mejor
// ─────────────────────────────────────────────

const ENVIRONMENTAL_DECISIONS = {
    decisions: [
        // ── 1. Aguas residuales ────────────────────────────────────────────────
        {
            id: 'wastewater',
            title: '¿Cómo manejarán las aguas residuales del proyecto?',
            description: 'La disposición final de residuos líquidos es crítica según el Decreto 1076 de 2015 del MADS y la Resolución 0631 de 2015 de la ANLA.',
            options: [
                {
                    id: 'own_plant',
                    title: 'Planta de tratamiento propia (PTAR)',
                    description: 'Construcción de planta propia con tecnología de biorreactor de membrana. Estándar más riguroso, cumple Res. 0631 ANLA.',
                    impact: { water: -3, budget: -120_000_000, impact: -18, community: 15 }
                },
                {
                    id: 'certified_contractor',
                    title: 'Contrato con empresa certificada ANLA',
                    description: 'Tercerizar a empresa con certificación ISO 14001. Balance costo-calidad razonable para proyectos medianos.',
                    impact: { water: -6, budget: -55_000_000, impact: -8, community: 10 }
                },
                {
                    id: 'permitted_discharge',
                    title: 'Vertimiento controlado con permiso ANLA',
                    description: 'Solicitar permiso de vertimiento. Costo mínimo pero riesgo regulatorio y de imagen ante comunidades ribereñas.',
                    impact: { water: -15, budget: -15_000_000, impact: 12, community: -12 }
                }
            ]
        },
        // ── 2. Uso del suelo ───────────────────────────────────────────────────
        {
            id: 'land_use',
            title: '¿Cómo abordarán el uso del suelo en zona de amortiguación?',
            description: 'Las zonas de amortiguación de áreas protegidas se rigen por la Ley 165 de 1994 y el Decreto 2372 de 2010. El MADS puede imponer restricciones adicionales.',
            options: [
                {
                    id: 'reduce_area',
                    title: 'Reducir el área del proyecto en un 20%',
                    description: 'Rediseño para minimizar huella sobre la zona de amortiguación. Requiere ajuste del plan de ingeniería.',
                    impact: { land: -20, budget: -60_000_000, impact: -12, community: 20 }
                },
                {
                    id: 'ecological_compensation',
                    title: 'Plan de compensación ecológica (Ley 2173 de 2021)',
                    description: 'Siembra de 3 árboles por cada árbol talado en predios equivalentes. Alineado con Ley 2173 sobre acuerdos de conservación.',
                    impact: { land: -5, budget: -90_000_000, impact: -10, community: 25 }
                },
                {
                    id: 'technical_exception',
                    title: 'Solicitar excepción técnica al Ministerio',
                    description: 'Trámite ante MADS para excepción en zona de amortiguación. Alto riesgo de rechazo y retraso de 6+ meses.',
                    impact: { land: 0, budget: -25_000_000, impact: 8, community: -18 }
                }
            ]
        },
        // ── 3. Conservación del agua ───────────────────────────────────────────
        {
            id: 'water_conservation',
            title: '¿Qué enfoque de conservación de agua implementarán?',
            description: 'Colombia es el sexto país con mayor recurso hídrico del mundo, pero la sobreexplotación local es una amenaza real. El IDEAM y las CAR monitorean el IUA (Índice de Uso del Agua).',
            options: [
                {
                    id: 'recycling_system',
                    title: 'Sistema de reciclaje y reutilización al 70%',
                    description: 'Instalación de sistema cerrado de recirculación. Reduce concesión de agua requerida a la CAR regional.',
                    impact: { water: 18, budget: -140_000_000, impact: -14, community: 20 }
                },
                {
                    id: 'efficient_technology',
                    title: 'Tecnología eficiente estándar (30% ahorro)',
                    description: 'Equipos de bajo consumo hídrico certificados. Solución balanceada con retorno de inversión en 3 años.',
                    impact: { water: 8, budget: -65_000_000, impact: -5, community: 10 }
                },
                {
                    id: 'standard_use',
                    title: 'Uso estándar sin medidas especiales',
                    description: 'Operación con consumo según diseño base. Mínima inversión pero posible conflicto con comunidades aguas abajo.',
                    impact: { water: -12, budget: 0, impact: 8, community: -8 }
                }
            ]
        },
        // ── 4. Biodiversidad ───────────────────────────────────────────────────
        {
            id: 'biodiversity',
            title: '¿Cómo protegerán la biodiversidad local?',
            description: 'Colombia tiene el 10% de la biodiversidad mundial. La Ley 99 de 1993 y el Decreto 1076 de 2015 exigen medidas de manejo de fauna y flora en todos los proyectos licenciados.',
            options: [
                {
                    id: 'corridor_creation',
                    title: 'Crear corredor ecológico certificado',
                    description: 'Diseño e implementación de corredor biológico según protocolo del IAvH (Instituto Humboldt). Máxima protección de hábitats.',
                    impact: { land: -12, budget: -150_000_000, impact: -22, community: 30 }
                },
                {
                    id: 'habitat_restoration',
                    title: 'Plan de restauración de hábitats degradados',
                    description: 'Restauración ecológica de áreas intervenidas con especies nativas. Enfoque participativo con comunidades locales.',
                    impact: { land: -4, budget: -85_000_000, impact: -10, community: 20 }
                },
                {
                    id: 'minimal_measures',
                    title: 'Medidas mínimas de cumplimiento legal',
                    description: 'Rescate de fauna y revegetalización básica según exigencias del EIA aprobado. Cumplimiento básico sin inversión adicional.',
                    impact: { land: 0, budget: -30_000_000, impact: 4, community: 0 }
                }
            ]
        },
        // ── 5. Emisiones atmosféricas ──────────────────────────────────────────
        {
            id: 'emissions',
            title: '¿Cómo manejarán las emisiones atmosféricas?',
            description: 'La Resolución 2254 de 2017 del MADS fija estándares de calidad del aire en Colombia. Proyectos de alta emisión deben instalar SIVICAIRE (Sistema de Vigilancia de Calidad del Aire).',
            options: [
                {
                    id: 'clean_tech',
                    title: 'Tecnología limpia con monitoreo SIVICAIRE',
                    description: 'Implementar SIVICAIRE + filtros catalíticos y captura de gases. Estándar ambiental más alto, compatible con bonos de carbono.',
                    impact: { budget: -130_000_000, impact: -18, community: 25 }
                },
                {
                    id: 'mitigation_plan',
                    title: 'Plan de mitigación estándar (Res. 2254)',
                    description: 'Cumplimiento de estándares nacionales de calidad del aire con monitoreo semestral. Solución normativa básica.',
                    impact: { budget: -55_000_000, impact: -4, community: 10 }
                },
                {
                    id: 'no_special_measures',
                    title: 'Sin medidas especiales de mitigación',
                    description: 'Depende de la regulación base. Alto riesgo de alertas tempranas y quejas ante la CAR por parte de comunidades.',
                    impact: { budget: 0, impact: 14, community: -12 }
                }
            ]
        },
        // ── 6. Compromiso comunitario ──────────────────────────────────────────
        {
            id: 'community_engagement',
            title: '¿Qué nivel de compromiso comunitario implementarán?',
            description: 'La consulta previa es un derecho fundamental en Colombia (Convenio 169 OIT, Decreto 1066 de 2015). Los proyectos en zonas de comunidades étnicas DEBEN realizarla.',
            options: [
                {
                    id: 'strong_program',
                    title: 'Programa integral: empleo, educación e infraestructura',
                    description: 'Convenio marco con JAC y cabildos: empleos locales (mínimo 30%), becas, mejora de vías terciarias y acueductos comunitarios.',
                    impact: { budget: -140_000_000, impact: -8, community: 50 }
                },
                {
                    id: 'moderate_program',
                    title: 'Programa moderado: empleo local y beneficios básicos',
                    description: 'Contratación local (15%) y fondo de proyectos productivos. Equilibrio entre inversión social y viabilidad financiera.',
                    impact: { budget: -60_000_000, impact: 0, community: 25 }
                },
                {
                    id: 'minimal_engagement',
                    title: 'Solo cumplimiento legal mínimo (Decreto 1066)',
                    description: 'Socialización básica del EIA y reuniones informativas. Sin compromisos adicionales. Alto riesgo de bloqueos.',
                    impact: { budget: -15_000_000, impact: 8, community: -15 }
                }
            ]
        },
        // ── 7. Sistema de monitoreo ────────────────────────────────────────────
        {
            id: 'monitoring',
            title: '¿Qué sistema de monitoreo ambiental implementarán?',
            description: 'La ANLA exige Informes de Cumplimiento Ambiental (ICA) según la resolución de licencia. El SINA (Sistema Nacional Ambiental) recomienda monitoreo continuo en proyectos de alto impacto.',
            options: [
                {
                    id: 'advanced_monitoring',
                    title: 'Plataforma IoT de monitoreo en tiempo real',
                    description: 'Sensores integrados con dashboard en línea para la ANLA y la CAR. Incluye alertas automáticas y reporte ICA trimestral.',
                    impact: { budget: -90_000_000, impact: -16, community: 15 }
                },
                {
                    id: 'standard_monitoring',
                    title: 'Monitoreo estándar con ICA semestral',
                    description: 'Equipo técnico propio con mediciones semestrales y reporte ICA a la ANLA. Cumple requisito mínimo de licencia.',
                    impact: { budget: -45_000_000, impact: -4, community: 5 }
                },
                {
                    id: 'basic_monitoring',
                    title: 'Solo auditoría anual externa',
                    description: 'Contratación de firma auditora una vez al año. Mínimo requerido, pero insuficiente ante alertas ambientales inesperadas.',
                    impact: { budget: -12_000_000, impact: 8, community: 0 }
                }
            ]
        }
    ],

    // ─── Indicadores ambientales (metadatos) ──────────────────────────────────
    indicators: {
        water: {
            name: '💧 Agua Disponible',
            unit: 'm³/s',
            critical: 20,   // % del max
            warning: 40,
            description: 'Recursos hídricos disponibles (concesión CAR)'
        },
        land: {
            name: '🌍 Uso de Suelo Permitido',
            unit: 'Ha',
            critical: 10,
            warning: 30,
            description: 'Área disponible sin exceder límites del EIA'
        },
        budget: {
            name: '💰 Presupuesto Restante',
            unit: 'COP',
            critical: 20,
            warning: 40,
            description: 'Fondos disponibles del proyecto (pesos colombianos)'
        },
        impact: {
            name: '🌿 Impacto Ambiental',
            unit: 'tCO₂e',
            critical: 70,
            warning: 50,
            description: 'Huella ambiental acumulada — menor es mejor'
        },
        community: {
            name: '🤝 Aprobación Comunitaria',
            unit: '%',
            critical: 30,
            warning: 50,
            description: 'Nivel de aceptación social del proyecto'
        }
    }
};

// ── Mezclar array (Fisher-Yates) ───────────────────────────────────────────────
function shuffleArray(array) {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
}

// ── Obtener decisiones aleatorias según dificultad ────────────────────────────
function getDecisionsForPhase2() {
    const decisionCount = { high: 5, critical: 7 };
    const numDecisions = decisionCount[gameState.project?.difficulty] || 5;
    return shuffleArray(ENVIRONMENTAL_DECISIONS.decisions).slice(0, numDecisions);
}

// ── Aplicar impacto de una decisión al estado ─────────────────────────────────
function applyDecisionImpact(currentState, decision) {
    const newState = { ...currentState };
    const impact = decision.impact;
    if (impact.water)     newState.water     = Math.max(0, newState.water + impact.water);
    if (impact.land)      newState.land      = Math.max(0, newState.land + impact.land);
    if (impact.budget)    newState.budget    = Math.max(0, newState.budget + impact.budget);
    if (impact.impact)    newState.impact    = Math.max(0, newState.impact + impact.impact);
    if (impact.community) newState.community = Math.max(0, Math.min(100, newState.community + impact.community));
    return newState;
}

// ── Evaluar estado ambiental (recibe indicadores normalizados 0-100) ───────────
function evaluateEnvironmentalApproval(indicatorsPct) {
    let verdict = 'approved';
    let message = 'Aval Ambiental Completo — Licencia viable';
    let score = 100;

    if (indicatorsPct.impact > 70) {
        verdict = 'rejected';
        message = 'Impacto ambiental excesivo. ANLA RECHAZA la licencia.';
        score = 30;
    } else if (indicatorsPct.impact > 50) {
        verdict = 'conditional';
        message = 'Aval Condicionado — ANLA exige medidas compensatorias adicionales';
        score = 60;
    } else if (indicatorsPct.community < 30) {
        verdict = 'conditional';
        message = 'Licencia Social insuficiente — Se requiere consulta previa ampliada';
        score = 50;
    } else if (indicatorsPct.water < 20 || indicatorsPct.land < 10 || indicatorsPct.budget < 20) {
        verdict = 'conditional';
        message = 'Recursos críticos al límite — CAR solicita revisión de viabilidad';
        score = 55;
    }

    return { verdict, message, score };
}


// PROYECTOS ECO-LEX
const PROJECTS = {
    litio: {
        id: 'litio',
        name: 'Litio-Explor',
        description: 'Extracción de litio en una zona de reserva hídrica (La Guajira / altiplano)',
        challenge: 'Alto consumo de agua y conflicto con comunidades indígenas',
        risks: [
            'Contaminación de recursos hídricos',
            'Impacto en territorios indígenas',
            'Sobreexplotación de acuíferos',
            'Alta oposición comunitaria'
        ],
        resources: {
            water: 240,                 // extracción intensiva
            land: 300,                  // Ha
            budget: 360_000_000,        // $360 millones COP
            community: 60               // baja aceptación inicial
        },
        difficulty: 'high',
        group: 1
    },

    amazon: {
        id: 'amazon',
        name: 'Amazon-Gate',
        description: 'Megacentro logístico en borde amazónico (Caquetá / Putumayo)',
        challenge: 'Deforestación y presión sobre ecosistemas protegidos',
        risks: [
            'Deforestación acelerada',
            'Pérdida de biodiversidad',
            'Tráfico de carga pesada',
            'Fragmentación del ecosistema'
        ],
        resources: {
            water: 120,
            land: 600,
            budget: 500_000_000,        // $500 millones COP
            community: 70
        },
        difficulty: 'high',
        group: 2
    },

    hydro: {
        id: 'hydro',
        name: 'Hidro-Vida',
        description: 'Represa hidroeléctrica tipo Hidroituango (escala media)',
        challenge: 'Desplazamiento social y alteración del río',
        risks: [
            'Desplazamiento de comunidades',
            'Alteración del ecosistema fluvial',
            'Pérdida de pesca artesanal',
            'Riesgo geotécnico'
        ],
        resources: {
            water: 400,                 // alto uso del caudal
            land: 500,
            budget: 700_000_000,        // $700 millones COP
            community: 50               // fuerte conflicto social
        },
        difficulty: 'critical',
        group: 3
    },

    skyCity: {
        id: 'skyCity',
        name: 'Sky-City',
        description: 'Complejo turístico en páramo (Cundinamarca / Boyacá)',
        challenge: 'Impacto en ecosistemas estratégicos (páramos)',
        risks: [
            'Afectación de fuentes hídricas',
            'Daño a flora endémica',
            'Generación masiva de residuos',
            'Turismo no sostenible'
        ],
        resources: {
            water: 100,
            land: 160,
            budget: 560_000_000,        // $560 millones COP
            community: 110
        },
        difficulty: 'high',
        group: 5
    },

    agroChemical: {
        id: 'agroChemical',
        name: 'Agro-Química',
        description: 'Plantación de palma en Meta / Magdalena Medio',
        challenge: 'Uso intensivo de agroquímicos cerca de acuíferos',
        risks: [
            'Contaminación de aguas subterráneas',
            'Pérdida de biodiversidad',
            'Monocultivo extensivo',
            'Conflictos por uso del suelo'
        ],
        resources: {
            water: 180,
            land: 800,
            budget: 240_000_000,        // $240 millones COP
            community: 90
        },
        difficulty: 'high',
        group: 6
    }
};

// Función para obtener proyecto por grupo
function getProjectByGroup(groupNumber) {
    const projectMap = {
        1: PROJECTS.litio,
        2: PROJECTS.amazon,
        3: PROJECTS.hydro,
        5: PROJECTS.skyCity,
        6: PROJECTS.agroChemical
    };
    return projectMap[groupNumber];
}

// Función para obtener proyecto aleatorio
function getRandomProject() {
    const projects = Object.values(PROJECTS);
    return projects[Math.floor(Math.random() * projects.length)];
}
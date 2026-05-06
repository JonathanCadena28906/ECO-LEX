
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
            water: 120,                 // extracción intensiva
            land: 150,                  // Ha
            budget: 180_000_000,        // $180 millones COP
            community: 30               // baja aceptación inicial
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
            water: 60,
            land: 300,
            budget: 250_000_000,        // $250 millones COP
            community: 35
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
            water: 200,                 // alto uso del caudal
            land: 250,
            budget: 350_000_000,        // $350 millones COP
            community: 25               // fuerte conflicto social
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
            water: 50,
            land: 80,
            budget: 280_000_000,        // $280 millones COP
            community: 55
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
            water: 90,
            land: 400,
            budget: 120_000_000,        // $120 millones COP
            community: 45
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
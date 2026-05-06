// PROYECTOS ECO-LEX
const PROJECTS = {
    litio: {
        id: 'litio',
        name: 'Litio-Explor',
        description: 'Extracción de litio en una zona de reserva hídrica',
        challenge: 'Alto consumo de agua y tierras ancestrales',
        risks: [
            'Contaminación de recursos hídricos',
            'Impacto en territorios indígenas',
            'Degradación del suelo',
            'Oposición comunitaria'
        ],
        resources: {
            water: 100,
            land: 100,
            budget: 1000,
            community: 50
        },
        difficulty: 'high',
        group: 1
    },
    amazon: {
        id: 'amazon',
        name: 'Amazon-Gate',
        description: 'Megacentro logístico y puerto seco en el borde de una selva protegida',
        challenge: 'Deforestación y tráfico de carga pesada',
        risks: [
            'Deforestación y pérdida de hábitat',
            'Tráfico de vehículos pesados',
            'Presión sobre la infraestructura',
            'Fragmentación del ecosistema'
        ],
        resources: {
            water: 80,
            land: 120,
            budget: 1200,
            community: 40
        },
        difficulty: 'high',
        group: 2
    },
    hydro: {
        id: 'hydro',
        name: 'Hidro-Vida',
        description: 'Represa hidroeléctrica que inundará el 15% de un pueblo pesquero',
        challenge: 'Desplazamiento social y cambio de curso del río',
        risks: [
            'Desplazamiento de población',
            'Cambios en el curso del río',
            'Impacto en los medios de vida',
            'Disrupción ecológica'
        ],
        resources: {
            water: 150,
            land: 90,
            budget: 1500,
            community: 30
        },
        difficulty: 'critical',
        group: 3
    },
    skyCity: {
        id: 'skyCity',
        name: 'Sky-City',
        description: 'Complejo de hoteles de lujo en un ecosistema de páramo/humedal',
        challenge: 'Gestión de residuos masiva y protección de especies endémicas',
        risks: [
            'Necesidad de gestión masiva de residuos',
            'Protección de especies endémicas',
            'Interferencia en el nivel freático',
            'Impacto del turismo'
        ],
        resources: {
            water: 70,
            land: 60,
            budget: 2000,
            community: 60
        },
        difficulty: 'high',
        group: 5
    },
    agroChemical: {
        id: 'agroChemical',
        name: 'Agro-Química',
        description: 'Plantación masiva de palma de aceite con uso intensivo de pesticidas cerca de un acuífero',
        challenge: 'Contaminación química y monocultivo',
        risks: [
            'Contaminación química del acuífero',
            'Escorrentía de pesticidas',
            'Impacto del monocultivo',
            'Impacto agrícola'
        ],
        resources: {
            water: 110,
            land: 140,
            budget: 800,
            community: 35
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

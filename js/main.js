// CONTROLADOR PRINCIPAL Y NAVEGACIÓN
console.log('✅ main.js cargado');
console.log('gameState disponible:', typeof gameState !== 'undefined');

document.addEventListener('DOMContentLoaded', () => {
    console.log('🎮 DOMContentLoaded activado');

    try {
        console.log('Verificando gameState...', gameState);

        // Inicializar HUD si la función existe
        if (typeof initializeHUD === 'function') {
            console.log('Inicializando HUD...');
            initializeHUD();
        }

        console.log('Intentando cargar estado anterior...');

        // Intentar cargar estado anterior
        if (!gameState.load()) {
            console.log('Sin estado guardado, mostrando registro');
            renderRegistrationScreen();
        } else {
            console.log('Estado guardado encontrado, pantalla:', gameState.screen);
            // Si hay estado guardado, ir a pantalla actual
            switch (gameState.screen) {
                case 'registration':
                    renderRegistrationScreen();
                    break;
                case 'intro':
                    renderIntroScreen();
                    break;
                case 'project-assignment':
                    renderProjectAssignmentScreen();
                    break;
                case 'phase1':
                    renderPhase1DragDrop();
                    break;
                case 'phase2':
                    renderPhase2EnvironmentalCards();
                    break;
                case 'phase3':
                    renderPhase3Crisis();
                    break;
                case 'report':
                    renderFinalReportWithHeadlines();
                    break;
                default:
                    console.log('Pantalla desconocida, mostrando registro');
                    renderRegistrationScreen();
            }
        }
    } catch (error) {
        console.error('❌ Error en inicialización:', error);
        // Mostrar error en la pantalla
        const appDiv = document.getElementById('app');
        if (appDiv) {
            appDiv.innerHTML = `
                <div style="padding: 2rem; color: red; background: #fff; margin: 2rem; border-radius: 8px;">
                    <h2>❌ Error de Inicialización</h2>
                    <p>${error.message}</p>
                    <pre style="background: #f0f0f0; padding: 1rem; overflow-x: auto; font-size: 0.85rem;">
${error.stack}
                    </pre>
                    <button onclick="location.reload()" style="padding: 0.5rem 1rem; margin-top: 1rem; cursor: pointer;">
                        Recargar
                    </button>
                </div>
            `;
        }
    }
});

// PANTALLA 0 - REGISTRO DEL GRUPO
function getGroupRoster(groupNumber) {
    if (window.ENV && window.ENV.GROUP_ROSTERS) {
        return window.ENV.GROUP_ROSTERS[groupNumber] || [];
    }
    console.warn("No se encontraron variables de entorno para los integrantes del grupo.");
    return [];
}

function renderRegistrationScreen() {
    console.log('📋 Renderizando Pantalla de Registro');
    const app = document.getElementById('app');
    if (!app) {
        console.error('❌ Elemento #app no encontrado');
        return;
    }
    gameState.screen = 'registration';
    gameState.setHUDVisibility(false);

    app.innerHTML = `
        <div class="screen" style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); justify-content: center; padding: 2rem; min-height: calc(100vh - 120px);">
            <div style="max-width: 720px; width: 100%;">
                <div style="text-align: center; color: white; margin-bottom: 3rem;">
                    <h1 style="font-size: 3rem; margin-bottom: 1rem;">🌱 ECO-LEX</h1>
                    <p style="font-size: 1.25rem; opacity: 0.9;">Juego Educativo de Gestión de Proyectos en Colombia</p>
                </div>

                <div style="background: white; border-radius: 12px; padding: 2rem; box-shadow: 0 10px 40px rgba(0,0,0,0.2);">
                    <h2 style="text-align: center; margin-bottom: 2rem; color: #333;">📋 Registro del Grupo</h2>

                    <form id="registration-form">
                        <div style="margin-bottom: 1.5rem;">
                            <label for="group-number" style="display: block; margin-bottom: 0.5rem; font-weight: bold; color: #333;">Número de Grupo</label>
                            <select id="group-number" name="groupNumber" required style="width: 100%; padding: 0.75rem; border: 1px solid #ddd; border-radius: 6px; font-size: 1rem;">
                                <option value="">-- Seleccione su grupo --</option>
                                <option value="1">Grupo 1</option>
                                <option value="2">Grupo 2</option>
                                <option value="3">Grupo 3</option>
                                <option value="5">Grupo 5</option>
                                <option value="6">Grupo 6</option>
                            </select>
                        </div>

                        <div id="members-container" style="margin-top: 1.5rem;"></div>

                        <div id="form-buttons" style="display: none; margin-top: 2rem;">
                            <button type="submit" style="width: 100%; padding: 1rem; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; border: none; border-radius: 8px; font-size: 1.1rem; font-weight: bold; cursor: pointer;">
                                ▶️ Confirmar Grupo e Iniciar Juego
                            </button>
                        </div>
                    </form>

                    <div id="info-message" style="margin-top: 2rem; padding: 1rem; background: #f0f7ff; border-radius: 8px; border-left: 4px solid #0066cc; color: #333;">
                        <strong>ℹ️ Dinámica del registro:</strong>
                        <ul style="margin-left: 1rem; margin-top: 0.5rem; font-size: 0.9rem;">
                            <li>Solo selecciona tu grupo.</li>
                            <li>El sistema mostrará automáticamente integrantes y roles.</li>
                            <li>El proyecto se asigna de acuerdo al grupo registrado.</li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    `;

    const groupSelect = document.getElementById('group-number');
    const membersContainer = document.getElementById('members-container');
    const formButtons = document.getElementById('form-buttons');

    groupSelect.addEventListener('change', (e) => {
        const groupNumber = parseInt(e.target.value);
        const roster = getGroupRoster(groupNumber);
        membersContainer.innerHTML = '';

        if (roster.length > 0) {
            membersContainer.innerHTML = `
                <div style="background: #f5f7fa; border-left: 4px solid #667eea; padding: 1rem; border-radius: 8px;">
                    <strong>👥 Integrantes y roles del grupo seleccionado:</strong>
                    <div style="margin-top: 0.75rem; display: grid; gap: 0.75rem;">
                        ${roster.map(member => `
                            <div style="padding: 0.75rem 1rem; background: white; border-radius: 6px; box-shadow: 0 2px 8px rgba(0,0,0,0.06);">
                                <div style="font-weight: bold; color: #333;">${member.name}</div>
                                <div style="color: #666; font-size: 0.95rem;">Rol: ${member.role}</div>
                            </div>
                        `).join('')}
                    </div>
                </div>
            `;
            formButtons.style.display = 'block';
        } else {
            formButtons.style.display = 'none';
        }
    });

    const form = document.getElementById('registration-form');
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        submitRegistration();
    });

    gameState.save();
}

function submitRegistration() {
    const groupNumber = parseInt(document.getElementById('group-number').value);
    const teamMembers = getGroupRoster(groupNumber).map(member => ({ ...member }));

    if (!groupNumber || teamMembers.length === 0) {
        alert('Por favor selecciona un grupo válido antes de iniciar.');
        return;
    }

    gameState.setGroupInfo(groupNumber, teamMembers);
    gameState.screen = 'intro';
    gameState.save();

    renderIntroScreen();
}

// PANTALLA 1 - INTRODUCCIÓN EDUCATIVA
function renderIntroScreen() {
    const app = document.getElementById('app');
    gameState.screen = 'intro';
    gameState.setHUDVisibility(false);

    app.innerHTML = `
        <div class="screen">
            <div class="header" style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; border-bottom-color: white;">
                <div class="header-content">
                    <div class="header-title">
                        <h1 style="color: white;">ECO-LEX: Introducción Educativa</h1>
                    </div>
                </div>
            </div>

            <div class="main-content">
                <div class="container">
                    <div class="grid grid-cols-2">
                        <!-- Bloque 1: Gestión Legal -->
                        <div class="card">
                            <div class="card-header">
                                <h2 class="card-title">⚖️ ¿Qué es la Gestión Legal de Proyectos en Colombia?</h2>
                            </div>
                            <div class="card-body">
                                <p>
                                    <strong>Definición:</strong> Conjunto de acciones y procesos jurídicos que garantizan 
                                    la viabilidad, legalidad y cumplimiento normativo de un proyecto a lo largo de su ciclo de vida.
                                </p>

                                <h4>Componentes Clave:</h4>
                                <ul>
                                    <li><strong>Gestión contractual:</strong> Elaboración y revisión de contratos</li>
                                    <li><strong>Compliance:</strong> Cumplimiento normativo (ambiental, laboral, societario)</li>
                                    <li><strong>Gestión de riesgos legales:</strong> Identificación y mitigación de litigios</li>
                                </ul>

                                <h4>Normativa Colombiana Relevante:</h4>
                                <ul>
                                    <li><strong>Ley 80 de 1993:</strong> Contratación pública</li>
                                    <li><strong>Ley 99 de 1993:</strong> Medio ambiente</li>
                                    <li><strong>Código Sustantivo del Trabajo:</strong> Derechos laborales</li>
                                    <li><strong>Licencias urbanísticas y ambientales:</strong> Uso del territorio</li>
                                </ul>
                            </div>
                        </div>

                        <!-- Bloque 2: Gestión Ambiental -->
                        <div class="card">
                            <div class="card-header">
                                <h2 class="card-title">🌿 ¿Qué es la Gestión Ambiental en Colombia?</h2>
                            </div>
                            <div class="card-body">
                                <p>
                                    <strong>Definición:</strong> Conjunto de políticas, normas e instrumentos que previenen, 
                                    mitigan y controlan los impactos ambientales, promoviendo el desarrollo sostenible.
                                </p>

                                <h4>Componentes Clave:</h4>
                                <ul>
                                    <li><strong>Instrumentos:</strong> Licencias ambientales, estudios de impacto, permisos de emisiones</li>
                                    <li><strong>Sistemas de Gestión:</strong> Alineados con ISO 14001</li>
                                    <li><strong>Ciclo:</strong> Planificación, implementación y mejora continua</li>
                                </ul>

                                <h4>Normativa Colombiana Relevante:</h4>
                                <ul>
                                    <li><strong>Decreto 1076 de 2015:</strong> Gestión ambiental territorial</li>
                                    <li><strong>Ley 1931 de 2018:</strong> Cambio climático y licencias ambientales</li>
                                    <li><strong>Ley 2173 de 2021:</strong> Restauración ecológica</li>
                                    <li><strong>NTC-ISO 14001:</strong> Sistemas de Gestión Ambiental</li>
                                </ul>
                            </div>
                        </div>
                    </div>

                    <div style="margin-top: 2rem; text-align: center;">
                        <p style="font-size: 1.1rem; color: #e0e0e0; margin-bottom: 2rem;">
                            Ahora está listo para comenzar. Como equipo, navegará las tensiones entre 
                            rigor legal y flexibilidad ambiental, mientras enfrenta eventos aleatorios inesperados.
                        </p>
                        <button class="btn btn-primary btn-lg" onclick="goToProjectAssignment()">
                            Entendido — Iniciar mi Proyecto
                        </button>
                    </div>
                </div>
            </div>
        </div>
    `;

    gameState.save();
}

function goToProjectAssignment() {
    gameState.screen = 'project-assignment';
    gameState.save();
    renderProjectAssignmentScreen();
}

// PANTALLA 2 - ASIGNACIÓN DE PROYECTO
function renderProjectAssignmentScreen() {
    const app = document.getElementById('app');
    gameState.screen = 'project-assignment';

    const project = getProjectByGroup(gameState.groupNumber);
    gameState.setProject(project);
    gameState.updateHUD();

    const difficultyEmoji = project.difficulty === 'critical' ? '🔴' : project.difficulty === 'high' ? '🟠' : '🟡';

    app.innerHTML = `
        <div class="screen" style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); justify-content: center;">
            <div class="container-sm" style="max-width: 700px;">
                <div style="text-align: center; color: white; margin-bottom: 3rem;">
                    <h1 style="font-size: 2.5rem; margin-bottom: 1rem;">🎯 Tu Proyecto Asignado</h1>
                </div>

                <div style="background: white; color: #333; border-radius: 12px; padding: 2rem; box-shadow: 0 10px 40px rgba(0,0,0,0.2);">
                    <div style="text-align: center; margin-bottom: 1rem;">
                        <div style="font-size: 3rem; margin-bottom: 1rem;">🏗️</div>
                        <h2 style="margin-bottom: 0.5rem;">${project.name}</h2>
                        <p style="color: #666; margin-bottom: 1.5rem;">${project.description}</p>
                    </div>

                    <div style="background: #f5f7fa; border-left: 4px solid #667eea; padding: 1rem; margin-bottom: 1rem; border-radius: 8px;">
                        <strong>🎪 Reto Principal:</strong><br>
                        <span>${project.challenge}</span>
                    </div>

                    <div style="background: #f5f7fa; border-left: 4px solid #ff6b6b; padding: 1rem; margin-bottom: 1rem; border-radius: 8px;">
                        <strong>⚠️ Riesgos Identificados:</strong><br>
                        <ul style="margin-left: 1rem; margin-top: 0.5rem;">
                            ${project.risks.map(risk => `<li>${risk}</li>`).join('')}
                        </ul>
                    </div>

                    <div style="background: #f5f7fa; border-left: 4px solid #51cf66; padding: 1rem; margin-bottom: 2rem; border-radius: 8px;">
                        <strong>💼 Recursos Iniciales:</strong><br>
                        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; margin-top: 0.5rem;">
                            <div>💧 Agua: ${project.resources.water} unidades</div>
                            <div>🌍 Suelo: ${project.resources.land} unidades</div>
                            <div>💰 Presupuesto: $${project.resources.budget}K</div>
                            <div>🤝 Comunidad: ${project.resources.community}% apoyo</div>
                        </div>
                    </div>

                    <div style="text-align: center; margin-bottom: 1.5rem;">
                        <span style="font-size: 1.2rem;"><strong>Dificultad: ${difficultyEmoji} ${project.difficulty.toUpperCase()}</strong></span>
                    </div>

                    <button class="btn btn-primary btn-block btn-lg" onclick="startPhase1()" style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); border: none;">
                        Aceptar Proyecto e Iniciar Fase Legal →
                    </button>
                </div>

                <div style="text-align: center; margin-top: 2rem; color: white;">
                    <small>Grupo ${gameState.groupNumber} • ${gameState.teamMembers.map(m => m.name).join(', ')}</small>
                </div>
            </div>
        </div>
    `;

    gameState.save();
}

function startPhase1() {
    gameState.screen = 'phase1';
    gameState.startTime = new Date();
    gameState.save();
    renderPhase1DragDrop();
}

// Exportar funciones necesarias
window.goToProjectAssignment = goToProjectAssignment;
window.startPhase1 = startPhase1;

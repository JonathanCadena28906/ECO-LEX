// CONTROLADOR PRINCIPAL Y NAVEGACIÓN
document.addEventListener('DOMContentLoaded', () => {
    // Intentar cargar estado anterior
    if (!gameState.load()) {
        renderRegistrationScreen();
    } else {
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
                renderPhase1Screen();
                break;
            case 'phase2':
                renderPhase2Screen();
                break;
            case 'phase3':
                renderPhase3Screen();
                break;
            case 'report':
                renderReportScreen();
                break;
            default:
                renderRegistrationScreen();
        }
    }
});

// PANTALLA 0 - REGISTRO DEL GRUPO
function renderRegistrationScreen() {
    const app = document.getElementById('app');
    gameState.screen = 'registration';

    app.innerHTML = `
        <div class="screen" style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); justify-content: center;">
            <div class="container-sm" style="max-width: 600px;">
                <div style="text-align: center; color: white; margin-bottom: 3rem;">
                    <h1 style="font-size: 3rem; margin-bottom: 1rem;">🌱 ECO-LEX</h1>
                    <p style="font-size: 1.25rem; opacity: 0.9;">Juego Educativo de Gestión de Proyectos en Colombia</p>
                </div>

                <div style="background: white; border-radius: 12px; padding: 2rem; box-shadow: 0 10px 40px rgba(0,0,0,0.2);">
                    <h2 style="text-align: center; margin-bottom: 2rem;">📋 Registro del Grupo</h2>

                    <form id="registration-form">
                        <!-- Número de Grupo -->
                        <div class="form-group">
                            <label for="group-number">Número de Grupo (1-6)</label>
                            <select id="group-number" name="groupNumber" required>
                                <option value="">-- Seleccione su grupo --</option>
                                <option value="1">Grupo 1</option>
                                <option value="2">Grupo 2</option>
                                <option value="3">Grupo 3</option>
                                <option value="5">Grupo 5</option>
                                <option value="6">Grupo 6</option>
                            </select>
                        </div>

                        <!-- Número de Integrantes -->
                        <div class="form-group">
                            <label for="member-count">Número de Integrantes (1-3)</label>
                            <select id="member-count" name="memberCount" required>
                                <option value="">-- Seleccione cantidad --</option>
                                <option value="1">1 Integrante</option>
                                <option value="2">2 Integrantes</option>
                                <option value="3">3 Integrantes</option>
                            </select>
                        </div>

                        <!-- Contenedor de integrantes -->
                        <div id="members-container" style="margin-top: 2rem;"></div>

                        <!-- Botones -->
                        <div id="form-buttons" style="display: none; margin-top: 2rem;">
                            <button type="submit" class="btn btn-primary btn-block btn-lg">Iniciar Juego</button>
                        </div>
                    </form>

                    <div id="info-message" style="margin-top: 2rem; padding: 1rem; background: #f0f7ff; border-radius: 8px; border-left: 4px solid #0066cc;">
                        <strong>ℹ️ Asignación de Roles:</strong>
                        <ul style="margin-left: 1rem; margin-top: 0.5rem; font-size: 0.9rem;">
                            <li><strong>1 integrante:</strong> Rol único "Director General"</li>
                            <li><strong>2 integrantes:</strong> "Director Legal" y "Director Ambiental"</li>
                            <li><strong>3 integrantes:</strong> + "Gestor de Crisis"</li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    `;

    const memberCountSelect = document.getElementById('member-count');
    const membersContainer = document.getElementById('members-container');
    const formButtons = document.getElementById('form-buttons');

    memberCountSelect.addEventListener('change', (e) => {
        const count = parseInt(e.target.value);
        membersContainer.innerHTML = '';

        if (count > 0) {
            for (let i = 1; i <= count; i++) {
                const roles = ['Director General', 'Director Legal', 'Director Ambiental', 'Gestor de Crisis'];
                const role = count === 1 ? roles[0] : count === 2 ? (i === 1 ? roles[1] : roles[2]) : roles[i - 1];

                const div = document.createElement('div');
                div.className = 'form-group';
                div.innerHTML = `
                    <label for="member-${i}-name">Nombre Completo - Integrante ${i} (${role})</label>
                    <input type="text" id="member-${i}-name" name="member-${i}-name" placeholder="Ej: Juan Pérez García" required>
                `;
                membersContainer.appendChild(div);
            }

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
    const memberCount = parseInt(document.getElementById('member-count').value);

    const teamMembers = [];
    const roles = ['Director General', 'Director Legal', 'Director Ambiental', 'Gestor de Crisis'];

    for (let i = 1; i <= memberCount; i++) {
        const name = document.getElementById(`member-${i}-name`).value;
        const role = memberCount === 1 ? roles[0] : memberCount === 2 ? (i === 1 ? roles[1] : roles[2]) : roles[i - 1];

        teamMembers.push({ name, role });
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
                        <p style="font-size: 1.1rem; color: #666; margin-bottom: 2rem;">
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

    const difficultyEmoji = project.difficulty === 'critical' ? '🔴' : project.difficulty === 'high' ? '🟠' : '🟡';

    app.innerHTML = `
        <div class="screen" style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); justify-content: center;">
            <div class="container-sm" style="max-width: 700px;">
                <div style="text-align: center; color: white; margin-bottom: 3rem;">
                    <h1 style="font-size: 2.5rem; margin-bottom: 1rem;">🎯 Tu Proyecto Asignado</h1>
                </div>

                <div style="background: white; border-radius: 12px; padding: 2rem; box-shadow: 0 10px 40px rgba(0,0,0,0.2);">
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
    renderPhase1Screen();
}

// Exportar funciones necesarias
window.goToProjectAssignment = goToProjectAssignment;
window.startPhase1 = startPhase1;

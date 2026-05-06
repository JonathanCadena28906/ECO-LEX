// FASE 3 - CRISIS
function renderPhase3Screen() {
    const app = document.getElementById('app');

    gameState.currentPhase = 'crisis';
    eventsEngine.changePhase('crisis');

    // Seleccionar una crisis principal
    const crisisEvents = EVENTS_BANK.filter(e => e.severity === 'critical' && e.phase.includes('crisis'));
    const mainCrisis = crisisEvents[Math.floor(Math.random() * crisisEvents.length)];

    app.innerHTML = `
        <div class="screen">
            <div class="header crisis">
                <div class="header-content">
                    <div class="header-title">
                        <h1>Fase 3: Gestión de Crisis</h1>
                        <p>Proyecto: ${gameState.project.name}</p>
                    </div>
                    <div class="header-info">
                        <div class="header-info-item">
                            <span class="phase-badge crisis">CRISIS</span>
                        </div>
                    </div>
                </div>
            </div>

            <div class="main-content">
                <div class="container-sm">
                    <div class="alert alert-error">
                        <div class="alert-icon">🚨</div>
                        <div class="alert-content">
                            <div class="alert-title">¡CRISIS MAYOR DETECTADA!</div>
                            <p class="alert-message">
                                Su proyecto enfrenta una situación crítica que requiere respuesta inmediata. 
                                Sus decisiones aquí determinarán el futuro del proyecto.
                            </p>
                        </div>
                    </div>

                    <!-- Crisis Principal -->
                    <div class="card crisis" style="margin-bottom: 2rem;">
                        <div class="card-header">
                            <h2 class="card-title">${mainCrisis.title}</h2>
                        </div>
                        <div class="card-body">
                            <p>${mainCrisis.description}</p>
                        </div>
                    </div>

                    <!-- Opciones de respuesta -->
                    <form id="crisis-form">
                        <div class="section">
                            <div class="section-header">
                                <h2 class="section-title">Seleccione su Estrategia de Respuesta</h2>
                            </div>

                            <div class="radio-group" id="crisis-options">
                                ${mainCrisis.options.map(option => `
                                    <div class="radio-item">
                                        <input type="radio" id="crisis-opt-${option.id}" 
                                            name="crisis-response" value="${option.id}" required>
                                        <label class="radio-label" for="crisis-opt-${option.id}">
                                            <strong>${option.title}</strong><br>
                                            <small>${option.description}</small>
                                        </label>
                                    </div>
                                `).join('')}
                            </div>
                        </div>

                        <!-- Justificación -->
                        <div class="section">
                            <div class="section-header">
                                <h2 class="section-title">Justifique su Estrategia</h2>
                                <p class="section-description">Explique por qué esta es la mejor estrategia para manejar la crisis</p>
                            </div>

                            <div class="form-group">
                                <label for="crisis-justification">Justificación</label>
                                <textarea id="crisis-justification" name="justification" 
                                    placeholder="Explique su estrategia de manejo de crisis..." required></textarea>
                            </div>
                        </div>

                        <!-- Botones -->
                        <div style="display: flex; gap: 1rem; margin-top: 2rem;">
                            <button type="submit" class="btn btn-error btn-lg">Ejecutar Estrategia</button>
                            <button type="button" class="btn btn-secondary btn-lg" onclick="goBackPhase2()">Atrás</button>
                        </div>
                    </form>

                    <div id="crisis-result"></div>
                </div>
            </div>
        </div>
    `;

    // Manejo del formulario
    const form = document.getElementById('crisis-form');
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        resolveCrisis(mainCrisis);
    });

    // Iniciar motor de eventos (eventos menores durante crisis)
    eventsEngine.setEventCallback(showEventModal);
    eventsEngine.start('crisis');

    gameState.save();
}

function resolveCrisis(mainCrisis) {
    const selectedOptionId = document.querySelector('input[name="crisis-response"]:checked').value;
    const justification = document.getElementById('crisis-justification').value;
    const selectedOption = mainCrisis.options.find(opt => opt.id === selectedOptionId);

    // Validar justificación
    if (!justification || justification.trim().length < 30) {
        alert('La justificación debe tener al menos 30 caracteres');
        return;
    }

    // Registrar decisión
    gameState.addCrisisDecision({
        crisisId: mainCrisis.id,
        selectedOption: selectedOptionId,
        justification,
        selectedOptionTitle: selectedOption.title
    });

    // Calcular puntaje basado en coherencia y estado anterior
    let score = 100;

    // Si el indicador de impacto es muy alto, la crisis es más difícil de manejar
    if (gameState.indicators.impact > 60) {
        score -= 30;
    }

    // Si la aprobación comunitaria es baja, más difícil
    if (gameState.indicators.community < 30) {
        score -= 20;
    }

    // Si hay buenos recursos, es más fácil resolver
    if (gameState.indicators.budget > 50) {
        score += 10;
    }

    gameState.setPhaseScore('crisis', Math.max(40, score));

    // Mostrar resultado
    const resultDiv = document.getElementById('crisis-result');
    resultDiv.innerHTML = `
        <div class="alert alert-success" style="margin-top: 2rem;">
            <div class="alert-icon">✅</div>
            <div class="alert-content">
                <div class="alert-title">Crisis Manejada</div>
                <p class="alert-message">
                    Su estrategia de "${selectedOption.title}" ha sido registrada.
                    El proyecto procede a evaluación final.
                </p>
                <p class="alert-message"><strong>Puntaje Fase Crisis: ${gameState.phaseScores.crisis}/100</strong></p>
            </div>
        </div>
    `;

    gameState.save();

    // Ir a pantalla de resultados
    setTimeout(() => {
        eventsEngine.stop();
        renderReportScreen();
    }, 2000);
}

function goBackPhase2() {
    eventsEngine.stop();
    renderPhase2Screen();
}

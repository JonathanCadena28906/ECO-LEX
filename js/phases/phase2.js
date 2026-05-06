// FASE 2 - GESTIÓN AMBIENTAL
function renderPhase2Screen() {
    const app = document.getElementById('app');

    gameState.currentPhase = 'environmental';
    eventsEngine.changePhase('environmental');

    const projectName = gameState.project.name;
    const decisions = getDecisionsForPhase2();

    app.innerHTML = `
        <div class="screen">
            <div class="header environmental">
                <div class="header-content">
                    <div class="header-title">
                        <h1>Fase 2: Gestión Ambiental</h1>
                        <p>Proyecto: ${projectName}</p>
                    </div>
                    <div class="header-info">
                        <div class="header-info-item">
                            <span class="phase-badge environmental">AMBIENTAL</span>
                        </div>
                    </div>
                </div>
            </div>

            <div class="main-content">
                <div class="container">
                    <div class="alert alert-info">
                        <div class="alert-icon">ℹ️</div>
                        <div class="alert-content">
                            <div class="alert-title">Objetivo de Fase 2</div>
                            <p class="alert-message">
                                No hay respuestas únicas correctas. Tome decisiones estratégicas equilibrando 
                                sostenibilidad ambiental, viabilidad financiera y aceptación comunitaria.
                                <br><strong>💡 Monitoree los indicadores en tiempo real mientras elige.</strong>
                            </p>
                        </div>
                    </div>

                    <!-- Indicadores en tiempo real - MEJORADO -->
                    <div class="section" style="margin-bottom: 3rem;">
                        <div class="section-header">
                            <h2 class="section-title">📊 Estado Actual del Proyecto (Actualiza en Tiempo Real)</h2>
                        </div>
                        <div id="indicators-container" class="indicators-grid">
                            ${Object.entries(ENVIRONMENTAL_DECISIONS.indicators).map(([key, indicator]) => {
                                const value = gameState.indicators[key];
                                const isCritical = value <= indicator.critical;
                                const isWarning = value <= indicator.warning;
                                const barClass = isCritical ? 'danger' : isWarning ? 'warning' : 'success';
                                return `
                                    <div class="indicator-card" data-indicator="${key}">
                                        <div class="indicator-icon">${indicator.name.substring(0, 1)}</div>
                                        <div class="indicator-content">
                                            <div class="indicator-label">${indicator.name}</div>
                                            <div class="progress-bar ${barClass}">
                                                <div class="progress-fill" style="width: ${value}%"></div>
                                            </div>
                                            <div class="indicator-value">${Math.round(value)}%</div>
                                            <small style="color: #666; display: block; margin-top: 0.25rem;">${indicator.description}</small>
                                        </div>
                                    </div>
                                `;
                            }).join('')}
                        </div>
                    </div>

                    <!-- Decisiones en TARJETAS INDIVIDUALES -->
                    <form id="decisions-form">
                        <div class="section">
                            <div class="section-header">
                                <h2 class="section-title">🎯 Decisiones Ambientales (${decisions.length} preguntas aleatorias)</h2>
                                <p class="section-description">Selecciona una opción en cada pregunta. Los indicadores arriba se actualizan en tiempo real.</p>
                            </div>
                        </div>
                        
                        ${decisions.map((decision, index) => `
                            <div class="decision-card" style="margin-bottom: 2rem;">
                                <div class="card-header environmental">
                                    <div class="decision-number">${index + 1} de ${decisions.length}</div>
                                    <h3 class="card-title">${decision.title}</h3>
                                    <p class="card-subtitle">${decision.description}</p>
                                </div>
                                <div class="card-body">
                                    <div class="options-grid">
                                        ${decision.options.map((option, optIndex) => `
                                            <div class="option-card" data-decision="${decision.id}" data-option="${option.id}">
                                                <input type="radio" id="opt-${decision.id}-${option.id}" 
                                                    name="decision-${decision.id}" value="${option.id}" required>
                                                <label class="option-label" for="opt-${decision.id}-${option.id}">
                                                    <div class="option-header">
                                                        <strong class="option-title">${option.title}</strong>
                                                        <span class="option-number">Opción ${optIndex + 1}</span>
                                                    </div>
                                                    <p class="option-description">${option.description}</p>
                                                    <div class="option-impact">
                                                        <strong>Impacto:</strong><br>
                                                        ${Object.entries(option.impact)
                                                            .filter(([k, v]) => v !== 0)
                                                            .map(([k, v]) => {
                                                                const indicator = ENVIRONMENTAL_DECISIONS.indicators[k];
                                                                const sign = v > 0 ? '➕ ' : '➖ ';
                                                                const absValue = Math.abs(v);
                                                                return `<span class="impact-tag impact-${v > 0 ? 'positive' : 'negative'}">${sign}${absValue} ${indicator?.name?.split(' ')[0] || k}</span>`;
                                                            }).join('')}
                                                    </div>
                                                </label>
                                            </div>
                                        `).join('')}
                                    </div>
                                </div>
                            </div>
                        `).join('')}

                        <!-- Botones -->
                        <div style="display: flex; gap: 1rem; margin-top: 3rem; margin-bottom: 2rem;">
                            <button type="submit" class="btn btn-success btn-lg">✅ Completar Fase Ambiental</button>
                            <button type="button" class="btn btn-secondary btn-lg" onclick="goBackPhase1()">← Atrás</button>
                        </div>
                    </form>

                    <div id="approval-result"></div>
                </div>
            </div>
        </div>
    `;

    // Manejo del formulario
    const form = document.getElementById('decisions-form');
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        completePhase2();
    });

    // Monitorear cambios y actualizar indicadores en tiempo real
    document.querySelectorAll('input[type="radio"]').forEach(radio => {
        radio.addEventListener('change', (e) => {
            updateIndicatorsPreview();
            // Animación visual de cambio
            const card = e.target.closest('.option-card');
            if (card) {
                card.classList.add('selected');
            }
        });
    });

    // Iniciar motor de eventos
    eventsEngine.setEventCallback(showEventModal);
    eventsEngine.start('environmental');

    gameState.save();
}

function updateIndicatorsPreview() {
    // Actualizar vista previa de indicadores basado en selecciones actuales
    const decisions = getDecisionsForPhase2();
    let previewState = { ...gameState.indicators };

    decisions.forEach(decision => {
        const selected = document.querySelector(`input[name="decision-${decision.id}"]:checked`);
        if (selected) {
            const option = decision.options.find(opt => opt.id === selected.value);
            if (option) {
                previewState = applyDecisionImpact(previewState, option);
            }
        }
    });

    // Actualizar tarjetas de indicadores con animación
    Object.entries(previewState).forEach(([key, value]) => {
        const indicator = ENVIRONMENTAL_DECISIONS.indicators[key];
        if (indicator) {
            const card = document.querySelector(`[data-indicator="${key}"]`);
            if (card) {
                const fill = card.querySelector('.progress-fill');
                const valueDisplay = card.querySelector('.indicator-value');
                const barClass = value <= indicator.critical ? 'danger' : 
                               value <= indicator.warning ? 'warning' : 'success';
                
                // Actualizar barra de progreso con animación
                fill.style.transition = 'width 0.4s ease, background-color 0.4s ease';
                fill.style.width = value + '%';
                
                // Actualizar clase
                card.querySelector('.progress-bar').className = `progress-bar ${barClass}`;
                
                // Actualizar valor numérico
                valueDisplay.textContent = Math.round(value) + '%';
                
                // Añadir animación visual
                card.style.transform = 'scale(1.02)';
                setTimeout(() => {
                    card.style.transform = 'scale(1)';
                }, 200);
            }
        }
    });
}

function completePhase2() {
    const decisions = getDecisionsForPhase2();
    let currentState = { ...gameState.indicators };

    // Aplicar todas las decisiones
    decisions.forEach(decision => {
        const selected = document.querySelector(`input[name="decision-${decision.id}"]:checked`);
        if (selected) {
            const option = decision.options.find(opt => opt.id === selected.value);
            if (option) {
                currentState = applyDecisionImpact(currentState, option);
                gameState.addEnvironmentalDecision(decision.id, option.id);
            }
        }
    });

    // Actualizar estado del juego
    gameState.indicators = currentState;

    // Evaluar aprobación ambiental
    const evaluation = evaluateEnvironmentalApproval(currentState);

    // Calcular puntaje
    let score = 100;
    if (evaluation.verdict === 'rejected') score = 40;
    else if (evaluation.verdict === 'conditional') score = 70;
    gameState.setPhaseScore('environmental', score);

    // Mostrar resultado
    const resultDiv = document.getElementById('approval-result');
    const resultClass = evaluation.verdict === 'rejected' ? 'error' : 
                       evaluation.verdict === 'conditional' ? 'warning' : 'success';

    resultDiv.innerHTML = `
        <div class="alert alert-${resultClass}" style="margin-top: 2rem;">
            <div class="alert-icon">${evaluation.verdict === 'rejected' ? '❌' : evaluation.verdict === 'conditional' ? '⚠️' : '✅'}</div>
            <div class="alert-content">
                <div class="alert-title">Resultado de Evaluación Ambiental</div>
                <p class="alert-message">${evaluation.message}</p>
                <p class="alert-message"><strong>Puntaje Fase Ambiental: ${score}/100</strong></p>
            </div>
        </div>
    `;

    gameState.save();

    if (evaluation.verdict === 'rejected') {
        // No puede continuar, debe revisar decisiones
        setTimeout(() => {
            alert('Fase Ambiental Rechazada. Debe revisar sus decisiones.');
        }, 1000);
    } else {
        // Puede continuar a Fase 3
        setTimeout(() => {
            eventsEngine.stop();
            renderPhase3Screen();
        }, 2000);
    }
}

function goBackPhase1() {
    eventsEngine.stop();
    renderPhase1Screen();
}

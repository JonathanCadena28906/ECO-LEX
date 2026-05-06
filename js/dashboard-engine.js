// ============================================
// MOTOR DEL DASHBOARD - ECO-LEX 2.0
// ============================================

// Inicializar HUD
function initializeHUD() {
    // Verificar que gameState esté disponible
    if (typeof gameState === 'undefined') {
        console.error('gameState no está disponible en initializeHUD');
        return;
    }
    
    // Actualizar HUD inicial
    if (gameState.updateHUD) {
        gameState.updateHUD();
    }
    
    // Timer que decrementa cada 60 segundos (1 día simulado)
    setInterval(() => {
        if (gameState && gameState.elapsedSeconds !== undefined) {
            gameState.elapsedSeconds++;
            if (gameState.elapsedSeconds % 60 === 0 && gameState.decrementDays) {
                gameState.decrementDays();
            }
        }
    }, 1000);
}

const IMPACT_LABELS = {
    water: 'Agua',
    land: 'Suelo',
    budget: 'Presupuesto',
    impact: 'Impacto',
    community: 'Comunidad'
};

let pendingLegalValidation = null;

function formatImpactPreview(impacts = {}) {
    const entries = Object.entries(impacts);

    if (entries.length === 0) {
        return '<span class="impact-empty">Sin impacto directo</span>';
    }

    return entries
        .map(([key, val]) => `${IMPACT_LABELS[key] || key}: ${val > 0 ? '+' : ''}${val}`)
        .join(' · ');
}

// Renderizar tarjeta de decisión interactiva
function renderDecisionCard(decision, onSelect) {
    const card = document.createElement('div');
    card.className = 'decision-card slide-in-left';
    
    let optionsHTML = '';
    decision.options.forEach((option, idx) => {
        const letter = String.fromCharCode(65 + idx); // A, B, C...
        const impactText = formatImpactPreview(option.impact);
        
        optionsHTML += `
            <div class="option" data-option-id="${option.id}" data-letter="${letter}">
                <span class="option-letter">${letter}</span>
                <div class="option-content">
                    <div class="option-title">${option.title}</div>
                    <div class="option-description">${option.description}</div>
                </div>
                <div class="impact-preview"><strong>Variables de impacto:</strong> ${impactText}</div>
            </div>
        `;
    });
    
    card.innerHTML = `
        <div class="card-header">⚡ ${decision.title}</div>
        <div class="card-description">${decision.description}</div>
        <div class="card-options">
            ${optionsHTML}
        </div>
    `;
    
    // Agregar listeners a las opciones
    card.querySelectorAll('.option').forEach(optionElement => {
        optionElement.addEventListener('click', (e) => {
            const selectedOption = decision.options.find(
                o => o.id === optionElement.dataset.optionId
            );
            onSelect(decision.id, selectedOption);
            card.classList.add('slide-out-right');
            setTimeout(() => card.remove(), 400);
        });
        
        // Hover para previsualizar impacto
        optionElement.addEventListener('mouseenter', () => {
            card.style.borderColor = '#00ff00';
            card.style.boxShadow = '0 0 20px rgba(0, 255, 0, 0.3)';
        });
    });
    
    return card;
}

// Mostrar indicadores en tiempo real mientras el usuario decide
function showImpactPreview(impacts) {
    const previewBox = document.createElement('div');
    previewBox.className = 'impact-preview-box';
    previewBox.innerHTML = `
        <h4>Impacto previsto:</h4>
        <p>${formatImpactPreview(impacts)}</p>
    `;
    return previewBox;
}

// Crear tarjetas para Fase 2 (Ambiental) aleatorias
function generateRandomEnvironmentalPhase(projectDifficulty) {
    let decisions = [...ENVIRONMENTAL_DECISIONS.decisions];
    
    // Barajar array
    decisions.sort(() => Math.random() - 0.5);
    
    // Seleccionar cantidad según dificultad
    const count = projectDifficulty === 'critical' ? 5 : projectDifficulty === 'high' ? 7 : 6;
    return decisions.slice(0, count);
}

// Generar memorial automáticamente basado en el proyecto
function generateMemorial(project) {
    if (!project) return '';
    
    const projectName = project.name;
    const description = project.description;
    const challenge = project.challenge;
    const risks = project.risks ? project.risks.join(', ') : '';
    
    const memorial = `
<strong>MEMORIAL DE SOLICITUD LEGAL</strong>
<br><br>
<strong>Proyecto:</strong> ${projectName}
<br><br>
<strong>Descripción:</strong> ${description}
<br><br>
<strong>Desafío Principal:</strong> ${challenge}
<br><br>
<strong>Riesgos Identificados:</strong> ${risks}
<br><br>
<strong>Objetivo:</strong> Obtener la licencia ambiental y todos los permisos necesarios para ejecutar este proyecto de manera legal y sostenible.
    `.trim();
    
    return memorial;
}

// Fase 1: Drag & Drop de Documentos Legales
function renderPhase1DragDrop() {
    const app = document.getElementById('app');
    gameState.screen = 'phase1';
    gameState.currentPhase = 'legal';
    
    const documents = LEGAL_DATA.documents;
    const requiredDocs = LEGAL_DATA.requirements[gameState.project.id] || [];
    
    let documentHTML = '';
    documents.forEach(doc => {
        const categoryEmoji = doc.category === 'essential' ? '✅' : 
                             doc.category === 'conditional' ? '⚠️' : '❌';
        
        documentHTML += `
            <div class="document-card" draggable="true" data-doc-id="${doc.id}">
                <div class="document-card-icon">${doc.icon}</div>
                <div class="document-card-name">${doc.name}</div>
                <div class="document-card-info">
                    <span class="info-badge">ⓘ</span>
                    <div class="info-tooltip">
                        <strong>${categoryEmoji} ${doc.name}</strong>
                        <div style="font-size: 0.75rem; margin-top: 0.3rem; line-height: 1.2;">
                            ${doc.usage}
                        </div>
                    </div>
                </div>
            </div>
        `;
    });
    
    const filingZoneHTML = `
        <div class="filing-zone" id="filing-zone">
            <div class="filing-zone-label">📋 EXPEDIENTE DE RADICACIÓN</div>
            <div class="filed-documents" id="filed-documents"></div>
        </div>
    `;
    
    app.innerHTML = `
        <div class="screen legal-phase">
            <h1>⚖️ FASE 1: GESTIÓN LEGAL</h1>
            <p>Arrastra los documentos legales correctos hacia el expediente</p>
            
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 2rem; margin-top: 2rem; align-items: start;">
                <!-- Columna izquierda: Documentos -->
                <div>
                    <h3 style="margin-bottom: 1rem; color: #00ff00;">📦 Documentos Disponibles</h3>
                    <div class="document-library" style="grid-template-columns: repeat(3, 1fr); gap: 1rem;">
                        ${documentHTML}
                    </div>
                </div>
                
                <!-- Columna derecha: Expediente y Memorial -->
                <div style="display: flex; flex-direction: column; gap: 1.5rem;">
                    <div style="padding: 1.5rem; background: rgba(0,100,200,0.1); border-radius: 8px; border-left: 4px solid #0066cc;">
                        <h3 style="margin-bottom: 1rem;">📝 Memorial de Solicitud</h3>
                        <div id="legal-memorial" style="background: rgba(0,50,100,0.3); padding: 1rem; border-radius: 4px; font-size: 0.9rem; line-height: 1.6; max-height: 150px; overflow-y: auto; color: #00ff00;"></div>
                    </div>
                    
                    ${filingZoneHTML}
                </div>
            </div>
            
            <div style="margin-top: 2rem; text-align: center;">
                <button class="btn btn-success" onclick="validateLegalPhase()">✓ Validar Documentación</button>
            </div>
        </div>
    `;
    
    // Generar el memorial automáticamente
    const memorialDiv = document.getElementById('legal-memorial');
    if (memorialDiv) {
        memorialDiv.innerHTML = generateMemorial(gameState.project);
    }
    
    // Implementar drag & drop
    setupDragAndDrop();
    gameState.save();
}

// Configurar Drag & Drop
function setupDragAndDrop() {
    let draggedElement = null;
    
    const documents = document.querySelectorAll('.document-card');
    const filingZone = document.getElementById('filing-zone');
    
    documents.forEach(doc => {
        doc.addEventListener('dragstart', (e) => {
            draggedElement = doc;
            doc.style.opacity = '0.5';
        });
        
        doc.addEventListener('dragend', (e) => {
            doc.style.opacity = '1';
        });
    });
    
    filingZone.addEventListener('dragover', (e) => {
        e.preventDefault();
        filingZone.classList.add('hover');
    });
    
    filingZone.addEventListener('dragleave', () => {
        filingZone.classList.remove('hover');
    });
    
    filingZone.addEventListener('drop', (e) => {
        e.preventDefault();
        filingZone.classList.remove('hover');
        
        if (draggedElement) {
            const docId = draggedElement.dataset.docId;
            const docName = draggedElement.querySelector('.document-card-name').textContent;
            
            // Verificar si ya está filedocument
            if (!document.querySelector(`[data-filed-id="${docId}"]`)) {
                const filedDoc = document.createElement('div');
                filedDoc.className = 'filed-document';
                filedDoc.dataset.filedId = docId;
                filedDoc.innerHTML = `
                    ${docName}
                    <span class="filed-document-remove" onclick="removeFiledDocument('${docId}')">✕</span>
                `;
                
                document.getElementById('filed-documents').appendChild(filedDoc);
                
                // Efecto visual
                draggedElement.classList.add('glow');
            }
        }
    });
}

// Remover documento filed
function removeFiledDocument(docId) {
    const filed = document.querySelector(`[data-filed-id="${docId}"]`);
    if (filed) filed.remove();
}

function computeLegalValidationResult(filedDocs, requiredDocs) {
    const filedSet = new Set(filedDocs);
    const requiredSet = new Set(requiredDocs);

    const correctDocs = requiredDocs.filter(docId => filedSet.has(docId));
    const missingDocs = requiredDocs.filter(docId => !filedSet.has(docId));
    const incorrectDocs = filedDocs.filter(docId => !requiredSet.has(docId));

    const missingPenalty = missingDocs.length * 25;
    const incorrectPenalty = incorrectDocs.length * 12;
    const rawScore = 100 - missingPenalty - incorrectPenalty;
    const finalScore = Math.max(0, Math.min(100, rawScore));

    return {
        correctDocs,
        missingDocs,
        incorrectDocs,
        score: finalScore,
        isPerfect: missingDocs.length === 0 && incorrectDocs.length === 0
    };
}

function getDocumentNameById(docId) {
    const doc = LEGAL_DATA.documents.find(d => d.id === docId);
    return doc ? doc.name : docId;
}

function closeLegalWarningModal() {
    const existingModal = document.getElementById('legal-warning-modal');
    if (existingModal) existingModal.remove();
}

function showLegalWarningModal(validation) {
    closeLegalWarningModal();

    const modal = document.createElement('div');
    modal.id = 'legal-warning-modal';
    modal.className = 'legal-warning-overlay';
    modal.innerHTML = `
        <div class="legal-warning-modal">
            <h3>⚠️ Advertencia de Documentación Incompleta</h3>
            <p>Tu expediente no cumple completamente con los requisitos del proyecto.</p>
            <div class="legal-warning-summary">
                <div>✅ Correctos: <strong>${validation.correctDocs.length}</strong></div>
                <div>❌ Faltantes: <strong>${validation.missingDocs.length}</strong> (descuento mayor)</div>
                <div>🚫 Incorrectos: <strong>${validation.incorrectDocs.length}</strong></div>
                <div class="legal-warning-score">Puntaje legal estimado: <strong>${validation.score}/100</strong></div>
            </div>
            <div class="legal-warning-actions">
                <button class="btn btn-primary" onclick="closeLegalWarningModal()">↩️ Volver a escoger</button>
                <button class="btn btn-warning" onclick="continueLegalPhaseWithWarning()">✅ Aceptar y continuar</button>
            </div>
        </div>
    `;

    document.body.appendChild(modal);
}

function continueLegalPhaseWithWarning() {
    if (!pendingLegalValidation) return;

    gameState.legalValidationAttempts++;
    gameState.setPhaseScore('legal', pendingLegalValidation.score);
    closeLegalWarningModal();
    gameState.save();
    showLegalStageSummaryModal(pendingLegalValidation);
}

function showLegalStageSummaryModal(validation) {
    const correctNames = validation.correctDocs.map(getDocumentNameById);
    const missingNames = validation.missingDocs.map(getDocumentNameById);
    const incorrectNames = validation.incorrectDocs.map(getDocumentNameById);
    const isPerfect = validation.isPerfect;

    const introText = isPerfect
        ? 'Completaste correctamente la documentación requerida. Este es el resumen de tu gestión legal:'
        : 'Decidiste continuar con la documentación actual. Este es el balance de tu gestión legal:';

    const recommendationText = isPerfect
        ? 'Excelente ejecución legal. Mantén este nivel de rigor documental en las siguientes fases para sostener la viabilidad integral del proyecto.'
        : 'Fortalece la revisión de requisitos por tipo de proyecto antes de radicar. Verificar faltantes y filtrar documentos no aplicables mejora el cumplimiento y evita sanciones.';

    const modal = document.createElement('div');
    modal.id = 'legal-summary-modal';
    modal.className = 'legal-warning-overlay';
    modal.innerHTML = `
        <div class="legal-warning-modal legal-summary-modal">
            <h3>📌 Cierre de Etapa Legal</h3>
            <p>${introText}</p>
            <div class="legal-warning-summary">
                <div>Puntaje de la etapa legal: <strong>${validation.score}/100</strong></div>
                <div>✅ Aciertos: <strong>${validation.correctDocs.length}</strong></div>
                <div>🚫 Incorrectos: <strong>${validation.incorrectDocs.length}</strong></div>
                <div>❌ Faltantes: <strong>${validation.missingDocs.length}</strong></div>
            </div>

            <div class="legal-warning-list">
                <strong>Lo que hiciste bien:</strong>
                <ul>${correctNames.length ? correctNames.map(name => `<li>${name}</li>`).join('') : '<li>No anexaste documentos correctos.</li>'}</ul>
            </div>

            <div class="legal-warning-list">
                <strong>Lo que hiciste mal:</strong>
                <ul>${incorrectNames.length ? incorrectNames.map(name => `<li>${name}</li>`).join('') : '<li>No anexaste documentos incorrectos.</li>'}</ul>
            </div>

            <div class="legal-warning-list">
                <strong>Lo que faltó:</strong>
                <ul>${missingNames.length ? missingNames.map(name => `<li>${name}</li>`).join('') : '<li>No quedaron documentos faltantes.</li>'}</ul>
            </div>

            <div class="legal-reflection-box">
                <strong>Reflexión:</strong>
                <p>
                    La gestión legal no es un trámite secundario: es la base que legitima el proyecto,
                    protege a las comunidades y reduce riesgos de sanciones, parálisis operativa y pérdida
                    de confianza institucional. Un proyecto técnicamente sólido puede fracasar si su soporte
                    legal es incompleto.
                </p>
            </div>

            <div class="legal-reflection-box">
                <strong>Recomendación:</strong>
                <p>${recommendationText}</p>
            </div>

            <div class="legal-warning-actions">
                <button class="btn btn-success" onclick="proceedToPhase2FromLegalSummary()">➡️ Continuar a Fase Ambiental</button>
            </div>
        </div>
    `;

    document.body.appendChild(modal);
}

function proceedToPhase2FromLegalSummary() {
    const summaryModal = document.getElementById('legal-summary-modal');
    if (summaryModal) summaryModal.remove();
    pendingLegalValidation = null;
    setTimeout(() => renderPhase2EnvironmentalCards(), 300);
}

// Validar Fase Legal
function validateLegalPhase() {
    const filedDocs = Array.from(document.querySelectorAll('[data-filed-id]'))
        .map(el => el.dataset.filedId);
    
    const requiredDocs = LEGAL_DATA.requirements[gameState.project.id] || [];
    
    const validation = computeLegalValidationResult(filedDocs, requiredDocs);
    pendingLegalValidation = validation;

    if (validation.isPerfect) {
        gameState.setPhaseScore('legal', 100);
        gameState.save();
        showLegalStageSummaryModal(validation);
        return;
    }

    showLegalWarningModal(validation);
    
    gameState.save();
}

// Fase 2: Decisiones Ambientales Aleatorias con Tarjetas
function renderPhase2EnvironmentalCards() {
    const app = document.getElementById('app');
    gameState.screen = 'phase2';
    gameState.currentPhase = 'environmental';
    
    // Generar decisiones aleatorias
    const decisions = generateRandomEnvironmentalPhase(gameState.project.difficulty);
    let currentDecisionIndex = 0;
    
    function showNextDecision() {
        if (currentDecisionIndex >= decisions.length) {
            // Fase completada
            gameState.setPhaseScore('environmental', calculateEnvironmentalScore());
            setTimeout(() => renderPhase3Crisis(), 500);
            return;
        }
        
        const decision = decisions[currentDecisionIndex];
        
        app.innerHTML = `
            <div class="screen" style="padding: 2rem;">
                <div style="text-align: center; margin-bottom: 2rem;">
                    <h1>🌱 FASE 2: GESTIÓN AMBIENTAL</h1>
                    <p>Decisión ${currentDecisionIndex + 1} de ${decisions.length}</p>
                </div>
                <div id="decision-container"></div>
            </div>
        `;
        
        const card = renderDecisionCard(decision, (decisionId, selectedOption) => {
            // Guardar decisión
            gameState.addEnvironmentalDecision(decisionId, selectedOption);
            
            // Actualizar indicadores
            gameState.updateIndicators(selectedOption.impact);
            
            // Siguiente
            currentDecisionIndex++;
            showNextDecision();
        });
        
        document.getElementById('decision-container').appendChild(card);
    }
    
    showNextDecision();
    gameState.save();
}

// Calcular score ambiental
function calculateEnvironmentalScore() {
    let score = 100;
    
    // Penalización por indicadores altos
    if (gameState.indicators.impact > 70) score -= 30;
    else if (gameState.indicators.impact > 50) score -= 15;
    
    if (gameState.indicators.community < 30) score -= 20;
    else if (gameState.indicators.community < 50) score -= 10;
    
    if (gameState.indicators.water < 20) score -= 25;
    else if (gameState.indicators.water < 40) score -= 15;
    
    return Math.max(0, score);
}

// Fase 3: Crisis (mantener similar pero mejorado)
function renderPhase3Crisis() {
    const app = document.getElementById('app');
    gameState.screen = 'phase3';
    gameState.currentPhase = 'crisis';
    
    const crisisEvent = EVENT_LIBRARY.crises[Math.floor(Math.random() * EVENT_LIBRARY.crises.length)];
    
    // Guardar la crisis actual en el estado global para acceder después
    window.currentCrisis = crisisEvent;
    
    app.innerHTML = `
        <div class="screen" style="padding: 2rem; max-width: 800px; margin: 0 auto;">
            <h1>🚨 FASE 3: GESTIÓN DE CRISIS</h1>
            
            <div style="background: rgba(255,50,50,0.1); border: 2px solid #ff3333; padding: 2rem; border-radius: 12px; margin: 2rem 0;">
                <h2 style="color: #ff6666;">${crisisEvent.title}</h2>
                <p style="margin: 1rem 0; font-size: 1.1rem;">${crisisEvent.description}</p>
            </div>
            
            <div id="crisis-options" style="margin: 2rem 0;">
                ${crisisEvent.options.map((opt, idx) => `
                    <div class="option" style="margin-bottom: 1rem; cursor: pointer;" onclick="selectCrisisOption('${opt.id}')">
                        <span class="option-letter">${String.fromCharCode(65 + idx)}</span>
                        <div class="option-content">
                            <div class="option-title">${opt.title}</div>
                            <div class="option-description">${opt.description}</div>
                        </div>
                        <div class="impact-preview"><strong>Variables de impacto:</strong> ${formatImpactPreview(opt.impact)}</div>
                    </div>
                `).join('')}
            </div>
            
            <div style="margin-top: 2rem;">
                <label><strong>¿Por qué elegiste esta opción?</strong></label>
                <textarea id="crisis-justification" placeholder="Explica tu decisión..." required
                    style="width: 100%; height: 100px; margin-top: 1rem; padding: 1rem; border: 1px solid #666; background: var(--color-bg-light); color: var(--color-text);"></textarea>
            </div>
            
            <div style="margin-top: 2rem;">
                <button class="btn btn-success" onclick="finalizeCrisisPhase()">✓ Completar Crisis</button>
            </div>
        </div>
    `;
    
    gameState.save();
}

// Seleccionar opción de crisis
window.selectedCrisisOption = null;

function selectCrisisOption(optionId) {
    window.selectedCrisisOption = optionId;
    // Marcar visualmente la opción seleccionada
    document.querySelectorAll('#crisis-options .option').forEach(el => {
        el.style.borderColor = '#666';
        el.style.background = 'transparent';
    });
    event.target.closest('.option').style.borderColor = '#00ff00';
    event.target.closest('.option').style.background = 'rgba(0, 255, 0, 0.1)';
}

// Finalizar crisis
function finalizeCrisisPhase() {
    const justification = document.getElementById('crisis-justification').value;
    
    if (!window.selectedCrisisOption || !justification.trim()) {
        alert('Por favor selecciona una opción y completa la justificación');
        return;
    }
    
    // Guardar crisis decision
    const selectedOption = window.currentCrisis.options.find(o => o.id === window.selectedCrisisOption);
    gameState.addCrisisDecision({
        crisisId: window.currentCrisis.id,
        selectedOptionId: selectedOption.id,
        selectedOptionTitle: selectedOption.title,
        selectedOptionImpact: selectedOption.impact || {},
        justification: justification
    });
    
    // Aplicar impactos si existen
    if (selectedOption.impact) {
        gameState.updateIndicators(selectedOption.impact);
    }
    
    // Calcular score de crisis
    gameState.setPhaseScore('crisis', calculateCrisisScore(selectedOption));
    
    // Ir al reporte final
    setTimeout(() => renderFinalReportWithHeadlines(), 500);
}

// Calcular score crisis
function calculateCrisisScore(selectedOption) {
    // Score basado en coherencia y calidad de respuesta
    return 75; // Placeholder - será mejorado con lógica de coherencia
}

// Nueva Pantalla Final: Titulares de Periódico
function renderFinalReportWithHeadlines() {
    const app = document.getElementById('app');
    gameState.screen = 'report';
    
    // Primero, mostrar pantalla de reflexión
    app.innerHTML = `
        <div class="screen" style="padding: 2rem; max-width: 1000px; margin: 0 auto;">
            <h1 style="text-align: center; margin-bottom: 2rem;">📚 Reflexión Final</h1>
            
            <div style="background: rgba(0,170,0,0.1); border: 2px solid #22aa44; padding: 2rem; border-radius: 12px; margin-bottom: 2rem;">
                <h2 style="color: #22aa44; margin-bottom: 1rem;">¿Qué es la Gestión Ambiental?</h2>
                <p style="color: #999; margin-bottom: 1rem; font-size: 0.9rem;">Basándote en tu experiencia jugando ECO-LEX, define qué entiendes por gestión ambiental:</p>
                <textarea id="env-definition" placeholder="Escribe tu definición de Gestión Ambiental..." required
                    style="width: 100%; height: 100px; padding: 1rem; border: 1px solid #22aa44; background: var(--color-bg-light); color: var(--color-text);"></textarea>
            </div>
            
            <div style="background: rgba(0,100,200,0.1); border: 2px solid #0066cc; padding: 2rem; border-radius: 12px; margin-bottom: 2rem;">
                <h2 style="color: #0066cc; margin-bottom: 1rem;">⚖️ ¿Qué es la Gestión Legal?</h2>
                <p style="color: #999; margin-bottom: 1rem; font-size: 0.9rem;">Basándote en tu experiencia jugando ECO-LEX, define qué entiendes por gestión legal:</p>
                <textarea id="legal-definition" placeholder="Escribe tu definición de Gestión Legal..." required
                    style="width: 100%; height: 100px; padding: 1rem; border: 1px solid #0066cc; background: var(--color-bg-light); color: var(--color-text);"></textarea>
            </div>
            
            <div style="text-align: center;">
                <button class="btn btn-success" onclick="completeFinalReport()" style="width: 100%; padding: 1rem; font-size: 1.1rem;">
                    ✓ Ver Resultados Finales
                </button>
            </div>
        </div>
    `;
    
    gameState.save();
}

// Completar reporte
function completeFinalReport() {
    const envDef = document.getElementById('env-definition').value;
    const legalDef = document.getElementById('legal-definition').value;
    
    if (!envDef.trim() || !legalDef.trim()) {
        alert('Por favor completa ambas definiciones');
        return;
    }
    
    // Guardar definiciones
    gameState.setOpenAnswer('environmentalDefinition', envDef);
    gameState.setOpenAnswer('legalDefinition', legalDef);
    gameState.save();
    
    // Mostrar reporte final
    showFinalHeadlines();
}

// Mostrar titular final
function showFinalHeadlines() {
    const app = document.getElementById('app');
    
    const finalScore = gameState.calculateTotalScore();
    let classification = '';
    let headline = '';
    let emoji = '';
    
    if (finalScore >= 90) {
        classification = 'ORO';
        headline = `🏆 PROYECTO EXITOSO: ${gameState.project.name} se convierte en modelo de sostenibilidad`;
        emoji = '🥇';
    } else if (finalScore >= 70) {
        classification = 'VIABLE';
        headline = `✅ PROYECTO APROBADO: ${gameState.project.name} obtiene licencia ambiental`;
        emoji = '✔️';
    } else if (finalScore >= 50) {
        classification = 'OBSERVACIÓN';
        headline = `⚠️ PROYECTO CON OBSERVACIONES: Se solicitan ajustes a ${gameState.project.name}`;
        emoji = '📋';
    } else if (finalScore >= 30) {
        classification = 'SANCIONADO';
        headline = `❌ PROYECTO SANCIONADO: Multas ambientales a ${gameState.project.name}`;
        emoji = '⛔';
    } else {
        classification = 'REVOCADO';
        headline = `🚫 LICENCIA REVOCADA: ${gameState.project.name} clausurado por incumplimiento`;
        emoji = '🚫';
    }
    
    app.innerHTML = `
        <div class="screen" style="padding: 2rem; max-width: 1000px; margin: 0 auto;">
            <h1 style="text-align: center; margin-bottom: 2rem;">📰 TITULAR FINAL</h1>
            
            <div style="background: linear-gradient(135deg, rgba(200,100,0,0.2), rgba(100,50,0,0.2)); 
                        border: 3px solid #d4a574; padding: 2rem; border-radius: 12px; margin-bottom: 2rem;
                        text-align: center;">
                <div style="font-size: 1.5rem; margin-bottom: 1rem;">${emoji}</div>
                <h2 style="color: #d4a574; font-size: 1.8rem; line-height: 1.6;">${headline}</h2>
                <p style="color: #999; margin-top: 1rem; font-size: 0.9rem;">Clasificación: <strong style="color: #d4a574;">${classification}</strong></p>
            </div>
            
            <div style="display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 1.5rem; margin: 2rem 0;">
                <div style="background: rgba(0,100,200,0.1); padding: 1.5rem; border-radius: 8px; border-left: 4px solid #0066cc;">
                    <h3 style="color: #0066cc;">⚖️ Gestión Legal</h3>
                    <p style="font-size: 1.5rem; font-weight: bold; margin-top: 0.5rem;">${gameState.phaseScores.legal}/100</p>
                </div>
                <div style="background: rgba(0,170,0,0.1); padding: 1.5rem; border-radius: 8px; border-left: 4px solid #22aa44;">
                    <h3 style="color: #22aa44;">🌱 Gestión Ambiental</h3>
                    <p style="font-size: 1.5rem; font-weight: bold; margin-top: 0.5rem;">${gameState.phaseScores.environmental}/100</p>
                </div>
                <div style="background: rgba(200,0,0,0.1); padding: 1.5rem; border-radius: 8px; border-left: 4px solid #dd3333;">
                    <h3 style="color: #dd3333;">🚨 Gestión de Crisis</h3>
                    <p style="font-size: 1.5rem; font-weight: bold; margin-top: 0.5rem;">${gameState.phaseScores.crisis}/100</p>
                </div>
            </div>
            
            <div style="margin-top: 2rem; padding: 1.5rem; background: rgba(255,255,255,0.05); border-radius: 8px;">
                <h3>📚 Tus Reflexiones Finales</h3>
                <div style="margin-top: 1rem;">
                    <p style="color: #999; margin-bottom: 0.5rem;"><strong>Gestión Ambiental:</strong></p>
                    <p style="background: var(--color-bg-light); padding: 1rem; border-radius: 6px; color: var(--color-text);">
                        ${gameState.openAnswers.environmentalDefinition}
                    </p>
                </div>
                <div style="margin-top: 1rem;">
                    <p style="color: #999; margin-bottom: 0.5rem;"><strong>Gestión Legal:</strong></p>
                    <p style="background: var(--color-bg-light); padding: 1rem; border-radius: 6px; color: var(--color-text);">
                        ${gameState.openAnswers.legalDefinition}
                    </p>
                </div>
            </div>
            
            <div style="text-align: center; margin-top: 3rem;">
                <button class="btn btn-success" onclick="location.reload()" style="padding: 1rem 2rem; font-size: 1rem;">
                    🔄 Jugar de Nuevo
                </button>
            </div>
        </div>
    `;
    
    gameState.save();
}

// Exportar funciones
window.renderPhase1DragDrop = renderPhase1DragDrop;
window.renderPhase2EnvironmentalCards = renderPhase2EnvironmentalCards;
window.renderPhase3Crisis = renderPhase3Crisis;
window.renderFinalReportWithHeadlines = renderFinalReportWithHeadlines;
window.completeFinalReport = completeFinalReport;
window.selectCrisisOption = selectCrisisOption;
window.finalizeCrisisPhase = finalizeCrisisPhase;
window.removeFiledDocument = removeFiledDocument;
window.validateLegalPhase = validateLegalPhase;
window.closeLegalWarningModal = closeLegalWarningModal;
window.continueLegalPhaseWithWarning = continueLegalPhaseWithWarning;
window.proceedToPhase2FromLegalSummary = proceedToPhase2FromLegalSummary;
window.initializeHUD = initializeHUD;
window.showFinalHeadlines = showFinalHeadlines;

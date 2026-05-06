// ============================================
// MOTOR DEL DASHBOARD - ECO-LEX 2.0
// ============================================

// Inyectar estilos para las consecuencias en tarjetas ambientales
(function injectConsequenceStyles() {
    const style = document.createElement('style');
    style.id = 'eco-lex-consequence-styles';
    style.textContent = `
        /* Estructura interna de cada opción */
        .option {
            display: flex;
            flex-direction: column;
            gap: 0;
            padding: 0 !important;
            overflow: hidden;
        }

        .option-main {
            display: flex;
            align-items: flex-start;
            gap: 1rem;
            padding: 1rem 1.2rem;
        }

        /* Bloque de consecuencias — siempre visible */
        .option-consequences {
            border-top: 1px solid rgba(255,255,255,0.08);
            background: rgba(0,0,0,0.25);
            padding: 0.75rem 1.2rem 0.85rem 1.2rem;
        }

        .consequences-header {
            display: flex;
            align-items: center;
            gap: 0.4rem;
            margin-bottom: 0.55rem;
        }

        .consequences-icon { font-size: 0.85rem; }

        .consequences-title {
            font-size: 0.72rem;
            font-weight: 700;
            text-transform: uppercase;
            letter-spacing: 0.06em;
            color: rgba(255,255,255,0.5);
        }

        .consequences-grid {
            display: flex;
            flex-wrap: wrap;
            gap: 0.4rem 1rem;
        }

        .impact-line {
            display: flex;
            align-items: center;
            gap: 0.3rem;
            font-size: 0.82rem;
            font-weight: 600;
            padding: 0.2rem 0.55rem;
            border-radius: 4px;
        }

        .impact-positive {
            color: #4ade80;
            background: rgba(74,222,128,0.12);
            border: 1px solid rgba(74,222,128,0.25);
        }

        .impact-negative {
            color: #f87171;
            background: rgba(248,113,113,0.12);
            border: 1px solid rgba(248,113,113,0.25);
        }

        .impact-icon  { font-size: 0.78rem; }
        .impact-label { opacity: 0.85; }
        .impact-value { font-weight: 800; margin-left: 0.15rem; }
        .impact-empty { font-size: 0.78rem; color: rgba(255,255,255,0.35); font-style: italic; }

        /* Cuando la opción está seleccionada, destacar consecuencias */
        .option.selected .option-consequences {
            background: rgba(0,0,0,0.35);
            border-top-color: rgba(255,255,255,0.15);
        }

        .option .option-letter { flex-shrink: 0; margin-top: 0.1rem; }
    `;
    if (!document.getElementById('eco-lex-consequence-styles')) {
        document.head.appendChild(style);
    }
})();

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

    // Timer: 1 día simulado = 15 segundos reales  →  60 días = 15 minutos máximo
    setInterval(() => {
        if (gameState && gameState.elapsedSeconds !== undefined) {
            gameState.elapsedSeconds++;
            if (gameState.elapsedSeconds % 15 === 0 && gameState.decrementDays) {
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

const IMPACT_ICONS = {
    water: '💧',
    land: '🌍',
    budget: '💰',
    impact: '🌿',
    community: '🤝'
};

let pendingLegalValidation = null;

// Formatea un delta de impacto en unidades reales (con signo)
function _formatImpactValue(key, val) {
    const sign = val > 0 ? '+' : '';
    switch (key) {
        case 'budget': {
            const av = Math.abs(val);
            const s = val > 0 ? '+' : '-';
            if (av >= 1_000_000_000_000) return `${s}$${(av / 1_000_000_000_000).toFixed(1)} Bill.`;
            if (av >= 1_000_000_000) return `${s}$${(av / 1_000_000_000).toFixed(1)} MM`;
            if (av >= 1_000_000) return `${s}$${(av / 1_000_000).toFixed(1)} M`;
            if (av >= 1_000) return `${s}$${Math.round(av / 1_000)} K`;
            return `${s}$${av.toLocaleString('es-CO')}`;
        }
        case 'water': return `${sign}${val} m³/s`;
        case 'land': return `${sign}${val} Ha`;
        case 'impact': return `${sign}${val} tCO₂e`;
        case 'community': return `${sign}${val}%`;
        default: return `${sign}${val}`;
    }
}

function formatImpactPreview(impacts = {}) {
    const entries = Object.entries(impacts);
    if (entries.length === 0) {
        return '<span class="impact-empty">Sin impacto directo</span>';
    }
    return entries
        .map(([key, val]) => `${IMPACT_LABELS[key] || key}: ${_formatImpactValue(key, val)}`)
        .join(' · ');
}

// Determina si un impacto es positivo o negativo según el indicador
function isPositiveImpact(key, val) {
    if (key === 'impact') return val <= 0; // menos daño = bueno
    return val >= 0;
}

function formatImpactDetails(impacts = {}) {
    const keys = ['budget', 'water', 'land', 'community', 'impact'];
    const parts = [];

    keys.forEach(k => {
        if (impacts.hasOwnProperty(k)) {
            const val = impacts[k];
            const label = IMPACT_LABELS[k] || k;
            const icon = IMPACT_ICONS[k] || '';
            const positive = isPositiveImpact(k, val);
            const colorClass = positive ? 'impact-positive' : 'impact-negative';
            const formatted = _formatImpactValue(k, val);
            parts.push(`
                <div class="impact-line ${colorClass}">
                    <span class="impact-icon">${icon}</span>
                    <span class="impact-label">${label}</span>
                    <span class="impact-value">${formatted}</span>
                </div>`);
        }
    });

    if (parts.length === 0) return '<div class="impact-empty">Sin impacto en indicadores</div>';
    return parts.join('');
}

// Renderizar tarjeta de decisión interactiva
function renderDecisionCard(decision, onSelect) {
    const card = document.createElement('div');
    card.className = 'decision-card slide-in-left';

    let optionsHTML = '';
    decision.options.forEach((option, idx) => {
        const letter = String.fromCharCode(65 + idx); // A, B, C...
        const impactDetails = formatImpactDetails(option.impact || {});
        const hasImpacts = option.impact && Object.keys(option.impact).length > 0;

        optionsHTML += `
            <div class="option" data-option-id="${option.id}" data-letter="${letter}">
                <div class="option-main">
                    <span class="option-letter">${letter}</span>
                    <div class="option-content">
                        <div class="option-title">${option.title}</div>
                        <div class="option-description">${option.description}</div>
                    </div>
                </div>
                <div class="option-consequences">
                    <div class="consequences-header">
                        <span class="consequences-icon">📊</span>
                        <span class="consequences-title">Consecuencias sobre los indicadores</span>
                    </div>
                    <div class="consequences-grid">
                        ${impactDetails}
                    </div>
                </div>
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

            // Marcar opción seleccionada visualmente y deshabilitar otras
            card.querySelectorAll('.option').forEach(opt => {
                opt.classList.add('disabled');
                opt.style.pointerEvents = 'none';
                opt.style.opacity = '0.6';
            });

            optionElement.classList.remove('disabled');
            optionElement.classList.add('selected');
            optionElement.style.pointerEvents = 'auto';
            optionElement.style.opacity = '1';

            // Añadir badge de selección
            const badge = document.createElement('div');
            badge.className = 'option-selected-badge';
            badge.textContent = '✔ Seleccionada';
            optionElement.appendChild(badge);

            // ✅ VALIDAR RECURSOS ANTES DE APLICAR LA DECISIÓN
            if (typeof validator !== 'undefined' && validator) {
                const validation = validator.validateDecision(selectedOption.impact || {});
                
                if (!validation.isValid || validation.isWarning) {
                    // Si hay violaciones, mostrar modal de validación
                    showResourceValidationModal(validation.violations, decision, selectedOption, onSelect, () => {
                        // En caso de cancelación, permitir re-seleccionar otras opciones
                        card.querySelectorAll('.option').forEach(opt => {
                            opt.classList.remove('disabled');
                            opt.style.pointerEvents = 'auto';
                            opt.style.opacity = '1';
                        });
                        optionElement.classList.remove('selected');
                        optionElement.querySelector('.option-selected-badge')?.remove();
                    });
                    return;
                }
            }

            // Si la validación pasó, proceder con la decisión
            onSelect(decision.id, selectedOption);
        });

        // Hover para realce
        optionElement.addEventListener('mouseenter', () => {
            card.style.borderColor = '#00ff00';
            card.style.boxShadow = '0 0 20px rgba(0, 255, 0, 0.08)';
        });
        optionElement.addEventListener('mouseleave', () => {
            card.style.borderColor = '';
            card.style.boxShadow = '';
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

    // Asegurar que el HUD esté visible durante toda la Fase Legal
    gameState.setHUDVisibility(true);
    gameState.updateHUD();

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
                    <h3 style="margin-bottom: 1rem; color: #4ade80;">📦 Documentos Disponibles</h3>
                    <div class="document-library" style="grid-template-columns: repeat(3, 1fr); gap: 1rem;">
                        ${documentHTML}
                    </div>
                </div>
                
                <!-- Columna derecha: Expediente y Memorial -->
                <div style="display: flex; flex-direction: column; gap: 1.5rem;">
                    <div style="padding: 1.5rem; background: rgba(0,100,200,0.1); border-radius: 8px; border-left: 4px solid #0066cc;">
                        <h3 style="margin-bottom: 1rem; color: #e0e0e0;">📝 Memorial de Solicitud</h3>
                        <div id="legal-memorial" style="background: rgba(0,50,100,0.3); padding: 1rem; border-radius: 4px; font-size: 0.9rem; line-height: 1.6; max-height: 150px; overflow-y: auto; color: #e0e0e0;"></div>
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
                <button class="btn btn-primary" onclick="handleLegalRevalidation()">↩️ Volver a escoger</button>
                <button class="btn btn-warning" onclick="continueLegalPhaseWithWarning()">✅ Aceptar y continuar</button>
            </div>
        </div>
    `;

    document.body.appendChild(modal);
}

function handleLegalRevalidation() {
    closeLegalWarningModal();

    // Generar un evento de penalidad aleatorio de la fase legal
    const legalEvents = EVENTS_BANK.filter(e => e.type === 'legal' || e.phase.includes('legal'));
    const penaltyEvent = legalEvents[Math.floor(Math.random() * legalEvents.length)];

    // Crear modal overlay para forzar la decisión del evento
    const overlay = document.createElement('div');
    overlay.id = 'legal-penalty-overlay';
    overlay.className = 'legal-warning-overlay';

    const card = renderDecisionCard(penaltyEvent, (decisionId, selectedOption) => {
        // Aplicar impacto al HUD y registrar
        gameState.updateIndicators(selectedOption.consequence?.resources || {});

        // Guardar la opción en el historial si es necesario
        if (!gameState.decisions.crisis) gameState.decisions.crisis = [];
        gameState.decisions.crisis.push({ id: decisionId, selectedOption: selectedOption.id, selectedOptionImpact: selectedOption.consequence?.resources || {} });
        gameState.save();

        // Remover overlay y permitir que el usuario intente de nuevo el drag & drop
        setTimeout(() => {
            overlay.style.opacity = '0';
            setTimeout(() => overlay.remove(), 300);
        }, 500);
    });

    // Estilizar la tarjeta para que se vea como un modal centrado
    card.style.background = '#1a1a2e';
    card.style.maxWidth = '600px';
    card.style.margin = '2rem auto';
    card.style.position = 'relative';
    card.style.maxHeight = '90vh';
    card.style.overflowY = 'auto';
    card.style.boxShadow = '0 10px 40px rgba(0,0,0,0.5)';

    // Añadir un título extra indicando la penalidad
    const penaltyHeader = document.createElement('div');
    penaltyHeader.innerHTML = '<h3 style="color:#f87171; text-align:center; margin-bottom:1rem; border-bottom:1px solid #f87171; padding-bottom:0.5rem;">⚠️ EVENTO INESPERADO POR RETRASO EN RADICACIÓN</h3>';
    card.insertBefore(penaltyHeader, card.firstChild);

    overlay.appendChild(card);
    document.body.appendChild(overlay);

    // Animación de entrada
    overlay.style.opacity = '0';
    overlay.style.transition = 'opacity 0.3s ease';
    requestAnimationFrame(() => overlay.style.opacity = '1');
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

// Fase 2: Decisiones Ambientales — Una a la vez (sin retroceso)
function renderPhase2EnvironmentalCards() {
    const app = document.getElementById('app');
    gameState.screen = 'phase2';
    gameState.currentPhase = 'environmental';

    const decisions = generateRandomEnvironmentalPhase(gameState.project.difficulty);
    let currentDecisionIndex = 0;

    // Crear el layout base (solo una vez)
    app.innerHTML = `
        <div class="screen" style="padding: 2rem; max-width: 860px; margin: 0 auto;">
            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:1.5rem;">
                <div>
                    <h1 style="margin:0;">🌱 FASE 2: GESTIÓN AMBIENTAL</h1>
                    <div id="env-progress" style="font-size:0.95rem; color:#ccc; margin-top:6px;">
                        Decisión 1 de ${decisions.length}
                    </div>
                </div>
                <!-- Barra de progreso visual -->
                <div style="display:flex; gap:6px; align-items:center;">
                    ${decisions.map((_, i) =>
        `<div class="env-step-dot" id="env-dot-${i}"
                            style="width:12px;height:12px;border-radius:50%;
                                   background:rgba(255,255,255,0.2);
                                   border:2px solid rgba(255,255,255,0.3);
                                   transition:all 0.3s;">
                        </div>`
    ).join('')}
                </div>
            </div>

            <!-- Contenedor de la tarjeta activa (se reemplaza en cada decisión) -->
            <div id="env-card-slot"></div>
        </div>
    `;

    function updateDots() {
        decisions.forEach((_, i) => {
            const dot = document.getElementById(`env-dot-${i}`);
            if (!dot) return;
            if (i < currentDecisionIndex) {
                dot.style.background = '#4ade80';
                dot.style.borderColor = '#4ade80';
            } else if (i === currentDecisionIndex) {
                dot.style.background = '#facc15';
                dot.style.borderColor = '#facc15';
                dot.style.transform = 'scale(1.3)';
            } else {
                dot.style.background = 'rgba(255,255,255,0.2)';
                dot.style.borderColor = 'rgba(255,255,255,0.3)';
                dot.style.transform = 'scale(1)';
            }
        });
    }

    function showDecision() {
        if (currentDecisionIndex >= decisions.length) {
            gameState.setPhaseScore('environmental', calculateEnvironmentalScore());
            showEnvironmentalStageSummaryModal();
            return;
        }

        const decision = decisions[currentDecisionIndex];
        const slot = document.getElementById('env-card-slot');
        if (!slot) return;

        // Actualizar progreso textual
        const progressEl = document.getElementById('env-progress');
        if (progressEl) {
            progressEl.textContent = `Decisión ${currentDecisionIndex + 1} de ${decisions.length}`;
        }
        updateDots();

        // Limpiar slot y animar entrada
        slot.innerHTML = '';
        slot.style.opacity = '0';
        slot.style.transform = 'translateY(16px)';

        const card = renderDecisionCard(decision, (decisionId, selectedOption) => {
            // Registrar decisión y aplicar impactos
            gameState.addEnvironmentalDecision(decisionId, selectedOption);
            gameState.updateIndicators(selectedOption.impact || {});
            gameState.save();

            // Marcar dot actual como completado
            const dot = document.getElementById(`env-dot-${currentDecisionIndex}`);
            if (dot) {
                dot.style.background = '#4ade80';
                dot.style.borderColor = '#4ade80';
                dot.style.transform = 'scale(1)';
            }

            currentDecisionIndex++;

            // Animar salida de la tarjeta actual, luego mostrar la siguiente
            slot.style.transition = 'opacity 0.35s ease, transform 0.35s ease';
            slot.style.opacity = '0';
            slot.style.transform = 'translateY(-12px)';

            setTimeout(() => showDecision(), 400);
        });

        slot.appendChild(card);

        // Animar entrada
        requestAnimationFrame(() => {
            slot.style.transition = 'opacity 0.35s ease, transform 0.35s ease';
            slot.style.opacity = '1';
            slot.style.transform = 'translateY(0)';
        });
    }

    showDecision();
    gameState.save();
}


// Calcular score ambiental
function calculateEnvironmentalScore() {
    let score = 100;

    // Convert to percentages based on indicatorMax
    const iPct = (gameState.indicators.impact / (gameState.indicatorMax.impact || 1)) * 100;
    const wPct = (gameState.indicators.water / (gameState.indicatorMax.water || 1)) * 100;
    const cPct = gameState.indicators.community;

    // Penalización por indicadores altos/bajos
    if (iPct > 70) score -= 30;
    else if (iPct > 50) score -= 15;

    if (cPct < 30) score -= 20;
    else if (cPct < 50) score -= 10;

    if (wPct < 20) score -= 25;
    else if (wPct < 40) score -= 15;

    return Math.max(0, score);
}

function showEnvironmentalStageSummaryModal() {
    const score = calculateEnvironmentalScore();

    const indicatorsPct = {
        budget: (gameState.indicators.budget / (gameState.indicatorMax.budget || 1)) * 100,
        water: (gameState.indicators.water / (gameState.indicatorMax.water || 1)) * 100,
        land: (gameState.indicators.land / (gameState.indicatorMax.land || 1)) * 100,
        impact: (gameState.indicators.impact / (gameState.indicatorMax.impact || 1)) * 100,
        community: gameState.indicators.community
    };

    const verdictData = evaluateEnvironmentalApproval(indicatorsPct);

    // Compute spent budget from initial
    const budgetSpent = gameState.indicatorMax.budget - gameState.indicators.budget;
    const budgetSpentFmt = gameState._formatValue('budget', budgetSpent);

    // Indicator status helpers
    function statusTag(pct, isInverse) {
        const bad = isInverse ? pct > 70 : pct < 20;
        const warn = isInverse ? pct > 50 : pct < 40;
        if (bad) return '<span style="color:#f87171;font-weight:700;">⚠ CRÍTICO</span>';
        if (warn) return '<span style="color:#facc15;font-weight:700;">⚡ ALERTA</span>';
        return '<span style="color:#4ade80;font-weight:700;">✔ OK</span>';
    }

    // Decisions log rows
    const envDecisions = gameState.decisions.environmental || [];
    const decisionRows = envDecisions.map(d => {
        const budgetDelta = (d.impact && typeof d.impact.budget === 'number') ? d.impact.budget : 0;
        const budgetLabel = budgetDelta !== 0
            ? `<span style="color:${budgetDelta < 0 ? '#f87171' : '#4ade80'}">${budgetDelta < 0 ? '−' : '+'}${gameState._formatValue('budget', Math.abs(budgetDelta))}</span>`
            : '<span style="color:#aaa">—</span>';
        return `<tr style="border-bottom:1px solid rgba(255,255,255,0.07);">
            <td style="padding:0.4rem 0.6rem;font-size:0.8rem;color:#ccc;">${d.optionTitle || d.option}</td>
            <td style="padding:0.4rem 0.6rem;font-size:0.8rem;text-align:right;">${budgetLabel}</td>
        </tr>`;
    }).join('');

    // Verdict color & icon
    const vColor = verdictData.verdict === 'rejected' ? '#f87171'
        : verdictData.verdict === 'conditional' ? '#facc15'
            : '#4ade80';
    const vIcon = verdictData.verdict === 'rejected' ? '🚫'
        : verdictData.verdict === 'conditional' ? '⚠️'
            : '✅';

    // Context-aware recommendations
    let recommendations = '';
    if (indicatorsPct.community < 40) {
        recommendations += '<li>La <strong>licencia social</strong> está en riesgo. En Colombia, proyectos con aprobación comunitaria baja suelen enfrentar tutelas y bloqueos (ver caso Hidroituango, 2018).</li>';
    }
    if (indicatorsPct.impact > 60) {
        recommendations += '<li>El <strong>impacto ambiental acumulado</strong> supera límites recomendados. La ANLA puede exigir medidas compensatorias adicionales bajo el Decreto 1076 de 2015.</li>';
    }
    if (indicatorsPct.water < 30) {
        recommendations += '<li>El <strong>recurso hídrico</strong> está comprometido. Las CAR pueden suspender la concesión de aguas si el IUA supera el 50% (IDEAM, 2022).</li>';
    }
    if (indicatorsPct.budget < 25) {
        recommendations += '<li>El <strong>presupuesto restante</strong> es crítico. Proyectos ambientalmente exigentes en Colombia requieren reservas del 15-20% del CAPEX para contingencias regulatorias.</li>';
    }
    if (!recommendations) {
        recommendations = '<li>Buen equilibrio entre inversión ambiental y viabilidad financiera. Mantén el monitoreo continuo ante la ANLA para conservar la licencia.</li>';
    }

    const modal = document.createElement('div');
    modal.id = 'environmental-summary-modal';
    modal.className = 'legal-warning-overlay';
    modal.innerHTML = `
        <div class="legal-warning-modal legal-summary-modal" style="max-width:720px;max-height:92vh;overflow-y:auto;">

            <h3 style="display:flex;align-items:center;gap:0.5rem;">🌱 Cierre — Etapa Ambiental</h3>
            <p style="color:#bbb;font-size:0.9rem;">Resumen de decisiones, impacto real e indicadores al cerrar la fase 2.</p>

            <!-- Veredicto -->
            <div style="background:rgba(0,0,0,0.3);border:2px solid ${vColor};border-radius:10px;padding:1rem 1.2rem;margin:1rem 0;display:flex;align-items:center;gap:1rem;">
                <span style="font-size:2rem;">${vIcon}</span>
                <div>
                    <div style="font-size:0.75rem;text-transform:uppercase;letter-spacing:0.08em;color:rgba(255,255,255,0.5);">Veredicto ANLA</div>
                    <div style="font-size:1.05rem;font-weight:700;color:${vColor};">${verdictData.message}</div>
                </div>
                <div style="margin-left:auto;text-align:right;">
                    <div style="font-size:0.75rem;color:rgba(255,255,255,0.5);">Puntaje fase</div>
                    <div style="font-size:1.6rem;font-weight:800;color:#fff;">${score}<span style="font-size:0.9rem;color:#aaa;">/100</span></div>
                </div>
            </div>

            <!-- Grid: indicadores + decisiones -->
            <div style="display:grid;grid-template-columns:1fr 1fr;gap:1rem;margin-bottom:1rem;">

                <!-- Indicadores finales -->
                <div style="background:rgba(0,0,0,0.2);border-radius:8px;padding:1rem;">
                    <h4 style="margin:0 0 0.7rem;font-size:0.85rem;text-transform:uppercase;letter-spacing:0.06em;color:rgba(255,255,255,0.5);">📊 Indicadores Finales</h4>
                    <table style="width:100%;border-collapse:collapse;">
                        <tr style="border-bottom:1px solid rgba(255,255,255,0.08);">
                            <td style="padding:0.35rem 0;font-size:0.83rem;">💰 Presupuesto</td>
                            <td style="text-align:right;font-weight:700;">${gameState._formatValue('budget', gameState.indicators.budget)}</td>
                            <td style="text-align:right;padding-left:0.5rem;">${statusTag(indicatorsPct.budget, false)}</td>
                        </tr>
                        <tr style="border-bottom:1px solid rgba(255,255,255,0.08);">
                            <td style="padding:0.35rem 0;font-size:0.83rem;">💸 Invertido</td>
                            <td style="text-align:right;font-weight:700;color:#f87171;">−${budgetSpentFmt}</td>
                            <td></td>
                        </tr>
                        <tr style="border-bottom:1px solid rgba(255,255,255,0.08);">
                            <td style="padding:0.35rem 0;font-size:0.83rem;">💧 Agua</td>
                            <td style="text-align:right;font-weight:700;">${gameState._formatValue('water', gameState.indicators.water)}</td>
                            <td style="text-align:right;padding-left:0.5rem;">${statusTag(indicatorsPct.water, false)}</td>
                        </tr>
                        <tr style="border-bottom:1px solid rgba(255,255,255,0.08);">
                            <td style="padding:0.35rem 0;font-size:0.83rem;">🌍 Suelo</td>
                            <td style="text-align:right;font-weight:700;">${gameState._formatValue('land', gameState.indicators.land)}</td>
                            <td style="text-align:right;padding-left:0.5rem;">${statusTag(indicatorsPct.land, false)}</td>
                        </tr>
                        <tr style="border-bottom:1px solid rgba(255,255,255,0.08);">
                            <td style="padding:0.35rem 0;font-size:0.83rem;">🌿 Impacto CO₂</td>
                            <td style="text-align:right;font-weight:700;">${gameState._formatValue('impact', gameState.indicators.impact)}</td>
                            <td style="text-align:right;padding-left:0.5rem;">${statusTag(indicatorsPct.impact, true)}</td>
                        </tr>
                        <tr>
                            <td style="padding:0.35rem 0;font-size:0.83rem;">🤝 Comunidad</td>
                            <td style="text-align:right;font-weight:700;">${gameState._formatValue('community', gameState.indicators.community)}</td>
                            <td style="text-align:right;padding-left:0.5rem;">${statusTag(indicatorsPct.community, false)}</td>
                        </tr>
                    </table>
                </div>

                <!-- Tabla de decisiones -->
                <div style="background:rgba(0,0,0,0.2);border-radius:8px;padding:1rem;">
                    <h4 style="margin:0 0 0.7rem;font-size:0.85rem;text-transform:uppercase;letter-spacing:0.06em;color:rgba(255,255,255,0.5);">🗂 Decisiones Tomadas</h4>
                    ${decisionRows
            ? `<table style="width:100%;border-collapse:collapse;">
                            <thead><tr>
                                <th style="font-size:0.72rem;text-align:left;padding:0.3rem 0.6rem;color:#aaa;">Opción elegida</th>
                                <th style="font-size:0.72rem;text-align:right;padding:0.3rem 0.6rem;color:#aaa;">Δ Presup.</th>
                            </tr></thead>
                            <tbody>${decisionRows}</tbody>
                          </table>`
            : '<p style="color:#aaa;font-size:0.85rem;">Sin decisiones registradas.</p>'}
                </div>
            </div>

            <!-- Retroalimentación pedagógica -->
            <div class="legal-reflection-box" style="margin:0 0 1rem;">
                <strong style="color:#fff;">📚 Retroalimentación — Contexto Colombiano</strong>
                <ul style="margin:0.6rem 0 0;padding-left:1.2rem;font-size:0.85rem;line-height:1.6;color:#ccc;">
                    ${recommendations}
                    <li>Recuerda: en Colombia, la <strong>ANLA</strong> es la autoridad nacional de licencias ambientales. Los proyectos de alto impacto (minería, hidroeléctricas, vías) deben tramitar licencia ambiental según el Decreto 1076 de 2015.</li>
                    <li>La <strong>consulta previa</strong> con comunidades étnicas es un derecho constitucional (Art. 330 C.P. y Convenio 169 OIT). Omitirla puede anular la licencia ambiental por vía judicial.</li>
                </ul>
            </div>

            <div class="legal-warning-actions" style="margin-top:1rem;">
                <button class="btn btn-success" onclick="proceedToPhase3FromEnvironmentalSummary()">➡️ Continuar a Fase de Crisis</button>
            </div>
        </div>
    `;

    document.body.appendChild(modal);
}

function proceedToPhase3FromEnvironmentalSummary() {
    const summaryModal = document.getElementById('environmental-summary-modal');
    if (summaryModal) summaryModal.remove();
    setTimeout(() => renderPhase3Crisis(), 300);
}

// Fase 3: Decisiones de Crisis — Una a la vez
function renderPhase3Crisis() {
    const app = document.getElementById('app');
    gameState.screen = 'phase3';
    gameState.currentPhase = 'crisis';

    // Generar de 3 a 4 crisis aleatorias
    let crises = [...EVENT_LIBRARY.crises];
    crises.sort(() => Math.random() - 0.5);
    const count = gameState.project.difficulty === 'critical' ? 4 : 3;
    crises = crises.slice(0, count);

    let currentCrisisIndex = 0;

    // Crear el layout base
    app.innerHTML = `
        <div class="screen" style="padding: 2rem; max-width: 860px; margin: 0 auto;">
            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:1.5rem;">
                <div>
                    <h1 style="margin:0; color:#ff6666;">🚨 FASE 3: GESTIÓN DE CRISIS</h1>
                    <div id="crisis-progress" style="font-size:0.95rem; color:#ccc; margin-top:6px;">
                        Evento 1 de ${crises.length}
                    </div>
                </div>
                <!-- Barra de progreso visual -->
                <div style="display:flex; gap:6px; align-items:center;">
                    ${crises.map((_, i) =>
        `<div class="crisis-step-dot" id="crisis-dot-${i}"
                            style="width:12px;height:12px;border-radius:50%;
                                   background:rgba(255,255,255,0.2);
                                   border:2px solid rgba(255,255,255,0.3);
                                   transition:all 0.3s;">
                        </div>`
    ).join('')}
                </div>
            </div>

            <!-- Contenedor de la tarjeta activa -->
            <div id="crisis-card-slot"></div>
        </div>
    `;

    function updateDots() {
        crises.forEach((_, i) => {
            const dot = document.getElementById(`crisis-dot-${i}`);
            if (!dot) return;
            if (i < currentCrisisIndex) {
                dot.style.background = '#f87171';
                dot.style.borderColor = '#f87171';
            } else if (i === currentCrisisIndex) {
                dot.style.background = '#facc15';
                dot.style.borderColor = '#facc15';
                dot.style.transform = 'scale(1.3)';
            } else {
                dot.style.background = 'rgba(255,255,255,0.2)';
                dot.style.borderColor = 'rgba(255,255,255,0.3)';
                dot.style.transform = 'scale(1)';
            }
        });
    }

    function showCrisis() {
        if (currentCrisisIndex >= crises.length) {
            // Completado, ir al reporte final
            gameState.setPhaseScore('crisis', 80); // Placeholder score
            setTimeout(() => renderFinalReportWithHeadlines(), 500);
            return;
        }

        const crisis = crises[currentCrisisIndex];
        const slot = document.getElementById('crisis-card-slot');
        if (!slot) return;

        // Actualizar progreso textual
        const progressEl = document.getElementById('crisis-progress');
        if (progressEl) {
            progressEl.textContent = `Evento ${currentCrisisIndex + 1} de ${crises.length}`;
        }
        updateDots();

        // Limpiar slot y animar entrada
        slot.innerHTML = '';
        slot.style.opacity = '0';
        slot.style.transform = 'translateY(16px)';

        const card = renderDecisionCard(crisis, (crisisId, selectedOption) => {
            // Registrar decisión y aplicar impactos
            if (!gameState.decisions.crisis) gameState.decisions.crisis = [];
            gameState.decisions.crisis.push({
                crisisId: crisisId,
                selectedOptionId: selectedOption.id,
                selectedOptionTitle: selectedOption.title,
                selectedOptionImpact: selectedOption.impact || {}
            });
            gameState.updateIndicators(selectedOption.impact || {});
            gameState.save();

            // Marcar dot actual como completado
            const dot = document.getElementById(`crisis-dot-${currentCrisisIndex}`);
            if (dot) {
                dot.style.background = '#f87171';
                dot.style.borderColor = '#f87171';
                dot.style.transform = 'scale(1)';
            }

            currentCrisisIndex++;

            // Animar salida de la tarjeta actual
            slot.style.transition = 'opacity 0.35s ease, transform 0.35s ease';
            slot.style.opacity = '0';
            slot.style.transform = 'translateY(-12px)';

            setTimeout(() => showCrisis(), 400);
        });

        // Estilizar tarjeta para la fase de crisis
        card.style.borderColor = '#ff3333';
        card.style.boxShadow = '0 0 15px rgba(255,50,50,0.1)';

        slot.appendChild(card);

        // Animar entrada
        requestAnimationFrame(() => {
            slot.style.transition = 'opacity 0.35s ease, transform 0.35s ease';
            slot.style.opacity = '1';
            slot.style.transform = 'translateY(0)';
        });
    }

    showCrisis();
    gameState.save();
}

// Nueva Pantalla Final: Titulares de Periódico
function renderFinalReportWithHeadlines() {
    const app = document.getElementById('app');
    gameState.screen = 'report';

    // Primero, mostrar pantalla de reflexión
    app.innerHTML = `
        <div class="screen" style="padding: 2rem; max-width: 1000px; margin: 0 auto;">
            <div style="text-align: center; margin-bottom: 2rem;">
                <h1 style="margin-bottom: 0.5rem;">📚 Reflexión Final</h1>
                <p style="color: #ccc; font-size: 1.1rem;">
                    <strong>Grupo ${gameState.groupNumber}</strong> | Integrantes: ${gameState.teamMembers && gameState.teamMembers.length > 0 ? gameState.teamMembers.map(m => m.name).join(', ') : 'No registrados'}
                </p>
            </div>
            
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
                <div style="margin-top: 1.5rem; padding-top: 1.5rem; border-top: 1px solid rgba(212, 165, 116, 0.3);">
                    <p style="color: #ccc; font-size: 1.1rem; font-weight: bold;">Grupo ${gameState.groupNumber}</p>
                    <p style="color: #aaa; font-size: 0.95rem; margin-top: 0.5rem;">
                        Integrantes: ${gameState.teamMembers && gameState.teamMembers.length > 0 ? gameState.teamMembers.map(m => m.name).join(', ') : 'No registrados'}
                    </p>
                </div>
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
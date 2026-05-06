// ============================================
// SISTEMA DE VALIDACIÓN DE RECURSOS
// ============================================
// Valida que los indicadores tengan suficientes recursos
// antes de aplicar decisiones y ofrece soluciones

class ResourceValidator {
    constructor(gameState) {
        this.gameState = gameState;
        this.criticalThresholds = {
            budget: 0.05,        // 5% del máximo
            water: 0.10,         // 10% del máximo
            land: 0.10,          // 10% del máximo
            impact: 0.85,        // 85% del máximo (impacto es inverso)
            community: 0.20      // 20% del máximo
        };
    }

    /**
     * Valida si una decisión puede aplicarse sin exceder límites críticos
     * @param {Object} impacts - Los impactos a aplicar { budget, water, land, impact, community }
     * @returns {Object} { isValid, violations: [{key, current, max, required, message}] }
     */
    validateDecision(impacts) {
        const violations = [];

        // Validar cada indicador
        Object.entries(impacts).forEach(([key, value]) => {
            if (!this.gameState.indicators.hasOwnProperty(key)) return;

            const currentValue = this.gameState.indicators[key];
            const maxValue = this.gameState.indicatorMax[key] || 1;
            const newValue = currentValue + value;
            const threshold = this.criticalThresholds[key] * maxValue;

            // Para impacto, el máximo es lo peor (más daño = más impacto)
            if (key === 'impact') {
                const maxImpact = this.gameState.indicatorMax.impact;
                if (newValue > maxImpact * 0.9) {
                    violations.push({
                        key: 'impact',
                        type: 'warning',
                        current: currentValue,
                        max: maxImpact,
                        newValue: newValue,
                        message: `⚠️ El impacto ambiental acumulado sería crítico (${Math.round(newValue)} tCO₂e de ${maxImpact} máximo)`
                    });
                }
            }
            // Para comunidad, debe ser >= 0 y <= 100
            else if (key === 'community') {
                if (newValue < 0) {
                    violations.push({
                        key: 'community',
                        type: 'error',
                        current: currentValue,
                        newValue: newValue,
                        message: `❌ La aprobación comunitaria no puede ser negativa`
                    });
                } else if (newValue > 100) {
                    violations.push({
                        key: 'community',
                        type: 'warning',
                        current: currentValue,
                        newValue: newValue,
                        message: `⚠️ La aprobación comunitaria está en el máximo (${currentValue}%)`
                    });
                } else if (newValue < 30) {
                    violations.push({
                        key: 'community',
                        type: 'critical',
                        current: currentValue,
                        newValue: newValue,
                        message: `🚨 CRÍTICO: Aprobación comunitaria por debajo de 30% puede invalidar el proyecto`
                    });
                }
            }
            // Para recursos (budget, water, land)
            else if (newValue < 0) {
                violations.push({
                    key: key,
                    type: 'error',
                    current: currentValue,
                    required: Math.abs(newValue),
                    max: maxValue,
                    message: this._getResourceErrorMessage(key, currentValue, value, maxValue)
                });
            } else if (newValue < threshold) {
                violations.push({
                    key: key,
                    type: 'warning',
                    current: currentValue,
                    newValue: newValue,
                    threshold: threshold,
                    max: maxValue,
                    message: this._getResourceWarningMessage(key, currentValue, newValue, maxValue)
                });
            }
        });

        return {
            isValid: violations.filter(v => v.type === 'error').length === 0,
            isWarning: violations.length > 0,
            violations: violations
        };
    }

    /**
     * Genera mensaje de error personalizado según el recurso
     */
    _getResourceErrorMessage(key, current, delta, max) {
        const icon = key === 'budget' ? '💰' : key === 'water' ? '💧' : '🌍';
        const label = key === 'budget' ? 'Presupuesto' : key === 'water' ? 'Agua' : 'Suelo';
        const formattedDelta = this.gameState._formatValue(key, Math.abs(delta));
        const formattedCurrent = this.gameState._formatValue(key, current);

        return `${icon} ${label}: Recursos insuficientes. Tienes ${formattedCurrent} pero necesitas ${formattedDelta} adicionales`;
    }

    /**
     * Genera mensaje de advertencia personalizado
     */
    _getResourceWarningMessage(key, current, newValue, max) {
        const icon = key === 'budget' ? '💰' : key === 'water' ? '💧' : '🌍';
        const label = key === 'budget' ? 'Presupuesto' : key === 'water' ? 'Agua' : 'Suelo';
        const formattedNew = this.gameState._formatValue(key, newValue);
        const pct = Math.round((newValue / max) * 100);

        return `⚠️ ${label}: Quedarían en ${formattedNew} (${pct}% del máximo). Considera aumentar este recurso.`;
    }

    /**
     * Calcula cuánto se necesita para cubrir una violación
     */
    calculateRequiredIncrease(violation) {
        if (violation.type === 'error') {
            return Math.abs(violation.newValue || violation.required);
        }
        return 0;
    }

    /**
     * Obtiene recomendaciones según el tipo de recurso
     */
    getRecommendation(key) {
        const recommendations = {
            budget: '💡 Considera reducir el alcance del proyecto o buscar financiamiento adicional (asociados, capital privado, bonos verdes).',
            water: '💡 Implementa sistemas de reciclaje de agua o reduce el consumo con tecnología más eficiente.',
            land: '💡 Rediseña el proyecto para minimizar la huella territorial o negocia compensaciones ecológicas.',
            impact: '💡 Selecciona opciones con menor impacto ambiental o implementa medidas de mitigación adicionales.',
            community: '💡 Fortalece los procesos de comunicación comunitaria y consulta previa con los territorios afectados.'
        };
        return recommendations[key] || '💡 Revisa tu estrategia para este indicador.';
    }

    /**
     * Obtiene contexto normativo colombiano
     */
    getNormativeContext(key) {
        const contexts = {
            budget: 'En Colombia, proyectos de infraestructura requieren reservas presupuestales del 15-20% según CONPES 3797.',
            water: 'La Resolución 330 de 2017 de la ANLA regula la concesión de aguas. El IUA (Índice de Uso del Agua) no debe superar el 50%.',
            land: 'El Decreto 2372 de 2010 regula áreas protegidas y zonas de amortiguación. La ley 2173 de 2021 promueve acuerdos de conservación.',
            impact: 'La ANLA requiere planes de manejo de impactos ambientales según el Decreto 1076 de 2015.',
            community: 'La Consulta Previa (Art. 330 C.P., Convenio 169 OIT) es obligatoria con comunidades étnicas.'
        };
        return contexts[key] || '';
    }
}

/**
 * Modal interactivo para validación de recursos - VERSIÓN SIMPLIFICADA
 */
function showResourceValidationModal(violations, decision, selectedOption, onApprove, onCancel) {
    const modal = document.createElement('div');
    modal.id = 'resource-validation-modal';
    modal.className = 'legal-warning-overlay';

    const hasErrors = violations.filter(v => v.type === 'error').length > 0;
    const title = hasErrors ? '⛔ RECURSOS INSUFICIENTES' : '⚠️ ADVERTENCIA DE RECURSOS';
    const titleColor = hasErrors ? '#f87171' : '#facc15';

    let violationHTML = '';
    violations.forEach(v => {
        const icon = v.type === 'error' ? '❌' : v.type === 'critical' ? '🚨' : '⚠️';
        violationHTML += `
            <div style="background: rgba(0,0,0,0.3); padding: 1rem; border-radius: 8px; margin-bottom: 0.8rem; border-left: 4px solid ${v.type === 'error' ? '#f87171' : v.type === 'critical' ? '#ff4444' : '#facc15'};">
                <div style="font-weight: 700; color: ${v.type === 'error' ? '#f87171' : v.type === 'critical' ? '#ff4444' : '#facc15'};">
                    ${icon} ${v.message}
                </div>
                <div style="font-size: 0.85rem; color: #aaa; margin-top: 0.5rem;">
                    ${validator.getRecommendation(v.key)}
                </div>
                <div style="font-size: 0.8rem; color: #888; margin-top: 0.4rem; font-style: italic;">
                    ${validator.getNormativeContext(v.key)}
                </div>
            </div>
        `;
    });

    const canApproveWarnings = !hasErrors;

    modal.innerHTML = `
        <div class="legal-warning-modal" style="max-width: 680px;">
            <h3 style="color: ${titleColor}; display: flex; align-items: center; gap: 0.5rem;">
                ${title}
            </h3>

            <p style="color: #ccc; margin: 1rem 0; font-size: 0.95rem;">
                La decisión que intentas tomar genera impactos que pueden comprometer recursos críticos del proyecto:
            </p>

            <div style="margin: 1.5rem 0;">
                ${violationHTML}
            </div>

            <div style="background: rgba(0,100,200,0.1); padding: 1rem; border-radius: 8px; border-left: 4px solid #0066cc; margin-bottom: 1rem;">
                <h4 style="color: #4ade80; margin-top: 0;">✅ Opciones</h4>
                <ol style="color: #ccc; margin: 0.5rem 0 0; padding-left: 1.2rem; font-size: 0.9rem;">
                    <li><strong>Volver a seleccionar:</strong> Elige otra opción de respuesta.</li>
                    <li><strong>Terminar juego:</strong> Vuelve al inicio del juego.</li>
                </ol>
            </div>

            <div class="legal-warning-actions" style="display: flex; gap: 0.8rem; flex-wrap: wrap;">
                <button class="btn btn-secondary" onclick="closeResourceValidationModalAndCancel()" style="flex: 1;">
                    ↩️ Volver a Seleccionar
                </button>
                <button class="btn btn-danger" onclick="returnToGameStart()" style="flex: 1;">
                    🏠 Terminar Juego
                </button>
            </div>
        </div>
    `;

    document.body.appendChild(modal);

    // Guardar callbacks globales para los botones
    window._pendingDecisionApproval = { onApprove, decision: decision, selectedOption: selectedOption };
}

function closeResourceValidationModal() {
    const modal = document.getElementById('resource-validation-modal');
    if (modal) modal.remove();
    const panel = document.getElementById('resource-adjustment-panel');
    if (panel) panel.remove();
}

/**
 * Cierra el modal y permite reseleccionar
 */
function closeResourceValidationModalAndCancel() {
    closeResourceValidationModal();
    
    // Permitir que el usuario reseleccione otras opciones
    const cards = document.querySelectorAll('.option');
    cards.forEach(card => {
        card.classList.remove('disabled', 'selected');
        card.style.pointerEvents = 'auto';
        card.style.opacity = '1';
        const badge = card.querySelector('.option-selected-badge');
        if (badge) badge.remove();
    });
}

/**
 * Vuelve al inicio del juego
 */
function returnToGameStart() {
    if (confirm('¿Estás seguro de que deseas terminar el juego y volver al inicio?')) {
        gameState.reset();
        gameState.save();
        closeResourceValidationModal();
        renderRegistrationScreen();
    }
}


/*
// ─────────────────────────────────────────────────────────────────
// FUNCIONES DEPRECADAS - AJUSTE MANUAL DE RECURSOS
// Comentadas porque se removió la opción de ajustar recursos
// ─────────────────────────────────────────────────────────────────

function showResourceAdjustmentPanel(violations, decision, selectedOption, onApprove, onCancel) {
    // Cerrar modal anterior
    const oldModal = document.getElementById('resource-validation-modal');
    if (oldModal) oldModal.remove();

    const panel = document.createElement('div');
    panel.id = 'resource-adjustment-panel';
    panel.className = 'legal-warning-overlay';

    let adjustmentHTML = '';
    const errorViolations = violations.filter(v => v.type === 'error' || v.type === 'warning');

    errorViolations.forEach(v => {
        if (v.key === 'budget' || v.key === 'water' || v.key === 'land') {
            const icon = v.key === 'budget' ? '💰' : v.key === 'water' ? '💧' : '🌍';
            const label = v.key === 'budget' ? 'Presupuesto' : v.key === 'water' ? 'Agua' : 'Suelo';
            const currentFormatted = gameState._formatValue(v.key, v.current);
            const maxFormatted = gameState._formatValue(v.key, v.max);

            adjustmentHTML += `
                <div style="background: rgba(0,0,0,0.2); padding: 1rem; border-radius: 8px; margin-bottom: 1rem;">
                    <label style="display: flex; align-items: center; gap: 0.5rem; font-weight: 700; margin-bottom: 0.5rem;">
                        ${icon} ${label}
                    </label>
                    <div style="font-size: 0.85rem; color: #aaa; margin-bottom: 0.5rem;">
                        Actual: ${currentFormatted} | Máximo posible: ${maxFormatted}
                    </div>
                    <input type="number" 
                        id="adjust-${v.key}" 
                        data-resource-key="${v.key}"
                        data-current="${v.current}"
                        data-max="${v.max}"
                        value="${v.current}"
                        min="0"
                        step="1"
                        style="width: 100%; padding: 0.6rem; border: 2px solid #0066cc; background: rgba(0,100,200,0.1); color: #4ade80; border-radius: 4px; font-size: 0.95rem; font-weight: 700;"
                    >
                    <small style="color: #0066cc; display: block; margin-top: 0.3rem;">Ingresa el nuevo valor para este recurso</small>
                </div>
            `;
        }
    });

    if (adjustmentHTML === '') {
        adjustmentHTML = '<p style="color: #aaa;">No hay recursos para ajustar.</p>';
    }

    panel.innerHTML = `
        <div class="legal-warning-modal" style="max-width: 600px;">
            <h3 style="color: #4ade80;">🔧 Ajustar Recursos del Proyecto</h3>
            <p style="color: #ccc; margin: 1rem 0; font-size: 0.9rem;">
                Aumenta los recursos necesarios para que la decisión sea viable. Esto puede afectar la estrategia global del proyecto.
            </p>

            <div style="margin: 1.5rem 0;">
                ${adjustmentHTML}
            </div>

            <div style="background: rgba(255,200,0,0.1); padding: 1rem; border-radius: 8px; border-left: 4px solid #facc15; margin-bottom: 1rem;">
                <strong style="color: #facc15;">⚠️ Impacto de aumentar recursos:</strong>
                <ul style="color: #ccc; font-size: 0.85rem; margin: 0.5rem 0; padding-left: 1.2rem;">
                    <li>Aumentar presupuesto puede requerir nuevo financiamiento</li>
                    <li>Aumentar agua requiere nuevas concesiones a la CAR</li>
                    <li>Aumentar suelo implica más impacto territorial</li>
                </ul>
            </div>

            <div class="legal-warning-actions" style="display: flex; gap: 0.8rem;">
                <button class="btn btn-success" onclick="confirmResourceAdjustment()" style="flex: 1;">
                    ✅ Confirmar Ajustes
                </button>
                <button class="btn btn-secondary" onclick="closeResourceValidationModal()" style="flex: 1;">
                    ❌ Cancelar
                </button>
            </div>
        </div>
    `;

    document.body.appendChild(panel);

    // Validar en tiempo real
    setTimeout(() => {
        document.querySelectorAll('[data-resource-key]').forEach(input => {
            input.addEventListener('change', function() {
                const maxVal = parseFloat(this.dataset.max);
                const val = parseFloat(this.value);
                if (val > maxVal) {
                    this.value = maxVal;
                    alert(`El valor máximo para este recurso es ${maxVal}`);
                } else if (val < 0) {
                    this.value = 0;
                }
            });
            
            input.addEventListener('input', function() {
                const val = parseFloat(this.value);
                if (isNaN(val) || val < 0) {
                    this.value = 0;
                }
            });
        });
    }, 100);
}

function confirmResourceAdjustment() {
    const adjustments = {};
    let hasAdjustments = false;

    document.querySelectorAll('[data-resource-key]').forEach(input => {
        const key = input.dataset.resourceKey;
        const newVal = parseFloat(input.value);
        const currentVal = parseFloat(input.dataset.current);
        const delta = newVal - currentVal;

        console.log(`Ajuste ${key}: ${currentVal} → ${newVal} (delta: ${delta})`);

        if (delta !== 0) {
            adjustments[key] = delta;
            hasAdjustments = true;
        }
    });

    // Aplicar ajustes al estado
    if (hasAdjustments) {
        console.log('Aplicando ajustes:', adjustments);
        gameState.updateIndicators(adjustments);
        gameState.save();

        // Mostrar confirmación
        alert('✅ Recursos ajustados correctamente. La decisión será aplicada.');
    }

    closeResourceValidationModal();

    // Reaplicar la decisión original
    const ctx = window._resourceValidationContext;
    if (ctx) {
        const { decision, selectedOption, onApprove } = ctx;
        
        // Validar nuevamente con los recursos ajustados
        const revalidation = validator.validateDecision(selectedOption.impact || {});
        console.log('Revalidación después de ajuste:', revalidation);
        
        if (revalidation.isValid || revalidation.violations.filter(v => v.type === 'error').length === 0) {
            // La decisión es ahora válida, aplicarla
            console.log('Decisión ahora válida, aplicando...');
            onApprove(decision.id, selectedOption);
        } else {
            // Todavía hay errores, mostrar validación de nuevo
            console.log('Aún hay violaciones, re-mostrando modal');
            showResourceValidationModal(revalidation.violations, decision, selectedOption, onApprove, () => {});
        }
    } else {
        console.error('No hay contexto de validación guardado');
    }
}

// ─────────────────────────────────────────────────────────────────
// FIN FUNCIONES DEPRECADAS
// ─────────────────────────────────────────────────────────────────
*/


// Instancia global del validador
let validator;

// Inicializar el validador cuando el gameState esté listo
document.addEventListener('DOMContentLoaded', () => {
    if (typeof gameState !== 'undefined') {
        validator = new ResourceValidator(gameState);
    }
});

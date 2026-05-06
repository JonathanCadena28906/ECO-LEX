// GENERACIÓN DE INFORME FINAL
function renderReportScreen() {
    const app = document.getElementById('app');

    // Calcular clasificación final
    const totalScore = gameState.calculateTotalScore();
    let status = 'revoked';
    let statusDisplay = '⚫ Proyecto Revocado';
    let statusClass = 'revoked';
    let statusMessage = 'El proyecto no completó el flujo requerido o acumuló demasiadas crisis sin resolver.';

    if (totalScore >= 85) {
        status = 'gold';
        statusDisplay = '🥇 Proyecto de Oro';
        statusClass = 'gold';
        statusMessage = 'Todas las fases fueron aprobadas con excelencia. Gestión sobresaliente de legal, ambiental y crisis.';
    } else if (totalScore >= 70) {
        status = 'viable';
        statusDisplay = '🟢 Proyecto Viable';
        statusClass = 'viable';
        statusMessage = 'El proyecto recibió todas las aprobaciones necesarias. Está listo para implementación.';
    } else if (totalScore >= 55) {
        status = 'observation';
        statusDisplay = '🟡 En Observación';
        statusClass = 'observation';
        statusMessage = 'Permisos obtenidos, pero con condiciones. Requiere monitoreo adicional durante ejecución.';
    } else if (totalScore >= 40) {
        status = 'sanctioned';
        statusDisplay = '🔴 Proyecto Sancionado';
        statusClass = 'sanctioned';
        statusMessage = 'No obtuvo todos los sellos requeridos o falló en gestión ambiental. Requiere reingeniería.';
    }

    gameState.setFinalResult({
        status,
        totalScore,
        message: statusMessage
    });

    app.innerHTML = `
        <div class="screen report-screen">
            <div class="report-container">
                <!-- Encabezado del informe -->
                <div class="report-header">
                    <h1 class="report-title">INFORME FINAL ECO-LEX</h1>
                    <p class="report-project-name" style="margin-bottom: 0.5rem;">Proyecto: ${gameState.project.name}</p>
                    <div style="background: #f5f7fa; padding: 1rem; border-radius: 8px; margin-bottom: 1rem; text-align: left;">
                        <h3 style="margin-bottom: 0.5rem; color: #2c3e50;">Grupo ${gameState.groupNumber}</h3>
                        <p style="color: #34495e; font-weight: bold;">
                            Integrantes: ${gameState.teamMembers && gameState.teamMembers.length > 0 ? gameState.teamMembers.map(m => m.name).join(', ') : 'Nombres no registrados'}
                        </p>
                    </div>
                    <div class="result-status ${statusClass}">
                        ${statusDisplay}
                    </div>
                </div>

                <!-- Información del grupo -->
                <div class="team-info">
                    <div style="margin-bottom: 1rem; font-weight: bold;">
                        Grupo ${gameState.groupNumber} - ${gameState.project.name} | Generado: ${new Date().toLocaleString('es-CO')}
                    </div>
                    <div class="team-info-grid">
                        ${gameState.teamMembers.map(member => `
                            <div class="team-member">
                                <div class="team-member-name">${member.name}</div>
                                <div class="team-member-role">Rol: ${member.role}</div>
                            </div>
                        `).join('')}
                    </div>
                </div>

                <!-- Resumen de puntajes -->
                <div class="report-section">
                    <h2 class="report-section-title">📊 Resumen de Puntajes</h2>
                    <div class="scores-grid">
                        <div class="score-card">
                            <div class="score-label">Fase Legal</div>
                            <div class="score-value">${gameState.phaseScores.legal}</div>
                            <div class="score-out-of">/ 100</div>
                        </div>
                        <div class="score-card">
                            <div class="score-label">Fase Ambiental</div>
                            <div class="score-value">${gameState.phaseScores.environmental}</div>
                            <div class="score-out-of">/ 100</div>
                        </div>
                        <div class="score-card">
                            <div class="score-label">Fase Crisis</div>
                            <div class="score-value">${gameState.phaseScores.crisis}</div>
                            <div class="score-out-of">/ 100</div>
                        </div>
                    </div>
                    <div class="score-card" style="grid-column: 1 / -1; text-align: center;">
                        <div class="score-label">Puntaje Total</div>
                        <div class="score-value" style="font-size: 2.5rem;">${totalScore}</div>
                        <div class="score-out-of">/ 100</div>
                    </div>
                </div>

                <!-- Resultado Final -->
                <div class="report-section">
                    <h2 class="report-section-title">🎯 Resultado Final</h2>
                    <div class="alert alert-${statusClass === 'gold' ? 'success' : statusClass === 'viable' ? 'success' : statusClass === 'observation' ? 'warning' : 'error'}">
                        <div class="alert-icon">${statusDisplay.charAt(0)}</div>
                        <div class="alert-content">
                            <div class="alert-title">${statusDisplay}</div>
                            <p class="alert-message">${statusMessage}</p>
                        </div>
                    </div>
                </div>

                <!-- Indicadores Finales -->
                <div class="report-section">
                    <h2 class="report-section-title">📈 Estado Final de Indicadores</h2>
                    <div class="grid grid-cols-2">
                        ${Object.entries(gameState.indicators).map(([key, value]) => {
                            const indicator = ENVIRONMENTAL_DECISIONS.indicators[key];
                            const percentage = Math.round(value);
                            return `
                                <div>
                                    <div style="margin-bottom: 1rem;">
                                        <strong>${indicator.name}</strong><br>
                                        <small>${value.toFixed(1)}%</small>
                                    </div>
                                    <div class="progress-bar">
                                        <div class="progress-fill" style="width: ${percentage}%"></div>
                                    </div>
                                </div>
                            `;
                        }).join('')}
                    </div>
                </div>

                <!-- Resumen de Decisiones por Fase -->
                <div class="report-section">
                    <h2 class="report-section-title">📋 Resumen de Decisiones</h2>

                    <!-- Fase Legal -->
                    <div class="phase-summary legal">
                        <div class="phase-summary-title">⚖️ Fase Legal</div>
                        <div class="phase-summary-content">
                            <ul>
                                <li>Empresa: ${gameState.decisions.legal[0]?.companyName || 'N/A'}</li>
                                <li>NIT: ${gameState.decisions.legal[0]?.companyNIT || 'N/A'}</li>
                                <li>Intentos de validación: ${gameState.decisions.legal[0]?.attempts || 0}</li>
                                <li>Requisitos seleccionados: ${gameState.decisions.legal[0]?.requirements?.length || 0}</li>
                            </ul>
                        </div>
                    </div>

                    <!-- Fase Ambiental -->
                    <div class="phase-summary environmental">
                        <div class="phase-summary-title">🌿 Fase Ambiental</div>
                        <div class="phase-summary-content">
                            <ul>
                                <li>Decisiones tomadas: ${gameState.decisions.environmental.length}</li>
                                <li>Impacto ambiental final: ${gameState.indicators.impact.toFixed(1)}%</li>
                                <li>Aprobación comunitaria: ${gameState.indicators.community.toFixed(1)}%</li>
                                <li>Presupuesto restante: ${gameState.indicators.budget.toFixed(1)}%</li>
                            </ul>
                            ${gameState.decisions.environmental.length > 0 ? `
                                <div style="margin-top: 1rem; border-top: 1px solid var(--color-border); padding-top: 1rem;">
                                    <strong>📝 Decisiones Detalladas:</strong>
                                    <ul style="margin-top: 0.5rem;">
                                        ${gameState.decisions.environmental.map((dec, idx) => {
                                            const allDecisions = ENVIRONMENTAL_DECISIONS.decisions;
                                            const decision = allDecisions.find(d => d.id === dec.decisionId);
                                            const option = decision?.options.find(o => o.id === dec.option);
                                            const impactText = Object.entries(dec.impact || {})
                                                .map(([key, value]) => `${key}: ${value > 0 ? '+' : ''}${value}`)
                                                .join(', ');
                                            return `
                                                <li style="margin-bottom: 0.75rem;">
                                                    <strong>${decision?.title || 'Decisión ' + (idx + 1)}:</strong> 
                                                    ${dec.optionTitle || option?.title || 'Opción seleccionada'}
                                                    <br>
                                                    <small>Impacto: ${impactText || 'Sin impacto directo'}</small>
                                                </li>
                                            `;
                                        }).join('')}
                                    </ul>
                                </div>
                            ` : ''}
                        </div>
                    </div>

                    <!-- Fase Crisis -->
                    <div class="phase-summary crisis">
                        <div class="phase-summary-title">🚨 Fase Crisis</div>
                        <div class="phase-summary-content">
                            <ul>
                                <li>Estrategia ejecutada: ${gameState.decisions.crisis[0]?.selectedOptionTitle || 'No registrada'}</li>
                                <li>Justificación documentada: ${gameState.decisions.crisis[0]?.justification ? 'Sí' : 'No'}</li>
                            </ul>
                            ${gameState.decisions.crisis[0]?.selectedOptionImpact ? `
                                <div style="margin-top: 1rem; padding: 1rem; background: #f5f7fa; border-radius: 8px; border-left: 4px solid var(--color-crisis);">
                                    <strong>📉 Variables de impacto:</strong>
                                    <p style="margin-top: 0.5rem; color: var(--color-text); line-height: 1.6;">
                                        ${Object.entries(gameState.decisions.crisis[0].selectedOptionImpact)
                                            .map(([key, value]) => `${key}: ${value > 0 ? '+' : ''}${value}`)
                                            .join(', ')}
                                    </p>
                                </div>
                            ` : ''}
                            ${gameState.decisions.crisis[0]?.justification ? `
                                <div style="margin-top: 1rem; padding: 1rem; background: #f5f7fa; border-radius: 8px; border-left: 4px solid var(--color-crisis);">
                                    <strong>📝 Justificación de la Estrategia:</strong>
                                    <p style="margin-top: 0.5rem; color: var(--color-text); line-height: 1.6;">
                                        ${gameState.decisions.crisis[0].justification}
                                    </p>
                                </div>
                            ` : ''}
                        </div>
                    </div>
                </div>

                <!-- Eventos Ocurridos -->
                ${gameState.events.length > 0 ? `
                    <div class="report-section">
                        <h2 class="report-section-title">⚠️ Eventos Aleatorios Recibidos (${gameState.events.length})</h2>
                        <div class="events-list">
                            ${gameState.events.map((event, idx) => `
                                <div class="event-item">
                                    <div class="event-item-title">${idx + 1}. ${event.title}</div>
                                    <div class="event-item-response">
                                        ${gameState.eventResponses[idx] ? 
                                            `Opción: ${EVENTS_BANK.find(e => e.id === event.id)?.options.find(o => o.id === gameState.eventResponses[idx].selectedOption)?.title || 'N/A'}` 
                                            : 'Sin respuesta registrada'
                                        }
                                    </div>
                                </div>
                            `).join('')}
                        </div>
                    </div>
                ` : ''}

                <!-- Recomendaciones -->
                <div class="report-section">
                    <h2 class="report-section-title">💡 Recomendaciones Pedagógicas</h2>
                    <div class="recommendations">
                        <div class="recommendations-title">Para Mejorar en Futuros Proyectos:</div>
                        <ul>
                            ${generateRecommendations(totalScore, gameState)}
                        </ul>
                    </div>
                </div>

                <!-- Acciones -->
                <div class="report-actions">
                    <button class="btn btn-primary" onclick="window.print()">🖨️ Imprimir Informe</button>
                    <button class="btn btn-success" onclick="exportReportToPDF()">📥 Descargar PDF</button>
                    <button class="btn btn-secondary" onclick="startNewGame()">🔄 Juego Nuevo</button>
                </div>
            </div>
        </div>
    `;

    gameState.save();
}

function generateRecommendations(totalScore, state) {
    const recommendations = [];

    if (state.phaseScores.legal < 80) {
        recommendations.push('<li>Revise los requisitos legales aplicables. Algunos eran trampas innecesarias.</li>');
    }

    if (state.phaseScores.environmental < 80) {
        recommendations.push('<li>Balance mejor entre costo y sostenibilidad en decisiones ambientales.</li>');
    }

    if (state.phaseScores.crisis < 80) {
        recommendations.push('<li>La justificación de estrategias de crisis debe ser más robusta y coherente.</li>');
    }

    if (state.indicators.impact > 50) {
        recommendations.push('<li>Considere medidas más agresivas de mitigación ambiental desde el inicio.</li>');
    }

    if (state.indicators.community < 40) {
        recommendations.push('<li>Invierta más en programas de beneficio comunitario desde fases tempranas.</li>');
    }

    if (state.indicators.budget < 30) {
        recommendations.push('<li>Presupuesto muy bajo. Considere optimizar gastos en fases anteriores.</li>');
    }

    if (state.events.length > 5) {
        recommendations.push('<li>Demasiados eventos críticos. Sus errores incrementan la probabilidad de crisis.</li>');
    }

    if (recommendations.length === 0) {
        recommendations.push('<li>¡Excelente manejo del proyecto! Mantiene este estándar en futuros desafíos.</li>');
    }

    return recommendations.join('');
}

function exportReportToPDF() {
    const element = document.querySelector('.report-container');
    const memberNames = gameState.teamMembers && gameState.teamMembers.length > 0 ? gameState.teamMembers.map(m => m.name.split(' ')[0]).join('_') : 'Integrantes';
    const opt = {
        margin: 10,
        filename: `ECO-LEX-Grupo${gameState.groupNumber}-${memberNames}-Informe.pdf`,
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2 },
        jsPDF: { orientation: 'portrait', unit: 'mm', format: 'a4' }
    };
    html2pdf().set(opt).from(element).save();
}

function startNewGame() {
    gameState.clear();
    renderRegistrationScreen();
}

// FASE 1 - GESTIÓN LEGAL
function renderPhase1Screen() {
    const app = document.getElementById('app');

    gameState.currentPhase = 'legal';
    eventsEngine.changePhase('legal');

    const projectName = gameState.project.name;
    const requirements = getRequirementsForProject(gameState.project);
    const regulations = getApplicableRegulations(gameState.project);

    app.innerHTML = `
        <div class="screen">
            <div class="header legal">
                <div class="header-content">
                    <div class="header-title">
                        <h1>Fase 1: Gestión Legal</h1>
                        <p>Proyecto: ${projectName}</p>
                    </div>
                    <div class="header-info">
                        <div class="header-info-item">
                            <span class="phase-badge legal">LEGAL</span>
                        </div>
                    </div>
                </div>
            </div>

            <div class="main-content">
                <div class="container-sm">
                    <div class="alert alert-info">
                        <div class="alert-icon">ℹ️</div>
                        <div class="alert-content">
                            <div class="alert-title">Objetivo de Fase 1</div>
                            <p class="alert-message">
                                Construya un Memorial de Solicitud Legal completo. Debe seleccionar todos los requisitos 
                                obligatorios y normas aplicables para su proyecto, evitando trampas legales que no aplican.
                            </p>
                        </div>
                    </div>

                    <form id="legal-form">
                        <!-- Información de la empresa -->
                        <div class="section">
                            <div class="section-header">
                                <h2 class="section-title">📋 Información de la Empresa</h2>
                            </div>

                            <div class="form-group">
                                <label for="company-name">Nombre de la Empresa</label>
                                <input type="text" id="company-name" name="companyName" placeholder="Ej: Eco-Desarrollo Colombia S.A." required>
                            </div>

                            <div class="form-group">
                                <label for="company-nit">NIT (Número de Identificación Tributaria)</label>
                                <input type="text" id="company-nit" name="companyNIT" placeholder="Ej: 900123456-7" required>
                            </div>
                        </div>

                        <!-- Requisitos obligatorios -->
                        <div class="section">
                            <div class="section-header">
                                <h2 class="section-title">✅ Requisitos Obligatorios</h2>
                                <p class="section-description">Seleccione todos los requisitos que aplican a su proyecto</p>
                            </div>

                            <div class="checkbox-group" id="requirements-list">
                                <!-- Se llenará dinámicamente -->
                            </div>
                        </div>

                        <!-- Normas aplicables -->
                        <div class="section">
                            <div class="section-header">
                                <h2 class="section-title">⚖️ Normas Aplicables</h2>
                                <p class="section-description">Seleccione las normas colombianas que aplican a su proyecto</p>
                            </div>

                            <div class="checkbox-group" id="regulations-list">
                                <!-- Se llenará dinámicamente -->
                            </div>
                        </div>

                        <!-- Justificación de cumplimiento -->
                        <div class="section">
                            <div class="section-header">
                                <h2 class="section-title">📝 Justificación de Cumplimiento</h2>
                                <p class="section-description">Describa brevemente cómo su proyecto cumple con los requisitos y normas seleccionados</p>
                            </div>

                            <div class="form-group">
                                <label for="compliance-description">Descripción de Cumplimiento</label>
                                <textarea id="compliance-description" name="complianceDescription" 
                                    placeholder="Explique cómo su empresa cumple con los requisitos legales..." required></textarea>
                            </div>
                        </div>

                        <!-- Mensajes de error -->
                        <div id="error-messages"></div>

                        <!-- Botones -->
                        <div style="display: flex; gap: 1rem; margin-top: 2rem;">
                            <button type="submit" class="btn btn-primary btn-lg">Validar Solicitud Legal</button>
                            <button type="button" class="btn btn-secondary btn-lg" onclick="goToPreviousScreen()">Atrás</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    `;

    // Llenar requisitos
    const requirementsList = document.getElementById('requirements-list');
    requirements.forEach(req => {
        const div = document.createElement('div');
        div.className = 'checkbox-item';
        div.innerHTML = `
            <input type="checkbox" id="req-${req.id}" name="requirements" value="${req.id}">
            <label class="checkbox-label" for="req-${req.id}">
                <strong>${req.name}</strong><br>
                <small>${req.description}</small>
            </label>
        `;
        requirementsList.appendChild(div);
    });

    // Llenar normas
    const regulationsList = document.getElementById('regulations-list');
    regulations.forEach(reg => {
        const div = document.createElement('div');
        div.className = 'checkbox-item';
        div.innerHTML = `
            <input type="checkbox" id="reg-${reg.id}" name="regulations" value="${reg.id}">
            <label class="checkbox-label" for="reg-${reg.id}">
                <strong>${reg.name}</strong><br>
                <small>${reg.description}</small>
            </label>
        `;
        regulationsList.appendChild(div);
    });

    // Manejo del formulario
    const form = document.getElementById('legal-form');
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        validateLegalForm(requirements, regulations);
    });

    // Iniciar motor de eventos
    eventsEngine.setEventCallback(showEventModal);
    eventsEngine.start('legal');

    gameState.save();
}

function validateLegalForm(requirements, regulations) {
    const companyName = document.getElementById('company-name').value;
    const companyNIT = document.getElementById('company-nit').value;
    const complianceDescription = document.getElementById('compliance-description').value;

    const selectedRequirements = Array.from(document.querySelectorAll('input[name="requirements"]:checked'))
        .map(el => el.value);
    const selectedRegulations = Array.from(document.querySelectorAll('input[name="regulations"]:checked'))
        .map(el => el.value);

    const errors = [];
    gameState.legalErrors = [];

    // Validar información de empresa
    if (!companyName || companyName.trim().length < 3) {
        errors.push('Nombre de empresa inválido');
        gameState.legalErrors.push('Nombre de empresa inválido');
    }

    if (!companyNIT || companyNIT.trim().length < 5) {
        errors.push('NIT inválido o incompleto');
        gameState.legalErrors.push('NIT inválido o incompleto');
    }

    // Validar requisitos
    const validation = validateRequirements(selectedRequirements, gameState.project);
    if (!validation.isComplete) {
        validation.missing.forEach(missing => {
            const req = requirements.find(r => r.id === missing);
            errors.push(`Falta requisito obligatorio: ${req.name}`);
            gameState.legalErrors.push(`Falta requisito obligatorio: ${req.name}`);
        });
    }

    if (validation.hasUnneeded) {
        validation.unnecessary.forEach(unnecessary => {
            errors.push(`Requisito innecesario seleccionado: ${unnecessary}`);
            gameState.legalErrors.push(`Requisito innecesario seleccionado: ${unnecessary}`);
        });
    }

    // Validar descripción de cumplimiento
    if (!complianceDescription || complianceDescription.trim().length < 50) {
        errors.push('Descripción de cumplimiento muy corta (mínimo 50 caracteres)');
        gameState.legalErrors.push('Descripción de cumplimiento muy corta (mínimo 50 caracteres)');
    }

    // Mostrar errores
    const errorContainer = document.getElementById('error-messages');
    if (errors.length > 0) {
        errorContainer.innerHTML = `
            <div class="alert alert-error">
                <div class="alert-icon">❌</div>
                <div class="alert-content">
                    <div class="alert-title">Errores en la Solicitud</div>
                    <ul style="margin-left: 1rem; margin-top: 0.5rem;">
                        ${errors.map(e => `<li>${e}</li>`).join('')}
                    </ul>
                </div>
            </div>
        `;

        gameState.legalValidationAttempts++;

        // Penalización de puntaje por intento adicional
        if (gameState.legalValidationAttempts > 1) {
            gameState.setPhaseScore('legal', Math.max(0, 100 - (gameState.legalValidationAttempts * 10)));
        }

        // Mayor probabilidad de evento aleatorio
        if (gameState.legalValidationAttempts > 2) {
            setTimeout(() => {
                eventsEngine.triggerRandomEvent();
            }, 2000);
        }

        gameState.save();
        return;
    }

    // Si todo está correcto
    errorContainer.innerHTML = `
        <div class="alert alert-success">
            <div class="alert-icon">✅</div>
            <div class="alert-content">
                <div class="alert-title">¡Solicitud Legal Validada!</div>
                <p class="alert-message">Su Memorial de Solicitud Legal ha sido aprobado. Se ha otorgado el Sello Legal del CNLT.</p>
            </div>
        </div>
    `;

    // Calcular puntaje
    let score = 100;
    if (gameState.legalValidationAttempts > 0) {
        score -= gameState.legalValidationAttempts * 10;
    }
    gameState.setPhaseScore('legal', Math.max(50, score));

    // Registrar decisión
    gameState.addLegalDecision({
        companyName,
        companyNIT,
        requirements: selectedRequirements,
        regulations: selectedRegulations,
        complianceDescription,
        attempts: gameState.legalValidationAttempts
    });

    gameState.save();

    // Transición a siguiente fase
    setTimeout(() => {
        eventsEngine.stop();
        renderProjectAssignmentScreen(); // Mostrar proyecto asignado
        setTimeout(() => {
            renderPhase2Screen();
        }, 2000);
    }, 2000);
}

function goToPreviousScreen() {
    eventsEngine.stop();
    renderProjectAssignmentScreen();
}

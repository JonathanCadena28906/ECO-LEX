// GESTIÓN DE ESTADO GLOBAL DEL JUEGO - Versión 2.0 con Unidades Reales
class GameState {
    constructor() {
        this.reset();
    }

    reset() {
        this.screen = 'registration';
        this.groupNumber = null;
        this.teamMembers = [];
        this.project = null;
        this.currentPhase = null;
        this.phaseScores = {
            legal: 0,
            environmental: 0,
            crisis: 0
        };
        this.decisions = {
            legal: [],
            environmental: [],
            crisis: []
        };
        
        // INDICADORES EN UNIDADES REALES
        this.indicators = {
            water: 100,        // m³/seg (0-150)
            land: 100,         // Ha preservadas (0-150)
            budget: 100,       // % del presupuesto disponible
            impact: 0,         // tCO2e (0-300, más alto = más daño)
            community: 50      // % de aceptación social
        };
        
        // Almacena unidades de indicadores
        this.indicatorUnits = {
            water: 'm³/s',
            land: 'Ha',
            budget: '%',
            impact: 'tCO2e',
            community: '%'
        };
        
        // Recursos iniciales del proyecto
        this.projectResources = {
            waterMax: 100,
            landMax: 100,
            budgetMax: 1000,   // En millones
            impactMax: 300,
            communityTarget: 50
        };
        
        this.events = [];
        this.eventResponses = [];
        this.openAnswers = {
            legalDefinition: '',
            environmentalDefinition: ''
        };
        this.legalValidationAttempts = 0;
        this.legalErrors = [];
        this.startTime = null;
        this.endTime = null;
        this.finalResult = null;
        this.concessionDaysRemaining = 60;
        this.elapsedSeconds = 0;
    }

    setGroupInfo(groupNumber, teamMembers) {
        this.groupNumber = groupNumber;
        this.teamMembers = teamMembers;
    }

    setProject(project) {
        this.project = project;
        this.projectResources = {
            waterMax: project.resources.water || 100,
            landMax: project.resources.land || 100,
            budgetMax: project.resources.budget || 1000,
            impactMax: 300,
            communityTarget: project.resources.community || 50
        };

        // Los indicadores se manejan como porcentajes para que los impactos se sumen de forma consistente.
        this.indicators.water = 100;
        this.indicators.land = 100;
        this.indicators.budget = 100;
        this.indicators.impact = 0;
        this.indicators.community = project.resources.community || 50;

        this.setHUDVisibility(true);
        this.updateHUD();
    }

    setHUDVisibility(visible) {
        const hudTop = document.getElementById('hud-top');
        if (!hudTop) return;

        hudTop.classList.toggle('hidden', !visible);
        document.body.classList.toggle('hud-hidden', !visible);
    }

    getProjectHUDLabels() {
        const byProject = {
            litio: {
                water: '💧 AGUA DE SALMUERA',
                land: '🌍 ZONA DE EXTRACCIÓN',
                budget: '💰 INVERSIÓN MINERA',
                impact: '🌿 HUELLA EXTRACTIVA',
                community: '🤝 RELACIÓN TERRITORIAL'
            },
            amazon: {
                water: '💧 CUENCA DISPONIBLE',
                land: '🌍 COBERTURA BOSCOSA',
                budget: '💰 INVERSIÓN LOGÍSTICA',
                impact: '🌿 PRESIÓN ECOLÓGICA',
                community: '🤝 LICENCIA SOCIAL'
            },
            hydro: {
                water: '💧 CAUDAL GESTIONADO',
                land: '🌍 ÁREA AFECTADA',
                budget: '💰 CAPEX ENERGÉTICO',
                impact: '🌿 HUELLA DE REPRESA',
                community: '🤝 ACEPTACIÓN LOCAL'
            },
            skyCity: {
                water: '💧 CONSUMO TURÍSTICO',
                land: '🌍 ÁREA DE HÁBITAT',
                budget: '💰 INVERSIÓN URBANA',
                impact: '🌿 IMPACTO EN HUMEDAL',
                community: '🤝 PERCEPCIÓN CIUDADANA'
            },
            agroChemical: {
                water: '💧 AGUA AGRÍCOLA',
                land: '🌍 SUELO PRODUCTIVO',
                budget: '💰 OPERACIÓN AGRO',
                impact: '🌿 RIESGO QUÍMICO',
                community: '🤝 CONFIANZA RURAL'
            }
        };

        return byProject[this.project?.id] || {
            water: '💧 AGUA',
            land: '🌍 SUELO',
            budget: '💰 PRESUPUESTO',
            impact: '🌿 IMPACTO',
            community: '🤝 COMUNIDAD'
        };
    }

    // Convertir valores porcentuales a unidades reales
    getIndicatorValue(key) {
        const percentage = this.indicators[key];
        
        switch(key) {
            case 'water':
                return Math.round((percentage / 100) * this.projectResources.waterMax);
            case 'land':
                return Math.round((percentage / 100) * this.projectResources.landMax);
            case 'budget':
                return Math.round((percentage / 100) * this.projectResources.budgetMax);
            case 'impact':
                return Math.round((percentage / 100) * this.projectResources.impactMax);
            case 'community':
                return percentage;
            default:
                return percentage;
        }
    }

    // Obtener formato de visualización para el HUD
    getHUDDisplay(key) {
        const value = this.getIndicatorValue(key);
        
        switch(key) {
            case 'water':
                return `${value} unidades`;
            case 'land':
                return `${value} unidades`;
            case 'budget':
                return `$${value}K`;
            case 'impact':
                return `${value} tCO2e`;
            case 'community':
                this.getCommunityEmoji(value);
                return `${value}%`;
            default:
                return value;
        }
    }

    // Emoji del estado social
    getCommunityEmoji(value) {
        if (value > 70) return '😊';
        if (value > 50) return '😐';
        if (value > 30) return '😠';
        return '😡';
    }

    addLegalDecision(decision) {
        this.decisions.legal.push(decision);
    }

    addEnvironmentalDecision(decisionId, option) {
        this.decisions.environmental.push({
            decisionId,
            option: typeof option === 'string' ? option : option.id,
            optionTitle: typeof option === 'string' ? '' : option.title,
            impact: typeof option === 'string' ? {} : (option.impact || {})
        });
    }

    addCrisisDecision(decision) {
        this.decisions.crisis.push({
            crisisId: decision.crisisId,
            selectedOptionId: decision.selectedOptionId,
            selectedOptionTitle: decision.selectedOptionTitle,
            selectedOptionImpact: decision.selectedOptionImpact || {},
            justification: decision.justification
        });
    }

    // Guardar respuestas abiertas
    setOpenAnswer(type, text) {
        this.openAnswers[type] = text;
    }

    addEvent(event) {
        this.events.push({
            id: event.id,
            title: event.title,
            timestamp: new Date(),
            phase: this.currentPhase
        });
    }

    addEventResponse(eventId, selectedOption, autoResolved = false) {
        this.eventResponses.push({
            eventId,
            selectedOption,
            autoResolved,
            timestamp: new Date()
        });
    }

    updateIndicators(impacts) {
        for (let [key, value] of Object.entries(impacts)) {
            if (this.indicators.hasOwnProperty(key)) {
                this.indicators[key] = Math.max(0, Math.min(100, this.indicators[key] + value));
            }
        }
        this.updateHUD();
    }

    // Actualizar HUD en tiempo real
    updateHUD() {
        if (!this.project) {
            this.setHUDVisibility(false);
            return;
        }

        this.setHUDVisibility(true);

        const labels = this.getProjectHUDLabels();
        document.getElementById('hud-label-water').textContent = labels.water;
        document.getElementById('hud-label-land').textContent = labels.land;
        document.getElementById('hud-label-budget').textContent = labels.budget;
        document.getElementById('hud-label-impact').textContent = labels.impact;
        document.getElementById('hud-label-community').textContent = labels.community;

        const projectName = document.getElementById('hud-project-name');
        const projectContext = document.getElementById('hud-project-context');
        if (projectName) projectName.textContent = `Proyecto: ${this.project.name}`;
        if (projectContext) projectContext.textContent = this.project.challenge || this.project.description || '';

        document.getElementById('hud-water').textContent = this.getHUDDisplay('water');
        document.getElementById('hud-land').textContent = this.getHUDDisplay('land');
        document.getElementById('hud-budget').textContent = this.getHUDDisplay('budget');
        document.getElementById('hud-impact').textContent = this.getHUDDisplay('impact');
        document.getElementById('hud-community').textContent = this.getHUDDisplay('community');
        
        // Alerta si indicador está en crítico
        this.checkCriticalIndicators();
    }

    // Verificar indicadores críticos y cambiar HUD
    checkCriticalIndicators() {
        if (this.indicators.water < 20 || this.indicators.budget < 20 || 
            this.indicators.land < 10 || this.indicators.impact > 80 || 
            this.indicators.community < 30) {
            document.getElementById('hud-top').classList.add('critical');
        } else {
            document.getElementById('hud-top').classList.remove('critical');
        }
    }

    // Decrementar tiempo de concesión
    decrementDays() {
        if (this.concessionDaysRemaining > 0) {
            this.concessionDaysRemaining--;
            document.getElementById('hud-timer').textContent = 
                `⏱️ ${this.concessionDaysRemaining} DÍAS`;
            
            if (this.concessionDaysRemaining <= 10) {
                document.getElementById('hud-timer').classList.add('critical');
            }
        }
    }

    setPhaseScore(phase, score) {
        this.phaseScores[phase] = score;
    }

    setFinalResult(result) {
        this.finalResult = result;
        this.endTime = new Date();
    }

    calculateTotalScore() {
        const sum = Object.values(this.phaseScores).reduce((a, b) => a + b, 0);
        return Math.round(sum / 3);
    }

    toJSON() {
        return {
            groupNumber: this.groupNumber,
            teamMembers: this.teamMembers,
            project: this.project,
            phaseScores: this.phaseScores,
            decisions: this.decisions,
            indicators: this.indicators,
            events: this.events,
            eventResponses: this.eventResponses,
            openAnswers: this.openAnswers,
            totalScore: this.calculateTotalScore(),
            finalResult: this.finalResult
        };
    }

    // LocalStorage persistence
    save() {
        localStorage.setItem('eco-lex-state', JSON.stringify(this.toJSON()));
    }

    load() {
        const saved = localStorage.getItem('eco-lex-state');
        if (saved) {
            const data = JSON.parse(saved);
            Object.assign(this, data);
            return true;
        }
        return false;
    }

    clear() {
        localStorage.removeItem('eco-lex-state');
        this.reset();
    }
}

// Instancia global del estado
const gameState = new GameState();

// GESTIÓN DE ESTADO GLOBAL DEL JUEGO - Versión 3.0 con Unidades Reales
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
            water: 100,
            land: 100,
            budget: 100,
            impact: 0,
            community: 50
        };
        
        // Máximos de referencia para la barra de progreso
        this.indicatorMax = {
            water: 100,
            land: 100,
            budget: 100,
            impact: 300,
            community: 100
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

        // Inicializar indicadores con los valores REALES del proyecto
        const res = project.resources || {};
        this.indicators.water     = res.water    || 0;
        this.indicators.land      = res.land     || 0;
        this.indicators.budget    = res.budget   || 0;
        this.indicators.impact    = 0;
        this.indicators.community = res.community || 0;

        // Máximos = valores iniciales del proyecto
        this.indicatorMax.water     = res.water    || 100;
        this.indicatorMax.land      = res.land     || 100;
        this.indicatorMax.budget    = res.budget   || 1000000000;
        this.indicatorMax.impact    = res.impactMax || 300;
        this.indicatorMax.community = 100;

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

    // ── Formatear valor real para el HUD ─────────────────────────────────────
    _formatValue(key, value) {
        const v = Math.round(value);
        switch (key) {
            case 'budget': {
                const av = Math.abs(v);
                const sign = v < 0 ? '-' : '';
                if (av >= 1_000_000_000_000) {
                    // Billón (escala larga colombiana) = 10^12
                    const b = av / 1_000_000_000_000;
                    return `${sign}$${b % 1 === 0 ? b : b.toFixed(1)} Bill.`;
                }
                if (av >= 1_000_000_000) {
                    // Mil millones — convención financiera colombiana: "MM"
                    const mm = av / 1_000_000_000;
                    return `${sign}$${mm % 1 === 0 ? mm : mm.toFixed(1)} MM`;
                }
                if (av >= 1_000_000) {
                    // Millones
                    const m = av / 1_000_000;
                    return `${sign}$${m % 1 === 0 ? m : m.toFixed(1)} M`;
                }
                if (av >= 1_000) {
                    const k = av / 1_000;
                    return `${sign}$${k % 1 === 0 ? k : k.toFixed(1)} K`;
                }
                return `${sign}$${av.toLocaleString('es-CO')}`;
            }

            case 'water':
                return `${v.toLocaleString()} m³/s`;
            case 'land':
                return `${v.toLocaleString()} Ha`;
            case 'impact':
                return `${v.toLocaleString()} tCO₂e`;
            case 'community':
                return `${this.getCommunityEmoji(v)} ${v}%`;
            default:
                return `${v}`;
        }
    }

    // ── % de llenado para la mini barra (0-100) ───────────────────────────────
    _barFillPct(key) {
        const val = this.indicators[key];
        const max = this.indicatorMax[key] || 1;
        return Math.max(0, Math.min(100, (val / max) * 100));
    }

    // ── Genera HTML de barra mini + valor para el HUD ─────────────────────────
    _hudBar(key) {
        const fill      = this._barFillPct(key);
        const isInverse = (key === 'impact'); // más daño = peor
        let color;
        if (isInverse) {
            color = fill < 30 ? '#4ade80' : fill < 60 ? '#facc15' : '#f87171';
        } else {
            color = fill > 60 ? '#4ade80' : fill > 30 ? '#facc15' : '#f87171';
        }
        const display = this._formatValue(key, this.indicators[key]);
        return `<span class="hud-val-text">${display}</span>
<span class="hud-mini-bar" style="--bar-fill:${fill}%;--bar-color:${color};"></span>`;
    }

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

    // ── Actualizar indicadores con valores REALES ─────────────────────────────
    // Los impactos en environmental.js / events.js deben estar en las mismas
    // unidades reales que los indicadores (pesos, m³/s, Ha, tCO₂e, %).
    updateIndicators(impacts) {
        for (let [key, value] of Object.entries(impacts)) {
            if (this.indicators.hasOwnProperty(key)) {
                const newVal = this.indicators[key] + value;
                if (key === 'community') {
                    this.indicators[key] = Math.max(0, Math.min(100, newVal));
                } else if (key === 'impact') {
                    this.indicators[key] = Math.max(0, Math.min(this.indicatorMax[key], newVal));
                } else {
                    this.indicators[key] = Math.max(0, newVal);
                }
            }
        }
        this.updateHUD();
    }

    // ── Actualizar HUD en tiempo real ─────────────────────────────────────────
    updateHUD() {
        if (!this.project) {
            this.setHUDVisibility(false);
            return;
        }

        this.setHUDVisibility(true);

        const labels = this.getProjectHUDLabels();
        document.getElementById('hud-label-water').textContent     = labels.water;
        document.getElementById('hud-label-land').textContent      = labels.land;
        document.getElementById('hud-label-budget').textContent    = labels.budget;
        document.getElementById('hud-label-impact').textContent    = labels.impact;
        document.getElementById('hud-label-community').textContent = labels.community;

        const projectName    = document.getElementById('hud-project-name');
        const projectContext = document.getElementById('hud-project-context');
        if (projectName)    projectName.textContent    = `Proyecto: ${this.project.name}`;
        if (projectContext) projectContext.textContent = this.project.challenge || this.project.description || '';

        document.getElementById('hud-water').innerHTML     = this._hudBar('water');
        document.getElementById('hud-land').innerHTML      = this._hudBar('land');
        document.getElementById('hud-budget').innerHTML    = this._hudBar('budget');
        document.getElementById('hud-impact').innerHTML    = this._hudBar('impact');
        document.getElementById('hud-community').innerHTML = this._hudBar('community');

        this.checkCriticalIndicators();
    }

    checkCriticalIndicators() {
        const wPct = (this.indicators.water  / (this.indicatorMax.water  || 1)) * 100;
        const bPct = (this.indicators.budget / (this.indicatorMax.budget || 1)) * 100;
        const lPct = (this.indicators.land   / (this.indicatorMax.land   || 1)) * 100;
        const iPct = (this.indicators.impact / (this.indicatorMax.impact || 1)) * 100;

        const isCritical = wPct < 20 || bPct < 20 || lPct < 10 ||
                           iPct > 80 || this.indicators.community < 30;

        document.getElementById('hud-top').classList.toggle('critical', isCritical);
    }

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
            indicatorMax: this.indicatorMax,
            events: this.events,
            eventResponses: this.eventResponses,
            openAnswers: this.openAnswers,
            totalScore: this.calculateTotalScore(),
            finalResult: this.finalResult
        };
    }

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
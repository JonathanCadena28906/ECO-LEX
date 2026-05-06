// GESTIÓN DE ESTADO GLOBAL DEL JUEGO
class GameState {
    constructor() {
        this.reset();
    }

    reset() {
        this.screen = 'registration'; // registration, intro, project-assignment, phase1, phase2, phase3, report
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
        this.indicators = {
            water: 100,
            land: 100,
            budget: 100,
            impact: 0,
            community: 50
        };
        this.events = [];
        this.eventResponses = [];
        this.legalValidationAttempts = 0;
        this.legalErrors = [];
        this.startTime = null;
        this.endTime = null;
        this.finalResult = null;
    }

    setGroupInfo(groupNumber, teamMembers) {
        this.groupNumber = groupNumber;
        this.teamMembers = teamMembers;
    }

    setProject(project) {
        this.project = project;
        // Inicializar indicadores basados en recursos del proyecto
        this.indicators.water = project.resources.water;
        this.indicators.land = project.resources.land;
        this.indicators.budget = project.resources.budget;
        this.indicators.community = project.resources.community;
    }

    addLegalDecision(decision) {
        this.decisions.legal.push(decision);
    }

    addEnvironmentalDecision(decisionId, option) {
        this.decisions.environmental.push({ decisionId, option });
    }

    addCrisisDecision(decision) {
        this.decisions.crisis.push(decision);
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

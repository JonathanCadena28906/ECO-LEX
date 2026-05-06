// MOTOR DE EVENTOS ALEATORIOS
class EventsEngine {
    constructor() {
        this.timerId = null;
        this.isActive = false;
        this.minInterval = 60000; // 1 minuto mínimo
        this.maxInterval = 180000; // 3 minutos máximo
        this.currentPhase = null;
        this.onEventTriggered = null;
        this.eventQueue = [];
    }

    start(phase) {
        if (this.isActive) return;
        this.currentPhase = phase;
        this.isActive = true;
        this.scheduleNextEvent();
    }

    stop() {
        if (this.timerId) clearTimeout(this.timerId);
        this.isActive = false;
        this.currentPhase = null;
    }

    scheduleNextEvent() {
        if (!this.isActive) return;

        const delay = Math.random() * (this.maxInterval - this.minInterval) + this.minInterval;
        this.timerId = setTimeout(() => {
            this.triggerRandomEvent();
            this.scheduleNextEvent();
        }, delay);
    }

    triggerRandomEvent() {
        if (!this.isActive || !this.currentPhase) return;

        const event = getRandomEvent(this.currentPhase);
        if (event) {
            // Crear copia del evento
            const eventCopy = JSON.parse(JSON.stringify(event));
            gameState.addEvent(eventCopy);

            if (this.onEventTriggered) {
                this.onEventTriggered(eventCopy);
            }
        }
    }

    changePhase(newPhase) {
        this.currentPhase = newPhase;
    }

    setEventCallback(callback) {
        this.onEventTriggered = callback;
    }

    addEventToQueue(event) {
        this.eventQueue.push(event);
    }

    getNextQueuedEvent() {
        return this.eventQueue.shift();
    }

    hasQueuedEvents() {
        return this.eventQueue.length > 0;
    }
}

// Instancia global del motor de eventos
const eventsEngine = new EventsEngine();

// Modal para mostrar eventos
function showEventModal(event) {
    const modal = document.getElementById('event-modal');
    const title = document.getElementById('event-title');
    const description = document.getElementById('event-description');
    const optionsContainer = document.getElementById('event-options');

    // Limpiar opciones previas
    optionsContainer.innerHTML = '';

    // Llenar contenido del evento
    title.textContent = event.title;
    description.textContent = event.description;

    // Crear botones de opciones
    let selectedOptionId = null;

    event.options.forEach((option, index) => {
        const optionDiv = document.createElement('div');
        optionDiv.className = 'event-option';
        optionDiv.innerHTML = `
            <div class="event-option-title">${option.title}</div>
            <div class="event-option-description">${option.description}</div>
        `;

        optionDiv.addEventListener('click', () => {
            document.querySelectorAll('.event-option').forEach(el => el.classList.remove('selected'));
            optionDiv.classList.add('selected');
            selectedOptionId = option.id;
        });

        optionsContainer.appendChild(optionDiv);
    });

    // Mostrar modal
    modal.classList.remove('hidden');

    // Timer para respuesta automática
    const timerElement = document.getElementById('event-timer');
    const timerText = document.getElementById('timer-text');
    let timeLeft = 60; // 60 segundos

    const timerInterval = setInterval(() => {
        timeLeft--;
        const percentage = (timeLeft / 60) * 100;
        timerElement.style.width = percentage + '%';
        timerText.textContent = timeLeft + 's';

        if (timeLeft <= 0) {
            clearInterval(timerInterval);
            // Resolver automáticamente con la opción más severa
            resolveEventModal(event, null, true);
        }
    }, 1000);

    // Crear botón de confirmar
    const confirmBtn = document.createElement('button');
    confirmBtn.className = 'btn btn-primary btn-block';
    confirmBtn.textContent = 'Confirmar Respuesta';
    confirmBtn.addEventListener('click', () => {
        clearInterval(timerInterval);
        if (selectedOptionId) {
            const selectedOption = event.options.find(opt => opt.id === selectedOptionId);
            resolveEventModal(event, selectedOption, false);
        }
    });

    optionsContainer.appendChild(confirmBtn);
}

function resolveEventModal(event, selectedOption, autoResolved) {
    const modal = document.getElementById('event-modal');
    modal.classList.add('hidden');

    // Si no seleccionó nada, usar la opción más severa
    if (!selectedOption) {
        selectedOption = event.options[event.options.length - 1];
    }

    // Registrar respuesta
    gameState.addEventResponse(event.id, selectedOption.id, autoResolved);

    // Aplicar consecuencias
    if (selectedOption.consequence) {
        const impacts = {};
        if (selectedOption.consequence.resources) {
            if (selectedOption.consequence.resources.water)
                impacts.water = selectedOption.consequence.resources.water;
            if (selectedOption.consequence.resources.budget)
                impacts.budget = selectedOption.consequence.resources.budget;
            if (selectedOption.consequence.resources.land)
                impacts.land = selectedOption.consequence.resources.land;
            if (selectedOption.consequence.resources.community)
                impacts.community = selectedOption.consequence.resources.community;
        }
        gameState.updateIndicators(impacts);
    }

    // Guardar estado
    gameState.save();
}

function hideEventModal() {
    const modal = document.getElementById('event-modal');
    modal.classList.add('hidden');
}

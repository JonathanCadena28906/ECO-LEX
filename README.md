# 🌱 ECO-LEX - Juego Educativo

Un juego educativo que simula la aprobación de proyectos de infraestructura en Colombia. Los jugadores navegan 3 fases: **legal**, **ambiental** y **crisis**, tomando decisiones que impactan indicadores de presupuesto, agua, suelo, comunidad e impacto ambiental.

## 🎮 ¿Cómo Jugar?

1. **Registro:** Ingrese grupo (1-6) e integrantes
2. **Introducción:** Entienda gestión legal y ambiental
3. **Asignación:** Reciba un proyecto según su grupo
4. **Fase Legal (Azul):** Cumpia requisitos normativos
5. **Fase Ambiental (Verde):** Tome decisiones sostenibles
6. **Fase Crisis (Rojo):** Responda crisis inesperada
7. **Informe:** Vea puntaje final y clasificación

**Proyectos Disponibles:**
- Litio-Explor 
- Amazon-Gate 
- Hidro-Vida 
- Sky-City 
- Agro-Química 

## 📁 Estructura

```
ECO-LEX/
├── index.html
├── css/
│   ├── main.css
│   ├── components.css
│   └── report.css
├── js/
│   ├── main.js
│   ├── state.js
│   ├── env.js (CONFIGURACIÓN)
│   ├── events-engine.js
│   ├── resource-validator.js
│   ├── dashboard-engine.js
│   ├── report.js
│   ├── data/
│   │   ├── projects.js
│   │   ├── events.js
│   │   ├── legal.js
│   │   └── environmental.js
│   └── phases/
│       ├── phase1.js
│       ├── phase2.js
│       └── phase3.js
└── README.md
```

## ⚙️ Configuración: env.js

El archivo `js/env.js` contiene la configuración de equipos para cada grupo. Debe definir:

```javascript
const GROUP_ROSTERS = {
    1: [
        { name: "Nombre 1", role: "Líder Legal" },
        { name: "Nombre 2", role: "Asesor Ambiental" },
        { name: "Nombre 3", role: "Gestor Comunitario" }
    ],
    2: [ /* ... */ ],
    3: [ /* ... */ ],
    5: [ /* ... */ ],
    6: [ /* ... */ ]
};
```

**Roles automáticos según cantidad de integrantes:**
- 1 persona: Gerente General
- 2 personas: Líder Legal, Asesor Ambiental
- 3 personas: Líder Legal, Asesor Ambiental, Gestor Comunitario

## 🚀 Ejecución

### Local (Recomendado)
```bash
# Python 3
python -m http.server 8000

# Node.js
npx http-server
```
Abra: `http://localhost:8000`

### GitHub Pages
1. Suba repositorio a GitHub
2. Settings → Pages → Source: main / (root)
3. URL: `https://[usuario].github.io/eco-lex`

## 📊 Indicadores del Juego

- **💰 Presupuesto:** Dinero disponible
- **💧 Agua:** Recurso hídrico
- **🌍 Suelo:** Uso de tierra
- **🌿 Impacto:** Sostenibilidad ambiental
- **🤝 Comunidad:** Aprobación social

## 🎯 Clasificación Final

| Puntaje | Estado |
|---------|--------|
| 85-100 | 🥇 Oro |
| 70-84 | 🟢 Viable |
| 55-69 | 🟡 Observación |
| 40-54 | 🔴 Sancionado |
| < 40 | ⚫ Revocado |

## 💻 Tecnología

- HTML5 + CSS3 + JavaScript ES6
- LocalStorage para persistencia
- Sin dependencias externas
- Totalmente estática

---

**Versión:** 1.0   
**Última actualización:** 06 de Mayo 2026

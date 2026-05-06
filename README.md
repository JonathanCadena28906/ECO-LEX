# 🌱 ECO-LEX - Juego Educativo de Gestión de Proyectos

Juego educativo interactivo basado en navegador que simula el ciclo completo de aprobación de un proyecto de infraestructura en Colombia. Los jugadores deben navegar simultáneamente la rigidez del cumplimiento legal y la flexibilidad de la gestión ambiental, mientras enfrentan eventos aleatorios que interrumpen el flujo normal.

## 🎮 Características Principales

### Pantallas del Juego

1. **Pantalla 0 - Registro del Grupo**
   - Selección de grupo (1-6)
   - Ingreso de integrantes (1-3)
   - Asignación automática de roles según cantidad

2. **Pantalla 1 - Introducción Educativa**
   - Definiciones de Gestión Legal
   - Definiciones de Gestión Ambiental
   - Contexto normativo colombiano

3. **Pantalla 2 - Asignación del Proyecto**
   - Asignación según grupo
   - 5 proyectos diferentes:
     - Litio-Explor (Grupo 1)
     - Amazon-Gate (Grupo 2)
     - Hidro-Vida (Grupo 3)
     - Sky-City (Grupo 5)
     - Agro-Química (Grupo 6)

4. **Fase 1 - Gestión Legal (Azul)**
   - Memorial de Solicitud Legal
   - Selección de requisitos obligatorios
   - Selección de normas aplicables
   - Validación de cumplimiento

5. **Fase 2 - Gestión Ambiental (Verde)**
   - 7 decisiones estratégicas
   - Indicadores en tiempo real:
     - 💧 Agua Disponible
     - 🌍 Uso de Suelo
     - 💰 Presupuesto
     - 🌿 Impacto Ambiental
     - 🤝 Aprobación Comunitaria
   - Evaluación de viabilidad ambiental

6. **Fase 3 - Gestión de Crisis (Rojo)**
   - Crisis principal aleatoria
   - Selección de estrategia de respuesta
   - Justificación de decisión
   - Evaluación de coherencia

7. **Pantalla Final - Informe**
   - Clasificación final (Oro, Viable, Observación, Sancionado, Revocado)
   - Puntajes por fase
   - Resumen de decisiones
   - Eventos registrados
   - Recomendaciones pedagógicas
   - Exportación a PDF e impresión

## 🎯 Motor de Eventos Aleatorios

- Dispara automáticamente cada 1-3 minutos
- 13+ eventos diferentes con 2-3 opciones cada uno
- Categorías:
  - Nuevas regulaciones legales
  - Problemas comunitarios
  - Eventos ambientales
  - Cambios institucionales
  - Crisis mayores

- Consecuencias dinámicas en indicadores
- Resolución automática si no responde en tiempo

## 🎓 Pedagogía

### Pensamiento de Rompecabezas (Legal)
- Respuestas correctas/incorrectas claras
- Requisitos exactos
- Validación lógica

### Pensamiento de Colcha (Ambiental)
- Sin respuestas únicas correctas
- Decisiones con trade-offs
- Múltiples equilibrios posibles

### Gestión de Crisis
- Coherencia entre decisión y justificación
- Impacto del estado anterior
- Presión de tiempo

## 💻 Estructura Técnica

### Arquitectura
- **Tipo:** SPA (Single Page Application) completamente estática
- **Tecnologías:** HTML5 + CSS3 + JavaScript ES6
- **Almacenamiento:** LocalStorage para persistencia
- **Dependencias:** Mínimas (solo html2pdf para PDF)

### Estructura de Archivos

```
eco-lex/
├── index.html                   # Punto de entrada
├── css/
│   ├── main.css                 # Estilos globales
│   ├── components.css           # Componentes reutilizables
│   └── report.css               # Estilos del informe
├── js/
│   ├── main.js                  # Controlador principal
│   ├── state.js                 # Gestión de estado global
│   ├── events-engine.js         # Motor de eventos aleatorios
│   ├── report.js                # Generación de informe
│   ├── data/
│   │   ├── projects.js          # Definición de 5 proyectos
│   │   ├── events.js            # Banco de 13+ eventos
│   │   ├── legal.js             # Requisitos y normas legales
│   │   └── environmental.js     # Decisiones ambientales
│   └── phases/
│       ├── phase1.js            # Fase Legal
│       ├── phase2.js            # Fase Ambiental
│       └── phase3.js            # Fase Crisis
├── assets/
│   └── icons/                   # Iconos SVG (preparado)
└── README.md                    # Este archivo
```

## 🚀 Despliegue

### Opción 1: GitHub Pages (Recomendado)

1. Crear repositorio público `eco-lex`
2. Subir archivos manteniendo estructura
3. Settings → Pages → Source: main / (root)
4. URL automática: `https://[usuario].github.io/eco-lex`

### Opción 2: Netlify

1. Arrastrar carpeta al panel de Netlify
2. Genera subdominio automáticamente
3. Opción de dominio personalizado gratuito

### Opción 3: Servidor Local

```bash
# Con Python 3
python -m http.server 8000

# Con Node.js (http-server)
npx http-server

# Luego abrir: http://localhost:8000
```

## 🎮 Cómo Jugar

1. **Registro:** Ingrese número de grupo e integrantes
2. **Introducción:** Lea los conceptos de gestión legal y ambiental
3. **Asignación:** Reciba proyecto según su grupo
4. **Fase Legal:** Construya memorial legal válido (respuestas correctas/incorrectas)
5. **Fase Ambiental:** Tome decisiones ambientales con trade-offs
6. **Fase Crisis:** Maneje crisis mayor con estrategia justificada
7. **Informe:** Vea clasificación final, puntajes y recomendaciones

## 📊 Sistema de Puntuación

### Fase Legal (0-100)
- Validación correcta: 100 puntos
- -10 puntos por intento adicional
- Mínimo: 50 puntos

### Fase Ambiental (0-100)
- Impacto ambiental < 50%: 100 puntos
- 50-70%: 70 puntos
- > 70%: 40 puntos

### Fase Crisis (0-100)
- Basado en coherencia y estado anterior
- Modifica según indicadores finales

### Clasificación Final

| Puntaje | Estado | Emoji | Descripción |
|---------|--------|-------|-------------|
| 85-100 | Oro | 🥇 | Excelencia en todas las fases |
| 70-84 | Viable | 🟢 | Aprobaciones necesarias obtenidas |
| 55-69 | Observación | 🟡 | Permisos con condiciones |
| 40-54 | Sancionado | 🔴 | Fallo en requisitos clave |
| < 40 | Revocado | ⚫ | No completó flujo |

## 📱 Responsive

- Desktop: Diseño completo
- Tablet: Grid ajustado (1-2 columnas)
- Mobile: Stack vertical, optimizado para pantalla pequeña

## 🎨 Paleta de Colores

- **Legal:** Azul (#0066cc)
- **Ambiental:** Verde (#22aa44)
- **Crisis:** Rojo (#dd3333)
- **Fondo:** Gris claro (#f5f7fa)

## 🔧 Personalización

### Cambiar proyectos
Editar `js/data/projects.js` - Agregar/modificar en `PROJECTS`

### Agregar eventos
Editar `js/data/events.js` - Agregar a `EVENTS_BANK`

### Modificar requisitos legales
Editar `js/data/legal.js` - Actualizar `LEGAL_REQUIREMENTS`

### Cambiar decisiones ambientales
Editar `js/data/environmental.js` - Modificar `ENVIRONMENTAL_DECISIONS`

## 📚 Normas Colombianas Incluidas

- Ley 80 de 1993 (Contratación Pública)
- Ley 99 de 1993 (Medio Ambiente)
- Decreto 1076 de 2015 (Gestión Ambiental Territorial)
- Ley 1931 de 2018 (Cambio Climático)
- Ley 2173 de 2021 (Restauración Ecológica)
- Código Sustantivo del Trabajo
- NTC-ISO 14001 (Gestión Ambiental)

## 💾 Persistencia

- Estado guardado en LocalStorage
- Recarga automática si se cierra
- Botón para iniciar nuevo juego (limpia estado)

## 🎓 Valor Pedagógico

- **Para Abogados:** Conozca proceso legal completo
- **Para Ingenieros Ambientales:** Comprenda trade-offs ambientales
- **Para Gestores:** Integre legal + ambiental + crisis
- **Para Estudiantes:** Aprenda contexto regulatorio colombiano

## 📝 Licencia

Dominio público - Libre para uso educativo

## 👨‍💼 Autor

Desarrollado como herramienta educativa para enseñanza de gestión de proyectos sostenibles en Colombia.

---

**Versión:** 1.0  
**Última actualización:** Abril 2026  
**Estado:** ✅ Completa y funcional

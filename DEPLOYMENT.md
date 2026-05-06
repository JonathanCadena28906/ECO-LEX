# 🚀 Guía de Despliegue - ECO-LEX

## Opción 1: Despliegue Rápido en Netlify (Recomendado)

### Paso 1: Preparar carpeta
```bash
# La carpeta ya está lista en:
# d:\Academico\UNIVERSIDAD\2026-1\Gestion_proyectos\ECO-LEX
```

### Paso 2: Crear cuenta en Netlify
- Ir a https://netlify.com
- Registrarse (preferiblemente con GitHub)

### Paso 3: Desplegar
- Ir a https://app.netlify.com
- Click en "Add new site" → "Deploy manually"
- Arrastrar la carpeta `ECO-LEX` al área de drop
- ¡Listo! Se genera URL automáticamente

**URL resultante:** `https://eco-lex-xxxxx.netlify.app`

---

## Opción 2: Despliegue en GitHub Pages

### Paso 1: Crear repositorio
```bash
# En GitHub: crear repositorio público llamado "eco-lex"
```

### Paso 2: Clonar
```bash
git clone https://github.com/TU_USUARIO/eco-lex.git
```

### Paso 3: Copiar archivos
```bash
# Copiar todos los archivos del proyecto ECO-LEX a la carpeta clonada
cp -r ECO-LEX/* eco-lex/
```

### Paso 4: Hacer push
```bash
cd eco-lex
git add .
git commit -m "Agregar ECO-LEX v1.0"
git push origin main
```

### Paso 5: Activar Pages
- Settings → Pages
- Source: main / (root)
- Save

**URL resultante:** `https://tu-usuario.github.io/eco-lex`

---

## Opción 3: Servidor Local (Para Desarrollo)

### Con Python 3
```bash
cd ECO-LEX
python -m http.server 8000
# Abrir: http://localhost:8000
```

### Con Node.js
```bash
# Instalar globalmente (una sola vez)
npm install -g http-server

# En la carpeta ECO-LEX
cd ECO-LEX
http-server
# Abrir: http://localhost:8080
```

### Con Visual Studio Code
- Instalar extensión "Live Server"
- Click derecho en index.html
- "Open with Live Server"

---

## ✅ Verificación Post-Despliegue

Después de desplegar, probar:

1. ✅ Acceder a URL del sitio
2. ✅ Pantalla de registro carga (grupo 1-6)
3. ✅ Seleccionar integrantes (1-3)
4. ✅ Ingresar nombres
5. ✅ Click "Iniciar Juego"
6. ✅ Aparece pantalla de introducción
7. ✅ Botón "Entendido" lleva a asignación de proyecto
8. ✅ Asignación muestra proyecto según grupo
9. ✅ Puede iniciar Fase Legal
10. ✅ Puede ver indicadores en Fase Ambiental
11. ✅ Puede ver crisis en Fase Crisis
12. ✅ Informe final genera correctamente

---

## 🔧 Configuración Personalizada

### Cambiar título
Editar en [index.html](../index.html):
```html
<title>ECO-LEX - Juego Educativo</title>
```

### Cambiar URL del logo o iconos
En `assets/icons/` agregar SVGs

### Modificar colores
En [css/main.css](../css/main.css):
```css
:root {
    --color-legal: #0066cc;
    --color-environmental: #22aa44;
    --color-crisis: #dd3333;
}
```

### Agregar Google Analytics
Agregar antes de `</body>` en [index.html](../index.html):
```html
<!-- Google Analytics -->
<script async src="https://www.googletagmanager.com/gtag/js?id=GA_ID"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'GA_ID');
</script>
```

---

## 🐛 Troubleshooting

### Error: "Cannot load script"
- ✅ Verificar estructura de carpetas
- ✅ Nombres de archivos (case-sensitive en Linux/Mac)
- ✅ Rutas en index.html son correctas

### Eventos no disparan
- ✅ Abrir consola (F12) ver errores
- ✅ Verificar que events-engine.js está cargando
- ✅ Puede haber timeout lento, esperar 1-3 minutos

### Formulario no funciona
- ✅ Verificar que main.js está cargando
- ✅ Verificar que state.js está cargando
- ✅ Abrir DevTools → Console para ver errores

### Indicadores no actualizan
- ✅ Verificar que environmental.js está cargando
- ✅ Recargar página (Ctrl+F5)

### No se puede exportar a PDF
- ✅ Verificar CDN de html2pdf.js está disponible
- ✅ Alternativa: usar Ctrl+P para imprimir como PDF

---

## 📊 Estadísticas del Proyecto

| Métrica | Valor |
|---------|-------|
| Archivos HTML | 1 |
| Archivos CSS | 3 |
| Archivos JS | 10 |
| Líneas de código | ~3000+ |
| Tamaño total | ~150 KB (sin minificar) |
| Tiempo carga | < 2 segundos |
| Proyectos | 5 |
| Eventos | 13+ |
| Fases | 3 |
| Indicadores | 5 |

---

## 🎓 Métricas de Uso

Una vez desplegado, puede rastrear:

- Usuarios por grupo
- Fase donde más fallan
- Tiempo promedio por fase
- Proyectos con mejor desempeño
- Decisiones ambientales más seleccionadas

*Usar Google Analytics o similar para esto*

---

## 📞 Soporte

Para preguntas o problemas:
1. Revisar README.md
2. Verificar DevTools (F12)
3. Limpiar caché del navegador
4. Probar en navegador diferente
5. Verificar conexión a internet (para CDN html2pdf)

---

**Última actualización:** Abril 2026  
**Estado:** ✅ Listo para desplegar

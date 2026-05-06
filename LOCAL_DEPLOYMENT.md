# 🚀 DESPLIEGUE LOCAL - INSTRUCCIONES PARA TU EQUIPO

## ✅ Estado Actual

**Servidor Local ACTIVO:**
- 🌐 **URL:** `http://localhost:8000`
- 📍 **Puerto:** 8000
- 📁 **Carpeta:** `d:\Academico\UNIVERSIDAD\2026-1\Gestion_proyectos\ECO-LEX`
- ✅ **Estado:** Corriendo

---

## 🎮 Acceso Inmediato

### Opción 1: Desde tu Máquina (Local)
```
http://localhost:8000
```

Simplemente abre este link en cualquier navegador.

### Opción 2: Desde otra máquina en la red (LAN)
```
http://[TU_IP_LOCAL]:8000
```

**Para encontrar tu IP:**
- **Windows:** `ipconfig` en CMD → busca "IPv4 Address"
- **Mac/Linux:** `ifconfig` en terminal → busca "inet"

Ejemplo: `http://192.168.1.100:8000`

---

## 📤 Compartir con tu Equipo via VS Code Live Share

### Paso 1: Instalar Extensión Live Share
1. Abre **VS Code**
2. Ir a **Extensiones** (Ctrl+Shift+X)
3. Buscar **"Live Share"** (por Microsoft)
4. Instalar
5. Recargar VS Code

### Paso 2: Abrir la carpeta del proyecto
```
File → Open Folder
d:\Academico\UNIVERSIDAD\2026-1\Gestion_proyectos\ECO-LEX
```

### Paso 3: Iniciar Live Share Session
1. Presionar **Ctrl+Shift+P**
2. Escribir: `Live Share: Start Collaboration Session`
3. Presionar Enter
4. VS Code generará un **link de invitación**

**Ejemplo de link:**
```
https://prod.liveshare.vscode.dev/join/XXXXXXXXXXXXX
```

### Paso 4: Compartir el link
Envía el link a tu equipo por:
- 📧 Email
- 💬 WhatsApp
- 🔗 Slack
- 💻 Teams
- 📋 Cualquier canal de comunicación

### Paso 5: Tu equipo se une
1. Reciben el link
2. Lo abren en navegador (no necesitan VS Code instalado)
3. Pueden ver tu código en tiempo real
4. Pueden ver el servidor local que está corriendo

---

## 🌐 Método Alternativo: Compartir Solo el Servidor

Si tu equipo solo quiere **jugar** (no ver código):

### Opción A: Mismo WiFi (Red Local)
1. En terminal, anota tu IP: `ipconfig` (Windows)
2. Da a tu equipo: `http://[TU_IP]:8000`
3. ¡Listo!

### Opción B: Usar Ngrok (Túnel a Internet)
Para compartir FUERA de la red local:

```bash
# Descargar ngrok de https://ngrok.com/download
# O si tienes npm:
npm install -g ngrok

# En terminal:
ngrok http 8000

# Genera URL pública:
https://xxxx-xx-xxx-xxx-xx.ngrok.io
```

Comparte esa URL pública con tu equipo (funciona desde cualquier lugar).

---

## 🎯 Opción Recomendada para Demostración

**La MEJOR forma de mostrar el juego:**

### Método: Screen Sharing + URL Local

```
1. Enciende el servidor (ya está corriendo ✅)
2. Abre http://localhost:8000 en navegador
3. Usa screen share en Meeting (Teams, Zoom, Google Meet)
4. Comparte tu pantalla completa
5. Juega y explica en tiempo real
```

**Ventajas:**
✅ No requiere instalación en máquinas de equipo  
✅ Puedes explicar mientras juegas  
✅ Control total de la demostración  
✅ Funciona con cualquier plataforma de video  

---

## 🔧 Mantener el Servidor Corriendo

El servidor está corriendo en **terminal de fondo**. Para:

### Detener el servidor
- Click en la terminal donde está corriendo
- Presiona: **Ctrl+C**

### Reiniciar el servidor
```bash
cd "d:\Academico\UNIVERSIDAD\2026-1\Gestion_proyectos\ECO-LEX"
python -m http.server 8000
```

### Usar puerto diferente (si 8000 está ocupado)
```bash
python -m http.server 8001  # Usa 8001 en lugar de 8000
```

---

## ✅ Checklist de Preparación

- [ ] Servidor está corriendo (viste el mensaje "Serving HTTP...")
- [ ] Puedes acceder en navegador: `http://localhost:8000`
- [ ] El juego carga correctamente
- [ ] Viste pantalla de registro
- [ ] VS Code Live Share está instalado (si lo vas a usar)
- [ ] Tienes lista la URL para compartir
- [ ] Avisaste a tu equipo que estará disponible

---

## 🎮 URL para tu Equipo

**Comparte esta URL con tu equipo:**

### Si están en la MISMA red:
```
http://[TU_IP_LOCAL]:8000
```

### Si usas ngrok:
```
https://xxxx-xx-xxx-xxx-xx.ngrok.io
```

### Si usas screen sharing:
```
Screen sharing durante la demostración
```

---

## 📱 Probar en Móvil (desde tu red)

1. En tu móvil, conectate al mismo WiFi
2. Abre navegador
3. Accede a: `http://[TU_IP]:8000`
4. ¡Juega en móvil!

---

## 🎓 Que tu Equipo Vea

Cuando entren al juego verán:

1. **Pantalla de Registro** ✅
   - Seleccionar grupo (1-6)
   - Ingresar integrantes (1-3)

2. **Pantalla de Introducción** ✅
   - Definiciones de gestión legal/ambiental
   - Normas colombianas

3. **Asignación de Proyecto** ✅
   - Proyecto único según grupo
   - Recursos iniciales
   - Descripción de retos

4. **Fase Legal** ✅
   - Formulario de requisitos
   - Validación en tiempo real

5. **Fase Ambiental** ✅
   - 7 decisiones
   - Indicadores actualizando

6. **Fase Crisis** ✅
   - Crisis aleatoria
   - Opcionesmultiples

7. **Informe Final** ✅
   - Clasificación y puntajes
   - Exportar a PDF

---

## 🐛 Si Algo Falla

### Error: "Conexión rechazada"
- ✅ Verifica que servidor está corriendo
- ✅ Usa `http://localhost:8000` (no `https://`)

### Error: "Puerto 8000 ya en uso"
- ✅ Detén otro proceso: `netstat -ano | findstr :8000`
- ✅ O usa puerto diferente: `python -m http.server 8001`

### El juego se ve lento
- ✅ Recarga la página: F5
- ✅ Limpia caché: Ctrl+Shift+Del
- ✅ Cierra otras pestañas

### Eventos no aparecen
- ✅ Espera 1-3 minutos (es aleatorio)
- ✅ Los eventos son totalmente opcionales

---

## 💡 Tips para la Demostración

1. **Antes de la reunión:**
   - Asegúrate que el servidor esté corriendo
   - Prueba acceder en tu máquina
   - Juega una partida rápida para familiar​​​​​​​izarte

2. **Durante la demostración:**
   - Explica la visión pedagógica primero
   - Muestra el flujo de registro
   - Destaca los 3 pensamientos (Legal, Ambiental, Crisis)
   - Juega una partida completa
   - Resalta los eventos aleatorios

3. **Preguntas comunes:**
   - "¿Es offline?" → Sí, funciona completamente offline
   - "¿Cuánto toma?" → 30-45 minutos por partida
   - "¿Se puede personalizar?" → Sí, todos los datos son editables
   - "¿Puedo desplegar en Internet?" → Sí, via GitHub Pages o Netlify

---

## 📞 Necesitas Ayuda?

Si algo no funciona:
1. Verifica que Python está instalado: `python --version`
2. Confirma que estás en la carpeta correcta
3. Intenta con `python3 -m http.server 8000`
4. O usa Node.js: `npx http-server`

---

**¡Listo para mostrar tu juego! 🎉**

*Última actualización: Abril 2026*

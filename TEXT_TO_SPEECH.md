# Funcionalidad de Lectura en Voz Alta (Text-to-Speech)

## 🔊 Descripción General

EcoRutas ahora incluye una funcionalidad completa de **lectura en voz alta automática** que lee el contenido de la página cuando el usuario pasa el cursor sobre cualquier elemento de texto, botón, icono o componente interactivo.

## ✨ Características

### Activación/Desactivación
- **Atajo de teclado**: `Alt + V` para activar/desactivar la lectura en voz alta
- **Menú de accesibilidad**: Botón flotante en la esquina inferior derecha (icono de engranaje) → Activar "Lectura por voz"

### Elementos que se Leen Automáticamente

La funcionalidad detecta y lee automáticamente:

1. **Elementos interactivos**:
   - Botones
   - Enlaces (links)
   - Inputs y formularios
   - Menús y menús desplegables
   - Checkboxes y radio buttons

2. **Contenido textual**:
   - Encabezados (h1-h6)
   - Párrafos
   - Elementos de lista
   - Celdas de tabla

3. **Atributos de accesibilidad** (con prioridad):
   - `aria-label` (máxima prioridad)
   - `aria-description`
   - `title`
   - `alt` (para imágenes)
   - `placeholder` (para inputs)
   - `data-speak` (atributo personalizado)
   - `textContent` (contenido del elemento)

### Indicador Visual

Cuando la lectura en voz alta está activa, verás un **indicador visual** en la esquina superior derecha que muestra:
- 🔊 "Lectura activada" cuando está habilitada
- 🔊 "Leyendo..." con animación cuando está hablando
- 🔇 "Lectura desactivada" cuando se desactiva

## 🎯 Funcionamiento

### Activación por Cursor (Hover)
Simplemente pasa el cursor sobre cualquier elemento y se leerá automáticamente:
- **Botones**: Se lee el texto del botón o su aria-label
- **Enlaces**: Se lee el texto del enlace o su descripción
- **Inputs**: Se lee el label asociado o el placeholder
- **Imágenes**: Se lee el texto alternativo (alt)
- **Íconos**: Se lee el aria-label si está definido

### Activación por Teclado (Focus)
Navega con el teclado (Tab) y cada elemento que reciba el foco será leído automáticamente.

### Control de Velocidad
- La lectura usa velocidad natural (rate: 1.0)
- Tono natural (pitch: 1.0)
- Volumen máximo (volume: 1.0)

### Gestión Inteligente
- **Prevención de superposición**: Si se pasa a otro elemento mientras está hablando, cancela la lectura anterior
- **Delay en hover**: 100ms de espera al pasar el cursor para evitar lecturas accidentales
- **Delay al salir**: 300ms de espera al salir del elemento para permitir movimiento fluido
- **Limpieza de texto**: Elimina espacios múltiples y caracteres especiales

## 🛠️ Implementación Técnica

### Hook Principal: `useGlobalTextToSpeech`

Este hook se ejecuta automáticamente en toda la aplicación y:
1. Detecta eventos `mouseenter`, `focus` y `mouseleave`
2. Determina si un elemento debe ser leído
3. Extrae el texto legible del elemento
4. Ejecuta la síntesis de voz

### Prioridad de Lectura

El sistema busca texto en este orden:
1. ✅ `aria-label` (más importante)
2. ✅ `aria-description`
3. ✅ `title`
4. ✅ `alt`
5. ✅ `placeholder`
6. ✅ `data-speak` (personalizado)
7. ✅ `textContent` (contenido visible)
8. ✅ Labels asociados (para inputs/selects)

### Elementos Excluidos

No se leen elementos que:
- Tengan `aria-hidden="true"`
- Estén ocultos (`display: none`, `visibility: hidden`, `opacity: 0`)
- Sean elementos decorativos sin contenido significativo
- Tengan clase `.sr-only` (solo para lectores de pantalla)

## 💡 Mejores Prácticas para Desarrolladores

### 1. Usar atributos de accesibilidad apropiados

```tsx
// ✅ Bueno - con aria-label
<button aria-label="Cerrar menú de navegación">
  <X />
</button>

// ✅ Mejor - con aria-label y aria-description
<button 
  aria-label="Guardar cambios" 
  aria-description="Guarda todos los cambios realizados en el formulario"
>
  Guardar
</button>
```

### 2. Usar el atributo personalizado `data-speak`

```tsx
// Para elementos complejos o íconos sin texto
<div className="icon-container" data-speak="Icono de ubicación">
  <MapPin />
</div>
```

### 3. Agregar clase `.speak-on-hover` para forzar lectura

```tsx
<div className="custom-element speak-on-hover">
  Este texto será leído aunque sea un div
</div>
```

### 4. Usar los hooks de accesibilidad

```tsx
import { useAccessibleElement } from '@/hooks/useAccessibilityFeatures';

// Dentro del componente
const accessibleProps = useAccessibleElement(
  "Título del botón", 
  "Descripción detallada del botón"
);

<button {...accessibleProps}>
  Click aquí
</button>
```

## 🎮 Atajos de Teclado

| Atajo | Acción |
|-------|--------|
| `Alt + V` | Activar/Desactivar lectura en voz alta |
| `Alt + A` | Abrir menú de accesibilidad |
| `Alt + L` | Cambiar idioma |
| `Alt + D` | Activar/Desactivar modo oscuro |
| `Alt + +` | Aumentar tamaño de fuente |
| `Alt + -` | Disminuir tamaño de fuente |
| `Alt + R` | Restablecer configuración |

## 🌐 Soporte de Idiomas

La lectura en voz alta se adapta automáticamente al idioma seleccionado:
- **Español**: Usa voz `es-ES`
- **Inglés**: Usa voz `en-US`

## 🔧 Configuración Persistente

La preferencia de lectura en voz alta se guarda en `localStorage` y persiste entre sesiones:
```javascript
localStorage.getItem('eco-speech-enabled') // 'true' o 'false'
```

## 📱 Compatibilidad

La funcionalidad usa la API Web Speech Synthesis que es compatible con:
- ✅ Chrome/Edge (Windows, Mac, Linux, Android)
- ✅ Safari (Mac, iOS)
- ✅ Firefox (Windows, Mac, Linux)
- ⚠️ Requiere navegadores modernos

## 🐛 Solución de Problemas

### La lectura no funciona
1. Verifica que la lectura esté activada (`Alt + V`)
2. Asegúrate de que tu navegador soporte Web Speech API
3. Verifica el volumen del sistema
4. Algunos navegadores requieren interacción del usuario antes de permitir la síntesis de voz

### La lectura es demasiado rápida/lenta
Actualmente usa velocidad natural (1.0). Para ajustarla, modifica `utterance.rate` en `AccessibilityContext.tsx`:
```typescript
utterance.rate = 1.0; // 0.5 = lento, 1.0 = normal, 2.0 = rápido
```

### No lee ciertos elementos
Agrega atributos de accesibilidad:
```tsx
<div aria-label="Texto descriptivo">...</div>
// o
<div data-speak="Texto a leer">...</div>
```

## 🎯 Casos de Uso

### Caso 1: Navegación Principal
Cuando pasas el cursor sobre los enlaces del menú, escucharás el nombre de cada sección.

### Caso 2: Formularios
Al navegar un formulario, se lee el label de cada campo y su propósito.

### Caso 3: Botones de Acción
Todos los botones importantes tienen descripciones que se leen al pasar el cursor.

### Caso 4: Tarjetas de Contenido
Las tarjetas de rutas, guías y comunidades leen su título y descripción.

## 🚀 Ejemplos de Implementación

### Ejemplo 1: Botón con descripción completa
```tsx
<button 
  aria-label="Reservar tour"
  aria-description="Reservar un tour eco-turístico en la comunidad seleccionada"
  className="btn-primary"
>
  Reservar
</button>
```

### Ejemplo 2: Input con label
```tsx
<label htmlFor="email">Correo Electrónico</label>
<input 
  id="email" 
  type="email" 
  placeholder="ejemplo@correo.com"
  aria-description="Ingresa tu correo para recibir confirmación"
/>
```

### Ejemplo 3: Ícono interactivo
```tsx
<button 
  aria-label="Menú de navegación"
  aria-description="Abrir menú con todas las secciones del sitio"
>
  <Menu className="h-6 w-6" />
</button>
```

---

## 📝 Notas Importantes

- La funcionalidad respeta las preferencias de accesibilidad del usuario
- Se integra perfectamente con lectores de pantalla
- No interfiere con la navegación normal del sitio
- Es completamente opcional y se puede desactivar en cualquier momento

---

**Desarrollado para mejorar la accesibilidad y experiencia de todos los usuarios de EcoRutas** 🌿

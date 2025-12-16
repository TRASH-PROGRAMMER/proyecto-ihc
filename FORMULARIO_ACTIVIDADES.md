# Formulario de Actividades/Servicios Ofrecidos

## 📋 Descripción

Formulario completo para registrar actividades y servicios turísticos con detalles de requisitos, precios, duración y galería de fotos con barra de progreso funcional.

## 🎯 Características Implementadas

### ✅ Campos del Formulario

#### Sección 1: Información Básica

1. **Nombre de la actividad** (Texto obligatorio)
   - Validación: Mínimo 5 caracteres
   - Placeholder: "Ej: Senderismo a Laguna Quilotoa"

2. **Localidad/Sitio** (Lista desplegable obligatoria)
   - 8 localidades predefinidas:
     - Laguna de Quilotoa
     - Parque Nacional Cotopaxi
     - Baños de Agua Santa
     - Otavalo
     - Puerto López
     - Galápagos
     - Selva Amazónica
     - Imbabura

3. **Tipo de actividad** (Lista desplegable obligatoria)
   - 8 tipos predefinidos:
     - Aventura
     - Cultural
     - Naturaleza
     - Ecoturismo
     - Gastronomía
     - Deportiva
     - Educativa
     - Histórica

#### Sección 2: Descripción

4. **Descripción** (Texto largo obligatorio)
   - Validación: Mínimo 50 caracteres
   - Textarea con contador de caracteres
   - Placeholder: Incluye sugerencias de qué describir

#### Sección 3: Duración y Requisitos

5. **Duración** (Número obligatorio)
   - En minutos
   - Validación: Mínimo 15 minutos
   - Placeholder: "Ej: 120"

6. **Edad mínima** (Número obligatorio)
   - Validación: 0 o mayor
   - Icono de usuarios integrado

7. **Exigencia física** (Lista desplegable obligatoria)
   - Opciones: Baja, Media, Alta
   - Ayuda a usuarios a elegir actividades apropiadas

8. **Guía requerido** (Lista desplegable obligatoria)
   - Opciones: Sí, No
   - Define si se requiere guía turístico

#### Sección 4: Precio y Equipo

9. **Precio** (Número decimal obligatorio)
   - En USD
   - Validación: No negativo
   - Paso decimal para centavos
   - Icono de dólar integrado
   - Nota: "Por persona"

10. **Equipo necesario** (Texto largo obligatorio)
    - Validación: Mínimo 10 caracteres
    - Textarea para lista completa
    - Placeholder: Incluye ejemplos (zapatos, mochila, agua, etc.)

#### Sección 5: Galería

11. **Fotos** (Archivos múltiples)
    - Subida múltiple
    - Validación: Solo imágenes (PNG, JPG, JPEG)
    - Tamaño máximo: 5MB por archivo
    - Vista previa en grid de 2x2 (responsive)
    - Opción de eliminar individual
    - Área de drag & drop
    - Preparado para Cloudinary

#### Sección 6: Estado

12. **Estado** (Lista desplegable obligatoria)
    - Opciones: Activo, Suspendido
    - Permite desactivar sin eliminar

### 📊 Barra de Progreso

- **Cálculo inteligente**: Valida todos 11 campos obligatorios
- **Actualización en tiempo real**: Refleja cambios inmediatos
- **Indicador visual**: Porcentaje con badge de estado
- **Validaciones incluidas**: Duración mínima, caracteres, etc.
- **Resumen al 100%**: Mensaje verde de confirmación
- **Control de envío**: Botón guardar deshabilitado hasta completar

### 🎨 Diseño y Estilos

- ✅ 6 cards temáticas bien organizadas
- ✅ Iconos descriptivos (Activity, Clock, DollarSign, ImageIcon, etc.)
- ✅ Validaciones visuales con mensajes claros
- ✅ Contadores de caracteres en tiempo real
- ✅ Responsive design (móviles, tablets, desktop)
- ✅ Galería de fotos con previsualizaciones
- ✅ Grid responsivo para imágenes

### 🔧 Funcionalidades

- ✅ Validación de descripción (mínimo 50 caracteres)
- ✅ Validación de duración (mínimo 15 minutos)
- ✅ Validación de precio (no negativo)
- ✅ Sistema de subida múltiple de imágenes
- ✅ Preview individual de cada foto
- ✅ Eliminación de fotos individual
- ✅ Toast notifications para feedback
- ✅ Cálculo automático del progreso
- ✅ Navegación con botón "Volver"
- ✅ Contador de caracteres en descripción y equipo

## 🚀 Uso

### Acceso al Formulario

Navega a: `/nueva-actividad`

### Integración en el Código

```tsx
import AddActividadForm from "@/components/forms/AddActividadForm";

// Usar en cualquier componente
<AddActividadForm />
```

## 📝 Estructura de Datos

```typescript
interface ActividadData {
  nombreActividad: string;
  localidadSitio: string;
  tipoActividad: string;
  descripcion: string;
  duracion: string;           // Minutos
  edadMinima: string;
  precio: string;             // USD decimal
  exigenciaFisica: string;   // "Baja" | "Media" | "Alta"
  guiaRequerido: string;      // "si" | "no"
  equipoNecesario: string;
  fotos: string[];            // URLs a Cloudinary
  estado: string;             // "Activo" | "Suspendido"
}
```

## 🔄 Flujo de Uso

1. **Información Básica**: Nombre, localidad y tipo
2. **Descripción**: Detalles completos de la actividad
3. **Requisitos**: Duración, edad, exigencia física, guía
4. **Precio y Equipo**: Costo y equipamiento necesario
5. **Fotos**: Sube múltiples imágenes de la actividad
6. **Estado**: Define si está activa o suspendida
7. **Guardar**: Envía cuando esté 100% completo

## 💡 Ejemplos de Uso

### Ejemplo 1: Senderismo de aventura

```typescript
{
  nombreActividad: "Senderismo a Laguna Quilotoa",
  localidadSitio: "Laguna de Quilotoa",
  tipoActividad: "Aventura",
  descripcion: "Recorrido de 8km alrededor de la laguna de Quilotoa...",
  duracion: "480",
  edadMinima: "12",
  precio: "35.00",
  exigenciaFisica: "Alta",
  guiaRequerido: "si",
  equipoNecesario: "Zapatos de senderismo, mochila, agua...",
  fotos: ["url1", "url2", "url3"],
  estado: "Activo"
}
```

### Ejemplo 2: Actividad cultural

```typescript
{
  nombreActividad: "Tour por Otavalo",
  localidadSitio: "Otavalo",
  tipoActividad: "Cultural",
  descripcion: "Visita guiada por mercados indígenas y pueblos...",
  duracion: "180",
  edadMinima: "5",
  precio: "25.00",
  exigenciaFisica: "Baja",
  guiaRequerido: "si",
  equipoNecesario: "Ropa cómoda, cámara, dinero...",
  fotos: ["url1", "url2"],
  estado: "Activo"
}
```

## 🔄 Próximas Mejoras

1. **Backend Integration**
   ```typescript
   const onSubmit = async (data: ActividadData) => {
     const response = await fetch('/api/actividades', {
       method: 'POST',
       headers: { 'Content-Type': 'application/json' },
       body: JSON.stringify(data),
     });
   };
   ```

2. **Cloudinary Integration**
   ```typescript
   const uploadFotosCloudinary = async (files: File[]) => {
     // Implementar subida real
   };
   ```

3. **Validación avanzada**
   - Validar que duración sea múltiplo de 15
   - Validación de horarios
   - Restricciones según tipo de actividad

4. **Galería mejorada**
   - Ordenar fotos (drag & drop)
   - Marcar foto principal
   - Recorte de imágenes

5. **Persistencia local**
   - Guardado automático en localStorage
   - Recuperación de borradores

## 🎨 Personalización

### Agregar más localidades:

```typescript
const LOCALIDADES = [
  // ... existentes
  "Nueva localidad",
];
```

### Agregar más tipos de actividad:

```typescript
const TIPOS_ACTIVIDAD = [
  // ... existentes
  "Tipo nuevo",
];
```

### Agregar rangos de edad predefinidos:

```typescript
const EDADES_MINIMAS = [
  { label: "Cualquier edad", value: "0" },
  { label: "Mayor de 12 años", value: "12" },
  { label: "Mayor de 18 años", value: "18" },
];
```

## 📱 Componentes Utilizados

- **Input** - Campos de texto y número
- **Textarea** - Descripciones largas
- **Select** - Listas desplegables
- **Card** - Secciones temáticas
- **Progress** - Barra de progreso
- **Badge** - Indicadores de estado
- **Label** - Etiquetas de campos
- **Button** - Acciones
- **Alert** - Mensajes de estado
- **Separator** - Divisiones visuales

## 📞 Soporte

Para cualquier duda o mejora, contacta al equipo de desarrollo.

## 🔐 Validaciones Implementadas

| Campo | Validación |
|-------|-----------|
| Nombre | Mínimo 5 caracteres |
| Localidad | Requerida (lista) |
| Tipo | Requerido (lista) |
| Descripción | Mínimo 50 caracteres |
| Duración | Mínimo 15 minutos |
| Edad mínima | 0 o mayor |
| Precio | No negativo |
| Exigencia | Requerida (lista) |
| Guía | Requerido (sí/no) |
| Equipo | Mínimo 10 caracteres |
| Fotos | Al menos 1 requerida |
| Estado | Requerido (lista) |

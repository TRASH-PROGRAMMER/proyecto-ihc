# Formulario de Sitio Turístico

## 📋 Descripción

Formulario completo para registrar información de sitios turísticos con barra de progreso en tiempo real y validaciones integradas.

## 🎯 Características Implementadas

### ✅ Campos del Formulario

1. **Nombre del sitio** (Texto obligatorio)
   - Validación: Mínimo 3 caracteres
   
2. **Tipo de sitio** (Lista desplegable)
   - Opciones: Sendero, Mirador, Lago, Bosque, Cascada, Montaña, Playa, Río, Parque Natural, Reserva Ecológica

3. **Dificultad** (Lista desplegable)
   - Opciones: Baja, Media, Alta

4. **Tiempo estimado** (Número)
   - Duración en minutos del recorrido
   - Validación: Mayor a 0

5. **Descripción corta** (Texto)
   - Resumen del sitio
   - Máximo 200 caracteres
   - Contador de caracteres en tiempo real

6. **Descripción detallada** (Texto largo)
   - Información completa
   - Validación: Mínimo 50 caracteres
   - Contador de caracteres en tiempo real

7. **Fotos** (Subida de archivos)
   - Múltiples imágenes
   - Validación: Solo imágenes (PNG, JPG, JPEG)
   - Tamaño máximo: 5MB por archivo
   - Vista previa de imágenes
   - Opción para eliminar imágenes
   - Preparado para integración con Cloudinary

8. **Servicios disponibles** (Checkboxes múltiples)
   - Baños
   - Parqueadero
   - Señalización
   - Guía turístico
   - Restaurante/Cafetería

9. **Accesibilidad PMR** (Checkbox)
   - Indica si es accesible para personas con movilidad reducida
   - Muestra alerta visual cuando está activado

10. **Estado** (Lista desplegable)
    - Opciones: Activo, Mantenimiento, Cerrado

### 📊 Barra de Progreso

- **Funcional y en tiempo real**: Se actualiza automáticamente mientras completas el formulario
- **Indicador visual**: Muestra el porcentaje completado
- **Badge de estado**: Cambia de color cuando el formulario está 100% completo
- **Mensaje de confirmación**: Aparece cuando el formulario está listo para guardar

### 🎨 Diseño y Estilos

El formulario utiliza los componentes UI del sistema existente:
- ✅ Card components para organización visual
- ✅ Input, Textarea, Select components estilizados
- ✅ Checkbox components con estilos consistentes
- ✅ Button components con variantes
- ✅ Progress component para la barra
- ✅ Alert components para mensajes
- ✅ Badge components para etiquetas
- ✅ Label components para formularios
- ✅ Iconos de Lucide React

### 🔧 Funcionalidades

- ✅ Validación de campos en tiempo real
- ✅ Mensajes de error claros
- ✅ Vista previa de imágenes subidas
- ✅ Contador de caracteres para campos de texto
- ✅ Cálculo automático del progreso
- ✅ Botón de guardar deshabilitado hasta completar el formulario
- ✅ Responsive design (adaptado a móviles y tablets)
- ✅ Integración con react-hook-form
- ✅ Toast notifications para feedback
- ✅ Navegación con botón "Volver"

## 🚀 Uso

### Acceso al Formulario

Navega a: `/nuevo-sitio-turistico`

### Integración en el Código

```tsx
import AddSitioTuristicoForm from "@/components/forms/AddSitioTuristicoForm";

// Usar en cualquier componente
<AddSitioTuristicoForm />
```

## 📝 Estructura de Datos

```typescript
interface SitioTuristicoData {
  nombreSitio: string;
  tipoSitio: string;
  dificultad: string;
  tiempoEstimado: string;
  descripcionCorta: string;
  descripcionDetallada: string;
  fotos: string[];
  serviciosBanos: boolean;
  serviciosParqueadero: boolean;
  serviciosSenalizacion: boolean;
  serviciosGuia: boolean;
  serviciosRestaurante: boolean;
  accesibilidadPMR: boolean;
  estado: string;
}
```

## 🔄 Próximas Mejoras

Para completar la integración:

1. **Backend Integration**
   ```typescript
   // En la función onSubmit, agregar llamada al API
   const onSubmit = async (data: SitioTuristicoData) => {
     try {
       const response = await fetch('/api/sitios-turisticos', {
         method: 'POST',
         headers: { 'Content-Type': 'application/json' },
         body: JSON.stringify(data),
       });
       // Manejar respuesta
     } catch (error) {
       // Manejar error
     }
   };
   ```

2. **Cloudinary Integration**
   ```typescript
   const uploadToCloudinary = async (file: File) => {
     const formData = new FormData();
     formData.append('file', file);
     formData.append('upload_preset', 'YOUR_PRESET');
     
     const response = await fetch(
       'https://api.cloudinary.com/v1_1/YOUR_CLOUD_NAME/image/upload',
       { method: 'POST', body: formData }
     );
     
     const data = await response.json();
     return data.secure_url;
   };
   ```

3. **LocalStorage Persistence**
   ```typescript
   // Guardar borrador automáticamente
   useEffect(() => {
     const draft = localStorage.getItem('sitio-draft');
     if (draft) {
       const data = JSON.parse(draft);
       Object.keys(data).forEach(key => {
         setValue(key, data[key]);
       });
     }
   }, []);

   useEffect(() => {
     localStorage.setItem('sitio-draft', JSON.stringify(formValues));
   }, [formValues]);
   ```

## 🎨 Personalización

### Agregar nuevos tipos de sitio:

```typescript
const TIPOS_SITIO = [
  // ... existentes
  "Nuevo Tipo",
];
```

### Agregar nuevos servicios:

```typescript
// En el formulario, agregar nuevo checkbox
<div className="flex items-center space-x-2">
  <Checkbox
    id="serviciosNuevo"
    checked={formValues.serviciosNuevo}
    onCheckedChange={(checked) =>
      setValue("serviciosNuevo", checked as boolean)
    }
  />
  <Label htmlFor="serviciosNuevo" className="font-normal cursor-pointer">
    Nuevo Servicio
  </Label>
</div>
```

## 📱 Screenshots

El formulario incluye:
- Encabezado con título e icono
- Barra de progreso en tarjeta destacada
- Secciones organizadas en cards
- Campos con validación visual
- Preview de imágenes con opción de eliminar
- Checkboxes con labels interactivos
- Botones de acción al final

## 🛠️ Tecnologías Utilizadas

- React + TypeScript
- React Hook Form (manejo de formularios)
- Radix UI (componentes base)
- Tailwind CSS (estilos)
- Lucide React (iconos)
- Shadcn/ui (sistema de componentes)

## 📞 Soporte

Para cualquier duda o mejora, contacta al equipo de desarrollo.

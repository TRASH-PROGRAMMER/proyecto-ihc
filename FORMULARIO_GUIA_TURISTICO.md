# Formulario de Registro del Guía Turístico

## 📋 Descripción

Formulario completo para registrar y gestionar información de guías turísticos con validaciones específicas, manejo de competencias múltiples y barra de progreso dinámica.

## 🎯 Características Implementadas

### ✅ Campos del Formulario

#### Sección 1: Información Personal

1. **Nombre completo** (Texto obligatorio)
   - Validación: Mínimo 5 caracteres
   - Placeholder: "Ej: Juan Carlos Rodríguez"

2. **Documento** (Texto obligatorio)
   - Cédula o pasaporte
   - Validación: Mínimo 10 caracteres
   - Placeholder: "Ej: 1234567890"

3. **Edad** (Número obligatorio)
   - Rango: 18-80 años
   - Validación automática de rango
   - Placeholder: "Ej: 35"

4. **Teléfono** (Texto obligatorio)
   - Validación para números ecuatorianos: +593 o 0 seguido de 9 y 8-9 dígitos
   - Icono de teléfono integrado
   - Placeholder: "Ej: 0987654321"

5. **Correo electrónico** (Email obligatorio)
   - Validación de formato email
   - Icono de correo integrado
   - Placeholder: "Ej: guia@email.com"

#### Sección 2: Experiencia y Competencias

6. **Años de experiencia** (Número obligatorio)
   - Validación: Mayor o igual a 0
   - Placeholder: "Ej: 5"

7. **Idiomas** (Múltiples selecciones)
   - Sistema de añadir/eliminar idiomas dinámicamente
   - Opciones predefinidas:
     - Español, Inglés, Francés, Italiano, Alemán, Portugués, Quechua
   - Visualización en badges con icono
   - Prevención de duplicados
   - Botón "+" para agregar

8. **Certificaciones** (Múltiples selecciones)
   - Sistema similar a idiomas
   - Opciones predefinidas:
     - Primeros auxilios
     - Guía certificado nacional
     - Guía certificado internacional
     - Rescate en altura
     - Primeros auxilios en montaña
     - Buceo certificado
     - Fotografía profesional
     - Turismo ecológico
   - Visualización en badges con icono
   - Prevención de duplicados

#### Sección 3: Disponibilidad y Foto

9. **Disponibilidad** (Lista desplegable)
   - Opciones:
     - Lunes a viernes
     - Fines de semana
     - Flexible
     - Disponibilidad completa
     - Feriados
   - Obligatorio para progreso al 100%

10. **Foto de perfil** (Archivo)
    - Subida individual (una foto)
    - Validación: Solo imágenes (PNG, JPG, JPEG)
    - Tamaño máximo: 5MB
    - Vista previa con opción de eliminar
    - Preparado para integración con Cloudinary
    - Zona de drag & drop

#### Sección 4: Estado

11. **Estado** (Lista desplegable)
    - Opciones: Activo, Inactivo
    - Obligatorio

### 📊 Barra de Progreso Funcional

- **Cálculo inteligente**: Valida que idiomas y certificaciones tengan al menos 1 elemento cada uno
- **Actualización en tiempo real**: Refleja cambios inmediatos
- **Indicador visual**: Porcentaje con badge de estado
- **Validaciones incluidas**: Edad, teléfono, email, etc.
- **Resumen al 100%**: Mensaje verde de confirmación
- **Control de envío**: Botón guardar deshabilitado hasta completar

### 🎨 Diseño y Estilos

- ✅ Componentes UI consistentes del sistema
- ✅ Iconos descriptivos en cada sección
- ✅ Cards temáticas organizadas
- ✅ Badges dinámicos para idiomas y certificaciones
- ✅ Validaciones visuales con mensajes claros
- ✅ Responsive design
- ✅ Foto con preview inline
- ✅ Select desplegables con búsqueda

### 🔧 Funcionalidades

- ✅ Validación de edad (18-80 años)
- ✅ Validación de teléfono ecuatoriano
- ✅ Validación de email con regex
- ✅ Sistema dinámico de idiomas (add/remove)
- ✅ Sistema dinámico de certificaciones (add/remove)
- ✅ Preview de foto subida
- ✅ Eliminación de foto
- ✅ Toast notifications para feedback
- ✅ Cálculo automático del progreso
- ✅ Prevención de duplicados en idiomas/certificaciones
- ✅ Navegación con botón "Volver"

## 🚀 Uso

### Acceso al Formulario

Navega a: `/nuevo-guia`

### Integración en el Código

```tsx
import AddGuiaForm from "@/components/forms/AddGuiaForm";

// Usar en cualquier componente
<AddGuiaForm />
```

## 📝 Estructura de Datos

```typescript
interface GuiaData {
  nombreCompleto: string;
  documento: string;
  edad: string;
  telefono: string;
  correo: string;
  idiomas: string[];
  certificaciones: string[];
  anosExperiencia: string;
  disponibilidad: string;
  foto: string;
  estado: string;
}
```

## 🔄 Flujo de Uso

1. **Información Personal**: Completa nombre, documento, edad, teléfono y email
2. **Validación automática**: El sistema valida formato de teléfono, email y edad
3. **Años de experiencia**: Ingresa experiencia laboral
4. **Idiomas**: Selecciona del menú desplegable y añade con el botón "+"
5. **Certificaciones**: Selecciona del menú desplegable y añade con el botón "+"
6. **Disponibilidad**: Elige horarios/días disponibles
7. **Foto**: Sube una foto de perfil
8. **Estado**: Define si es activo o inactivo
9. **Guardar**: Envía cuando el formulario esté 100% completo

## 💡 Ejemplos de Uso

### Ejemplo 1: Guía bilingüe con certificaciones

```typescript
{
  nombreCompleto: "María García López",
  documento: "1234567890",
  edad: "32",
  telefono: "+593987654321",
  correo: "maria@email.com",
  idiomas: ["Español", "Inglés"],
  certificaciones: ["Primeros auxilios", "Guía certificado internacional"],
  anosExperiencia: "8",
  disponibilidad: "Disponibilidad completa",
  foto: "https://cloudinary.com/...",
  estado: "activo"
}
```

## 🔄 Próximas Mejoras

1. **Backend Integration**
   ```typescript
   const onSubmit = async (data: GuiaData) => {
     const response = await fetch('/api/guias', {
       method: 'POST',
       headers: { 'Content-Type': 'application/json' },
       body: JSON.stringify(data),
     });
   };
   ```

2. **Cloudinary Integration**
   ```typescript
   const uploadFotoCloudinary = async (file: File) => {
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

3. **Persistencia Local**
   ```typescript
   useEffect(() => {
     localStorage.setItem('guia-draft', JSON.stringify(formValues));
   }, [formValues]);
   ```

4. **Validación de Certificaciones**
   - Solicitar documento de certificación
   - Validar fecha de vencimiento

## 🎨 Personalización

### Agregar más idiomas:

```typescript
const IDIOMAS_OPCIONES = [
  // ... existentes
  "Mandarín",
  "Ruso",
];
```

### Agregar más certificaciones:

```typescript
const CERTIFICACIONES_OPCIONES = [
  // ... existentes
  "Nuevas certificaciones",
];
```

### Agregar disponibilidades:

```typescript
const DISPONIBILIDADES = [
  // ... existentes
  "Turno matutino",
  "Turno vespertino",
];
```

## 📱 Componentes Utilizados

- **Input** - Campos de texto y número
- **Select** - Listas desplegables para idiomas y certificaciones
- **Checkbox** (indirectamente para validaciones)
- **Badge** - Visualización de idiomas y certificaciones
- **Card** - Secciones del formulario
- **Progress** - Barra de progreso
- **Label** - Etiquetas de campos
- **Button** - Acciones y agregación
- **Alert** - Mensajes de estado
- **Separator** - División visual entre secciones

## 📞 Soporte

Para cualquier duda o mejora, contacta al equipo de desarrollo.

## 🔐 Validaciones Implementadas

| Campo | Validación |
|-------|-----------|
| Nombre | Mínimo 5 caracteres |
| Documento | Mínimo 10 caracteres |
| Edad | 18-80 años |
| Teléfono | Formato ecuatoriano (+593 o 09XX) |
| Correo | Formato email válido |
| Experiencia | Mayor o igual a 0 |
| Idiomas | Al menos 1 requerido |
| Certificaciones | Al menos 1 requerida |
| Disponibilidad | Requerida |
| Estado | Requerido |

# Formulario de Registro de Visitantes

## 📋 Descripción

Formulario simplificado para registrar información de visitantes a sitios turísticos con enfoque en seguridad, contacto y condiciones médicas relevantes. Incluye barra de progreso dinámica y validaciones apropiadas.

## 🎯 Características Implementadas

### ✅ Campos del Formulario

#### Sección 1: Información Personal

1. **Nombres y apellidos** (Texto obligatorio)
   - Validación: Mínimo 5 caracteres
   - Placeholder: "Ej: Juan Carlos Rodríguez García"

2. **Documento** (Texto obligatorio)
   - Cédula o pasaporte
   - Validación: Mínimo 8 caracteres
   - Icono de documento integrado
   - Placeholder: "Cédula / Pasaporte"

3. **Edad** (Número obligatorio)
   - Rango: 1-120 años
   - Validación automática de rango
   - Placeholder: "Ej: 35"

4. **Nacionalidad** (Lista desplegable obligatoria)
   - 41 nacionalidades predefinidas:
     - Países de América Latina
     - Países europeos
     - Países asiáticos
     - Países oceánicos
     - Opción "Otro"
   - Búsqueda en desplegable

#### Sección 2: Información de Contacto

5. **Teléfono** (Texto obligatorio)
   - Validación para números ecuatorianos: +593 o 0 seguido de 9 y 8-9 dígitos
   - Icono de teléfono integrado
   - Placeholder: "Ej: 0987654321"
   - Nota: Formato requerido

6. **Correo electrónico** (Email obligatorio)
   - Validación de formato email con regex
   - Icono de correo integrado
   - Placeholder: "Ej: visitante@email.com"

#### Sección 3: Información de la Visita

7. **Tipo de visitante** (Lista desplegable obligatoria)
   - Opciones:
     - Individual
     - Grupo
   - Icono de usuarios

8. **Fecha de visita** (Fecha obligatoria)
   - Selector de fecha con calendario
   - Previene seleccionar fechas pasadas
   - Icono de calendario integrado

#### Sección 4: Información Médica (Opcional)

9. **Condiciones médicas relevantes** (Texto opcional)
   - Alergias, movilidad, claustrofobia, presión arterial, etc.
   - Textarea para múltiples líneas
   - No obligatorio pero importante
   - Nota: Información confidencial
   - Alerta visual sobre privacidad

### 📊 Barra de Progreso

- **Cálculo inteligente**: Valida 8 campos obligatorios (condiciones médicas es opcional)
- **Actualización en tiempo real**: Refleja cambios inmediatos
- **Indicador visual**: Porcentaje con badge de estado
- **Validaciones incluidas**: Edad, teléfono, email, fechas, etc.
- **Resumen al 100%**: Mensaje verde de confirmación
- **Control de envío**: Botón guardar deshabilitado hasta completar

### 🎨 Diseño y Estilos

- ✅ 4 cards temáticas bien organizadas
- ✅ Iconos descriptivos en cada sección (User, Phone, Calendar, AlertTriangle)
- ✅ Validaciones visuales con mensajes claros
- ✅ Responsive design para todos los dispositivos
- ✅ Alerta de privacidad para datos médicos
- ✅ Grid responsivo para campos de entrada

### 🔧 Funcionalidades

- ✅ Validación de edad (1-120 años)
- ✅ Validación de teléfono ecuatoriano
- ✅ Validación de email con regex
- ✅ Selector de fecha sin fechas pasadas
- ✅ 41 nacionalidades predefinidas
- ✅ Toast notifications para feedback
- ✅ Cálculo automático del progreso
- ✅ Información confidencial protegida
- ✅ Navegación con botón "Volver"

## 🚀 Uso

### Acceso al Formulario

Navega a: `/nuevo-visitante`

### Integración en el Código

```tsx
import AddVisitanteForm from "@/components/forms/AddVisitanteForm";

// Usar en cualquier componente
<AddVisitanteForm />
```

## 📝 Estructura de Datos

```typescript
interface VisitanteData {
  nombresApellidos: string;
  documento: string;
  telefono: string;
  correo: string;
  nacionalidad: string;
  condicionesMedicas: string;        // Opcional
  edad: string;
  tipoVisitante: string;             // "Individual" | "Grupo"
  fechaVisita: string;               // YYYY-MM-DD
}
```

## 🔄 Flujo de Uso

1. **Información Personal**: Nombre, documento, edad y nacionalidad
2. **Validación automática**: Sistema valida edad (1-120) y documento (mínimo 8)
3. **Contacto**: Teléfono y email con validaciones específicas
4. **Visita**: Tipo (individual/grupo) y fecha
5. **Médico**: Condiciones relevantes (opcional pero recomendado)
6. **Guardar**: Envía cuando esté 100% completo

## 💡 Ejemplos de Uso

### Ejemplo 1: Visitante individual de turista

```typescript
{
  nombresApellidos: "María García López",
  documento: "1234567890",
  telefono: "+593987654321",
  correo: "maria.garcia@email.com",
  nacionalidad: "Colombia",
  condicionesMedicas: "Sin condiciones relevantes",
  edad: "28",
  tipoVisitante: "Individual",
  fechaVisita: "2025-12-20"
}
```

### Ejemplo 2: Grupo con condición médica

```typescript
{
  nombresApellidos: "Juan Rodríguez López",
  documento: "0987654321",
  telefono: "0987654321",
  correo: "juan@email.com",
  nacionalidad: "España",
  condicionesMedicas: "Alergia a penicilina, asma leve",
  edad: "45",
  tipoVisitante: "Grupo",
  fechaVisita: "2025-12-22"
}
```

## 🔄 Próximas Mejoras

1. **Backend Integration**
   ```typescript
   const onSubmit = async (data: VisitanteData) => {
     const response = await fetch('/api/visitantes', {
       method: 'POST',
       headers: { 'Content-Type': 'application/json' },
       body: JSON.stringify(data),
     });
   };
   ```

2. **Persistencia en BD**
   - Guardado de historial de visitantes
   - Estadísticas de visitación
   - Reporte de alertas médicas

3. **Validación avanzada**
   - Verificación de documento en base de datos
   - Detección de duplicados
   - Historial de visitas previas

4. **Confirmación de email**
   - Envío de confirmación
   - Código de acceso para entrada
   - Recordatorios de visita

5. **Exportación**
   - Reporte PDF de visitantes
   - Estadísticas diarias/semanales
   - Datos en Excel

## 🎨 Personalización

### Agregar más nacionalidades:

```typescript
const NACIONALIDADES = [
  // ... existentes
  "Nueva nacionalidad",
];
```

### Agregar tipos de visitante:

```typescript
const TIPOS_VISITANTE = [
  "Individual",
  "Grupo",
  "Escolar",
  "Familiar",
];
```

### Personalizar alerta médica:

```tsx
<Alert className="bg-blue-50 border-blue-200">
  <AlertCircle className="h-4 w-4 text-blue-600" />
  <AlertDescription className="text-blue-800">
    Mensaje personalizado...
  </AlertDescription>
</Alert>
```

## 📱 Componentes Utilizados

- **Input** - Campos de texto, número y email
- **Textarea** - Descripciones largas
- **Select** - Listas desplegables
- **Card** - Secciones temáticas
- **Progress** - Barra de progreso
- **Badge** - Indicadores de estado
- **Label** - Etiquetas de campos
- **Button** - Acciones
- **Alert** - Mensajes de privacidad
- **Separator** - Divisiones visuales

## 🔐 Validaciones Implementadas

| Campo | Validación |
|-------|-----------|
| Nombres | Mínimo 5 caracteres |
| Documento | Mínimo 8 caracteres |
| Edad | 1-120 años |
| Teléfono | Formato ecuatoriano (+593 o 09XX) |
| Correo | Formato email válido |
| Nacionalidad | Requerida (lista) |
| Tipo visitante | Requerido (lista) |
| Fecha | No anterior a hoy |
| Médicas | Opcional (pero importante) |

## 🛡️ Privacidad y Seguridad

- ✅ Información médica confidencial
- ✅ Almacenamiento seguro recomendado
- ✅ Acceso limitado a personal autorizado
- ✅ Cumplimiento de regulaciones de privacidad
- ✅ Alerta visual sobre protección de datos

## 📞 Soporte

Para cualquier duda o mejora, contacta al equipo de desarrollo.

## 📊 Casos de Uso

1. **Registro en entrada**: Capturar datos rápidamente en acceso
2. **Seguimiento de seguridad**: Tener datos de emergencia disponibles
3. **Estadísticas**: Analizar tipos y patrones de visitantes
4. **Accesibilidad**: Adaptar experiencia según condiciones médicas
5. **Comunicación**: Contactar para encuestas post-visita

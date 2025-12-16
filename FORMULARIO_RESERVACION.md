# Formulario de Reservación y Calendario

## 📋 Descripción

Formulario avanzado para gestionar reservaciones, horarios, disponibilidad y configuración de precios con barra de progreso interactiva.

## 🎯 Características Implementadas

### ✅ Campos del Formulario

1. **Sitio asociado** (Lista desplegable)
   - Selecciona el sitio turístico para el cual se configura la reservación
   - Incluye sitios predefinidos del sistema

2. **Horario por día** (Tabla interactiva)
   - Configurable para cada día de la semana (Lunes a Domingo)
   - Campos editables para hora de inicio y fin
   - Checkbox para activar/desactivar cada día
   - Botones rápidos para aplicar horarios estándar:
     - "Horario Laboral": Lunes a Viernes 8:00-17:00, Sábado 8:00-16:00
     - "Con Fin de Semana": Todos los días activos con horarios apropiados

3. **Fechas no disponibles** (Selector de fechas múltiple)
   - Calendario interactivo para marcar cierres y mantenimiento
   - Previene seleccionar fechas pasadas
   - Vista previa de todas las fechas seleccionadas
   - Opción de eliminar fechas individuales

4. **Capacidad máxima por día** (Número)
   - Aforo total permitido para un día completo
   - Validación: Mayor a 0

5. **Capacidad por horario** (Número)
   - Aforo para bloques/horarios específicos
   - Validación: Mayor a 0

6. **Tolerancia** (Número)
   - Minutos de tolerancia para llegadas tarde
   - Validación: 0 o mayor

7. **Tipo de reservación** (Lista desplegable)
   - Opciones: Individual, Grupos, Agencias, Todos

8. **Precio** (Número decimal)
   - Precio por persona o paquete
   - Validación: No negativo
   - Paso decimal para centavos

9. **Guía obligatorio** (Lista desplegable)
   - Opciones: Sí, No, Opcional

### 📊 Barra de Progreso

- **Dinámica**: Se actualiza en tiempo real mientras completas campos
- **Indicador visual**: Porcentaje con badge de estado
- **Validación inteligente**: Reconoce si hay al menos un horario activo
- **Mensaje de confirmación**: Aparece al 100% con resumen
- **Control de envío**: Botón guardar deshabilitado hasta completar

### 🎨 Diseño y Estilos

El formulario utiliza:
- ✅ Componentes UI consistentes del sistema
- ✅ Tabla para horarios con inputs inline
- ✅ Calendario integrado (react-day-picker)
- ✅ Cards por secciones temáticas
- ✅ Badges de estado
- ✅ Iconos descriptivos (Lucide React)
- ✅ Alertas y confirmaciones visuales
- ✅ Responsive design

### 🔧 Funcionalidades

- ✅ Tabla de horarios editable con validación
- ✅ Selector de fechas con calendario
- ✅ Aplicación rápida de horarios estándar
- ✅ Eliminación de fechas no disponibles
- ✅ Cálculo automático del progreso
- ✅ Toast notifications para feedback
- ✅ Validación en tiempo real
- ✅ Vista previa de fechas seleccionadas
- ✅ Inputs deshabilitados cuando el día no está activo
- ✅ Navegación con botón "Volver"

## 🚀 Uso

### Acceso al Formulario

Navega a: `/nueva-reservacion`

### Integración en el Código

```tsx
import AddReservacionForm from "@/components/forms/AddReservacionForm";

// Usar en cualquier componente
<AddReservacionForm />
```

## 📝 Estructura de Datos

```typescript
interface ReservacionData {
  sitioAsociado: string;
  horarios: {
    [dia: string]: {
      inicio: string;      // Formato HH:MM
      fin: string;         // Formato HH:MM
      activo: boolean;
    };
  };
  fechasNoDisponibles: Date[];
  capacidadMaximaDia: string;
  capacidadPorHorario: string;
  tolerancia: string;      // Minutos
  tipoReservacion: string;
  precio: string;          // Número decimal
  guiaObligatorio: string; // "si" | "no" | "opcional"
}
```

## 🔄 Flujo de Uso

1. **Seleccionar Sitio**: Elige el sitio turístico asociado
2. **Configurar Horarios**: 
   - Edita los horarios día por día, o
   - Usa botones rápidos para aplicar patrones estándar
3. **Marcar Fechas No Disponibles**: 
   - Abre el calendario
   - Haz clic en las fechas de cierre
4. **Establecer Capacidades**: 
   - Aforo máximo del día
   - Aforo por horario/bloque
5. **Configurar Precios**: 
   - Precio y tipo de reservación
   - Tolerancia de llegada
6. **Definir Guía**: Indica si es obligatorio
7. **Guardar**: Envía el formulario al completar

## 💡 Ejemplos de Uso

### Ejemplo 1: Sendero con reservaciones grupales

```typescript
{
  sitioAsociado: "Laguna de Quilotoa",
  horarios: {
    Lunes: { inicio: "08:00", fin: "17:00", activo: true },
    // ... otros días
  },
  fechasNoDisponibles: [new Date(2024, 11, 25), new Date(2024, 11, 26)],
  capacidadMaximaDia: "30",
  capacidadPorHorario: "10",
  tolerancia: "15",
  tipoReservacion: "Grupos",
  precio: "45.00",
  guiaObligatorio: "si"
}
```

## 🔄 Próximas Mejoras

1. **Backend Integration**
   ```typescript
   const onSubmit = async (data: ReservacionData) => {
     const response = await fetch('/api/reservaciones', {
       method: 'POST',
       headers: { 'Content-Type': 'application/json' },
       body: JSON.stringify(data),
     });
   };
   ```

2. **Validación Avanzada**
   - Que capacidadPorHorario ≤ capacidadMaximaDia
   - Que hora fin > hora inicio

3. **Persistencia Local**
   ```typescript
   useEffect(() => {
     localStorage.setItem('reservacion-draft', JSON.stringify(formValues));
   }, [formValues]);
   ```

4. **Importación de Horarios**
   - CSV con horarios predefinidos

5. **Calendario Visual**
   - Vista previa de disponibilidad
   - Grilla de disponibilidad visual

## 🎨 Personalización

### Agregar más sitios:

```typescript
const SITIOS_TURISTICOS = [
  // ... existentes
  "Nuevo Sitio",
];
```

### Agregar horarios predefinidos:

```typescript
const PRESETS_HORARIOS = {
  nocturno: { inicio: "18:00", fin: "23:00" },
  // ...
};
```

## 📱 Componentes Utilizados

- **Table** (ui/table) - Para horarios
- **Calendar** (ui/calendar) - Selector de fechas
- **Input** - Campos de hora y número
- **Select** - Listas desplegables
- **Checkbox** - Validación y opciones booleanas
- **Card** - Secciones del formulario
- **Progress** - Barra de progreso
- **Badge** - Indicadores de estado
- **Button** - Acciones

## 📞 Soporte

Para cualquier duda o mejora, contacta al equipo de desarrollo.

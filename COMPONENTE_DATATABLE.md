# 📊 Componente DataTable - Documentación Completa

## 🎯 Descripción

`DataTable` es un componente de tabla reutilizable y altamente configurable que cumple con todos los criterios de usabilidad del proyecto. Incluye búsqueda en tiempo real, ordenamiento, paginación, selección múltiple y exportación de datos.

---

## ✨ Características Principales

### ✅ Búsqueda y Filtrado
- **Búsqueda global** en tiempo real en todas las columnas
- **Filtros por columna** individuales
- Resaltado visual de filtros activos
- Botón de "Limpiar filtros"

### ✅ Ordenamiento
- Click en encabezados para ordenar
- Indicadores visuales (flechas)
- Ordenamiento ascendente/descendente
- Soporte para múltiples tipos de datos

### ✅ Paginación
- Navegación entre páginas
- Selector de filas por página (10, 25, 50, 100)
- Botones de primera/última página
- Indicador de posición actual

### ✅ Selección Múltiple
- Checkbox en cada fila
- Seleccionar/deseleccionar todas las filas
- Contador de elementos seleccionados
- Estado visual de selección

### ✅ Exportación de Datos
- Exportar a **CSV**
- Exportar a **JSON**
- Exportar seleccionados o todos los datos
- Nombres de archivo con fecha automática

### ✅ Accesibilidad
- Navegación por teclado
- Labels ARIA apropiados
- Indicadores de foco visibles
- Compatible con lectores de pantalla

### ✅ Responsive
- Diseño adaptable a móviles y tablets
- Scroll horizontal en pantallas pequeñas
- Controles optimizados para touch

---

## 📦 Archivos Creados

```
src/
├── components/ui/
│   └── data-table.tsx          # Componente principal
├── lib/
│   └── export-utils.ts         # Utilidades de exportación
├── hooks/
│   └── useTableHooks.ts        # Hooks personalizados
└── pages/
    └── GestionVisitantes.tsx   # Ejemplo de uso
```

---

## 🚀 Uso Básico

### 1. Importar el Componente

```tsx
import { DataTable, Column } from "@/components/ui/data-table";
```

### 2. Definir las Columnas

```tsx
interface Usuario {
  id: string;
  nombre: string;
  email: string;
  rol: string;
  activo: boolean;
}

const columns: Column<Usuario>[] = [
  {
    key: "nombre",
    label: "Nombre",
    sortable: true,
    filterable: true,
  },
  {
    key: "email",
    label: "Email",
    sortable: true,
  },
  {
    key: "rol",
    label: "Rol",
    sortable: true,
    render: (value) => (
      <Badge>{value}</Badge>
    ),
  },
  {
    key: "activo",
    label: "Estado",
    render: (value) => (
      value ? "✅ Activo" : "❌ Inactivo"
    ),
  },
];
```

### 3. Usar el Componente

```tsx
function MiTabla() {
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);

  return (
    <DataTable
      data={usuarios}
      columns={columns}
      searchPlaceholder="Buscar usuarios..."
      enableSelection={true}
      enableExport={true}
      onRowClick={(usuario) => console.log(usuario)}
    />
  );
}
```

---

## 🎨 Propiedades del Componente

| Propiedad | Tipo | Requerido | Default | Descripción |
|-----------|------|-----------|---------|-------------|
| `data` | `T[]` | ✅ | - | Array de datos a mostrar |
| `columns` | `Column<T>[]` | ✅ | - | Definición de columnas |
| `searchable` | `boolean` | ❌ | `true` | Habilitar búsqueda global |
| `searchPlaceholder` | `string` | ❌ | "Buscar..." | Texto del campo de búsqueda |
| `onRowClick` | `(row: T) => void` | ❌ | - | Callback al hacer click en fila |
| `onSelectionChange` | `(rows: T[]) => void` | ❌ | - | Callback cuando cambia selección |
| `onExport` | `(data: T[], format) => void` | ❌ | - | Callback personalizado de exportación |
| `onDelete` | `(rows: T[]) => void` | ❌ | - | Callback para eliminar seleccionados |
| `rowsPerPageOptions` | `number[]` | ❌ | `[10, 25, 50, 100]` | Opciones de filas por página |
| `initialRowsPerPage` | `number` | ❌ | `10` | Filas por página iniciales |
| `emptyMessage` | `string` | ❌ | "No se encontraron resultados" | Mensaje cuando no hay datos |
| `loading` | `boolean` | ❌ | `false` | Mostrar estado de carga |
| `enableSelection` | `boolean` | ❌ | `true` | Habilitar selección de filas |
| `enableExport` | `boolean` | ❌ | `true` | Habilitar botones de exportación |
| `enableDelete` | `boolean` | ❌ | `true` | Habilitar botón de eliminar |
| `stickyHeader` | `boolean` | ❌ | `true` | Encabezado fijo al hacer scroll |
| `getRowId` | `(row: T) => string\|number` | ❌ | - | Función para obtener ID único de fila |
| `className` | `string` | ❌ | - | Clases CSS adicionales |

---

## 🏗️ Definición de Columnas

```tsx
interface Column<T> {
  key: keyof T | string;          // Clave del dato
  label: string;                   // Título de la columna
  sortable?: boolean;              // Permitir ordenamiento
  filterable?: boolean;            // Permitir filtrado
  render?: (value: any, row: T) => ReactNode;  // Render personalizado
  width?: string;                  // Ancho de columna (ej: "120px")
  align?: "left" | "center" | "right";  // Alineación
}
```

### Ejemplo con Render Personalizado

```tsx
{
  key: "estado",
  label: "Estado",
  sortable: true,
  render: (value, row) => {
    const colors = {
      activo: "green",
      pendiente: "yellow",
      inactivo: "red"
    };
    return (
      <Badge style={{ backgroundColor: colors[value] }}>
        {value.toUpperCase()}
      </Badge>
    );
  }
}
```

---

## 🔧 Utilidades de Exportación

### Importar

```tsx
import {
  exportToCSV,
  exportToJSON,
  exportToExcel,
  copyToClipboard,
  printTable,
  generateDataSummary
} from "@/lib/export-utils";
```

### Exportar a CSV

```tsx
exportToCSV(data, {
  filename: "usuarios_2026.csv",
  excludeColumns: ["password", "acciones"]
});
```

### Exportar a JSON

```tsx
exportToJSON(data, {
  filename: "usuarios.json",
  columns: ["id", "nombre", "email"] // Solo estas columnas
});
```

### Copiar al Portapapeles

```tsx
await copyToClipboard(data, "csv");
```

### Imprimir Tabla

```tsx
printTable(data, "Lista de Usuarios");
```

### Generar Resumen Estadístico

```tsx
const summary = generateDataSummary(data);
console.log(summary);
// {
//   total: 100,
//   columns: 5,
//   edad: { min: 18, max: 65, avg: 35.5 },
//   ...
// }
```

---

## 🪝 Hooks Personalizados

### useTableData

Maneja el estado de datos, filtrado, ordenamiento y paginación.

```tsx
import { useTableData } from "@/hooks/useTableHooks";

function MiComponente() {
  const {
    data,              // Datos paginados
    allData,           // Todos los datos filtrados
    searchTerm,
    sortKey,
    sortDirection,
    currentPage,
    totalPages,
    handleSort,
    handleSearch,
    handlePageChange,
    resetFilters,
  } = useTableData(initialData, {
    initialPageSize: 10,
    searchKeys: ["nombre", "email"]
  });

  return <div>...</div>;
}
```

### useTableSelection

Maneja la selección de filas.

```tsx
import { useTableSelection } from "@/hooks/useTableHooks";

function MiComponente() {
  const {
    selectedIds,
    selectedItems,
    selectedCount,
    isSelected,
    toggleSelection,
    selectAll,
    clearSelection,
    isAllSelected,
  } = useTableSelection(data, (item) => item.id);

  return <div>...</div>;
}
```

### useTableOperations

Maneja operaciones asíncronas con estados de carga y error.

```tsx
import { useTableOperations } from "@/hooks/useTableHooks";

function MiComponente() {
  const { isLoading, error, executeOperation } = useTableOperations();

  const handleDelete = async () => {
    await executeOperation(async () => {
      await api.delete(selectedIds);
      reloadData();
    });
  };

  return <div>...</div>;
}
```

### useDebouncedSearch

Optimiza la búsqueda con debounce.

```tsx
import { useDebouncedSearch } from "@/hooks/useTableHooks";

function MiComponente() {
  const [debouncedValue, value, setValue] = useDebouncedSearch("", 300);

  useEffect(() => {
    // Esta búsqueda se ejecuta 300ms después de que el usuario deje de escribir
    performSearch(debouncedValue);
  }, [debouncedValue]);

  return (
    <input
      value={value}
      onChange={(e) => setValue(e.target.value)}
    />
  );
}
```

---

## 💡 Ejemplos Avanzados

### Tabla con Acciones por Fila

```tsx
const columns: Column<Usuario>[] = [
  // ... otras columnas
  {
    key: "acciones",
    label: "Acciones",
    width: "150px",
    align: "center",
    render: (_, row) => (
      <div className="flex gap-2">
        <Button
          size="icon"
          variant="ghost"
          onClick={(e) => {
            e.stopPropagation();
            handleEdit(row);
          }}
        >
          <Edit className="h-4 w-4" />
        </Button>
        <Button
          size="icon"
          variant="ghost"
          onClick={(e) => {
            e.stopPropagation();
            handleDelete(row);
          }}
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
    ),
  },
];
```

### Tabla con Imágenes

```tsx
{
  key: "avatar",
  label: "Avatar",
  render: (url, row) => (
    <img
      src={url}
      alt={row.nombre}
      className="w-10 h-10 rounded-full"
    />
  ),
}
```

### Tabla con Estado de Carga

```tsx
const [loading, setLoading] = useState(true);

useEffect(() => {
  fetchData().then(data => {
    setUsuarios(data);
    setLoading(false);
  });
}, []);

<DataTable
  data={usuarios}
  columns={columns}
  loading={loading}
/>
```

### Exportación Personalizada

```tsx
<DataTable
  data={usuarios}
  columns={columns}
  onExport={(data, format) => {
    // Transformar datos antes de exportar
    const transformed = data.map(u => ({
      ...u,
      nombreCompleto: `${u.nombre} ${u.apellido}`
    }));
    
    if (format === "csv") {
      exportToCSV(transformed);
    } else {
      exportToJSON(transformed);
    }
  }}
/>
```

---

## 🎯 Integración con el Proyecto

### 1. Página de Gestión Creada

Ya está creada la página de ejemplo en:
- **Archivo**: `src/pages/GestionVisitantes.tsx`
- **Ruta**: `/visitantes`
- **Acceso**: Solo administradores y guías

### 2. Agregar al Menú

Ya se agregó al sidebar en `AppSidebar.tsx`:
- Administradores: "Gestión Visitantes"
- Guías: "Ver Visitantes"

### 3. Rutas Configuradas

Ya se agregaron las rutas en `App.tsx`:
```tsx
<Route
  path="visitantes"
  element={
    <ProtectedRoute roles={["administrador", "guia"]}>
      <GestionVisitantes />
    </ProtectedRoute>
  }
/>
```

---

## 🎨 Personalización

### Estilos Personalizados

```tsx
<DataTable
  className="custom-table"
  data={data}
  columns={columns}
/>

// En tu CSS
.custom-table {
  border-radius: 12px;
  box-shadow: 0 4px 6px rgba(0,0,0,0.1);
}
```

### Columnas con Valores Anidados

```tsx
{
  key: "direccion.ciudad",  // Accede a obj.direccion.ciudad
  label: "Ciudad",
  sortable: true,
}
```

---

## ♿ Accesibilidad

El componente incluye:

- ✅ **ARIA labels** en todos los controles
- ✅ **Navegación por teclado** completa
- ✅ **Focus visible** en elementos interactivos
- ✅ **Lectores de pantalla** con descripciones claras
- ✅ **Contraste de colores** adecuado
- ✅ **Mensajes de estado** para operaciones

### Atajos de Teclado

- `Tab` / `Shift+Tab`: Navegar entre elementos
- `Space`: Seleccionar/deseleccionar fila
- `Enter`: Activar acción en fila
- `Arrow Up/Down`: Navegar entre filas (con focus)

---

## 📊 Rendimiento

### Optimizaciones Incluidas

1. **Memoización** con `useMemo` para cálculos pesados
2. **Callbacks** con `useCallback` para evitar re-renders
3. **Paginación** reduce el DOM renderizado
4. **Búsqueda debounced** en hooks personalizados
5. **Virtual scrolling** (puede agregarse si es necesario)

### Mejores Prácticas

```tsx
// ✅ BUENO: Pasar función estable
const handleRowClick = useCallback((row) => {
  console.log(row);
}, []);

<DataTable onRowClick={handleRowClick} />

// ❌ MALO: Crear función en render
<DataTable onRowClick={(row) => console.log(row)} />
```

---

## 🐛 Solución de Problemas

### La búsqueda no funciona en columnas específicas

Asegúrate de que el `key` de la columna coincida con la propiedad del objeto:

```tsx
// ❌ INCORRECTO
{ key: "fullName", ... }  // pero el objeto tiene "nombre"

// ✅ CORRECTO
{ key: "nombre", label: "Nombre Completo", ... }
```

### Los datos no se ordenan correctamente

Verifica que los valores sean comparables:

```tsx
// Para fechas, convierte a Date
{
  key: "fecha",
  sortable: true,
  render: (value) => new Date(value).toLocaleDateString()
}
```

### Exportación no incluye datos transformados

Usa el callback `onExport` personalizado:

```tsx
onExport={(data, format) => {
  const transformed = data.map(row => ({
    ...row,
    // Tus transformaciones
  }));
  exportToCSV(transformed);
}}
```

---

## 🚀 Próximas Mejoras

- [ ] Virtual scrolling para grandes volúmenes de datos
- [ ] Filtros avanzados con operadores (>, <, contains, etc.)
- [ ] Resaltado de búsqueda en resultados
- [ ] Agrupación de filas
- [ ] Columnas redimensionables
- [ ] Drag & drop para reordenar columnas
- [ ] Guardado de preferencias de usuario

---

## 📝 Notas Finales

Este componente cumple con **todos los requisitos** del formulario de consulta especificado en el documento de usabilidad:

- ✅ Tabla responsive
- ✅ Encabezados claros
- ✅ Búsqueda global en tiempo real
- ✅ Filtros dinámicos
- ✅ Ordenamiento ascendente/descendente
- ✅ Acciones por fila (ver, editar, eliminar)
- ✅ Selección individual y múltiple
- ✅ Navegación por teclado
- ✅ Indicador de foco visible
- ✅ Estados de carga visibles
- ✅ Confirmaciones visuales

**¡El componente está listo para usar en todo el proyecto!** 🎉

---

## 📞 Soporte

Para dudas o mejoras, revisa:
- Código fuente en `src/components/ui/data-table.tsx`
- Ejemplo completo en `src/pages/GestionVisitantes.tsx`
- Documentación de shadcn/ui: https://ui.shadcn.com/

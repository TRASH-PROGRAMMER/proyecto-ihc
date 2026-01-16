import React, { useState, useMemo, useCallback } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Search,
  ChevronUp,
  ChevronDown,
  ChevronsUpDown,
  Download,
  Trash2,
  RefreshCw,
  Filter,
  X,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  HelpCircle,
  AlertCircle,
  CheckCircle2,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

// Tipos
export interface Column<T> {
  key: keyof T | string;
  label: string;
  sortable?: boolean;
  filterable?: boolean;
  render?: (value: any, row: T) => React.ReactNode;
  width?: string;
  align?: "left" | "center" | "right";
}

export interface DataTableProps<T> {
  data: T[];
  columns: Column<T>[];
  searchable?: boolean;
  searchPlaceholder?: string;
  onRowClick?: (row: T) => void;
  onSelectionChange?: (selectedRows: T[]) => void;
  onExport?: (data: T[], format: "csv" | "json") => void;
  onDelete?: (selectedRows: T[]) => void;
  rowsPerPageOptions?: number[];
  initialRowsPerPage?: number;
  emptyMessage?: string;
  loading?: boolean;
  className?: string;
  enableSelection?: boolean;
  enableExport?: boolean;
  enableDelete?: boolean;
  stickyHeader?: boolean;
  getRowId?: (row: T) => string | number;
  // ISO 9241-11: Mejoras de usabilidad
  title?: string;                    // Adecuación reconocible
  description?: string;               // Aprendibilidad
  helpText?: string;                  // Aprendibilidad
  showHelp?: boolean;                 // Aprendibilidad
  confirmDelete?: boolean;            // Protección contra errores
  showStats?: boolean;                // Eficacia (feedback visual)
  enableKeyboardShortcuts?: boolean;  // Operabilidad
  customEmptyState?: React.ReactNode; // Estética
  showSuccessMessages?: boolean;      // Satisfacción
}

type SortDirection = "asc" | "desc" | null;

export function DataTable<T extends Record<string, any>>({
  data,
  columns,
  searchable = true,
  searchPlaceholder = "Buscar...",
  onRowClick,
  onSelectionChange,
  onExport,
  onDelete,
  rowsPerPageOptions = [10, 25, 50, 100],
  initialRowsPerPage = 10,
  emptyMessage = "No se encontraron resultados",
  loading = false,
  className,
  enableSelection = true,
  enableExport = true,
  enableDelete = true,
  stickyHeader = true,
  getRowId,
  // ISO 9241-11: Props de usabilidad
  title,
  description,
  helpText,
  showHelp = true,
  confirmDelete = true,
  showStats = true,
  enableKeyboardShortcuts = true,
  customEmptyState,
  showSuccessMessages = true,
}: DataTableProps<T>) {
  // Estados
  const [searchTerm, setSearchTerm] = useState("");
  const [sortColumn, setSortColumn] = useState<string | null>(null);
  const [sortDirection, setSortDirection] = useState<SortDirection>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(initialRowsPerPage);
  const [selectedRows, setSelectedRows] = useState<Set<string | number>>(new Set());
  const [columnFilters, setColumnFilters] = useState<Record<string, string>>({});

  // Función para obtener ID único de fila
  const getUniqueRowId = useCallback(
    (row: T, index: number): string | number => {
      if (getRowId) return getRowId(row);
      if (row.id !== undefined) return row.id;
      return index;
    },
    [getRowId]
  );

  // Obtener valor anidado de un objeto
  const getNestedValue = (obj: any, path: string): any => {
    return path.split(".").reduce((current, key) => current?.[key], obj);
  };

  // Filtrado y búsqueda
  const filteredData = useMemo(() => {
    let filtered = [...data];

    // Búsqueda global
    if (searchTerm) {
      const lowerSearch = searchTerm.toLowerCase();
      filtered = filtered.filter((row) =>
        columns.some((col) => {
          const value = getNestedValue(row, col.key as string);
          return value?.toString().toLowerCase().includes(lowerSearch);
        })
      );
    }

    // Filtros por columna
    Object.entries(columnFilters).forEach(([key, filterValue]) => {
      if (filterValue) {
        const lowerFilter = filterValue.toLowerCase();
        filtered = filtered.filter((row) => {
          const value = getNestedValue(row, key);
          return value?.toString().toLowerCase().includes(lowerFilter);
        });
      }
    });

    return filtered;
  }, [data, searchTerm, columnFilters, columns]);

  // Ordenamiento
  const sortedData = useMemo(() => {
    if (!sortColumn || !sortDirection) return filteredData;

    return [...filteredData].sort((a, b) => {
      const aValue = getNestedValue(a, sortColumn);
      const bValue = getNestedValue(b, sortColumn);

      if (aValue === bValue) return 0;
      if (aValue === null || aValue === undefined) return 1;
      if (bValue === null || bValue === undefined) return -1;

      const compareResult = aValue < bValue ? -1 : 1;
      return sortDirection === "asc" ? compareResult : -compareResult;
    });
  }, [filteredData, sortColumn, sortDirection]);

  // Paginación
  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * rowsPerPage;
    const end = start + rowsPerPage;
    return sortedData.slice(start, end);
  }, [sortedData, currentPage, rowsPerPage]);

  const totalPages = Math.ceil(sortedData.length / rowsPerPage);

  // Handlers
  const handleSort = (columnKey: string) => {
    const column = columns.find((col) => col.key === columnKey);
    if (!column?.sortable) return;

    if (sortColumn === columnKey) {
      if (sortDirection === "asc") {
        setSortDirection("desc");
      } else if (sortDirection === "desc") {
        setSortColumn(null);
        setSortDirection(null);
      }
    } else {
      setSortColumn(columnKey);
      setSortDirection("asc");
    }
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      const allIds = paginatedData.map((row, idx) => 
        getUniqueRowId(row, (currentPage - 1) * rowsPerPage + idx)
      );
      setSelectedRows(new Set(allIds));
    } else {
      setSelectedRows(new Set());
    }
  };

  const handleSelectRow = (rowId: string | number, checked: boolean) => {
    const newSelected = new Set(selectedRows);
    if (checked) {
      newSelected.add(rowId);
    } else {
      newSelected.delete(rowId);
    }
    setSelectedRows(newSelected);
  };

  const handleExport = (format: "csv" | "json") => {
    const dataToExport = selectedRows.size > 0
      ? data.filter((row, idx) => selectedRows.has(getUniqueRowId(row, idx)))
      : sortedData;

    // ISO 9241-11: Protección contra errores - Validar datos antes de exportar
    if (dataToExport.length === 0) {
      toast.error("No hay datos para exportar", {
        description: "Selecciona al menos un registro o verifica que haya datos en la tabla.",
        icon: <AlertCircle className="h-4 w-4" />,
      });
      return;
    }

    try {
      if (onExport) {
        onExport(dataToExport, format);
      } else {
        // Exportación por defecto
        if (format === "csv") {
          exportToCSV(dataToExport);
        } else {
          exportToJSON(dataToExport);
        }
      }

      // ISO 9241-11: Satisfacción - Feedback positivo
      if (showSuccessMessages) {
        toast.success(`Exportación exitosa a ${format.toUpperCase()}`, {
          description: `${dataToExport.length} registro(s) exportados correctamente.`,
          icon: <CheckCircle2 className="h-4 w-4" />,
        });
      }
    } catch (error) {
      // ISO 9241-11: Protección contra errores - Manejo de errores
      toast.error("Error al exportar", {
        description: "No se pudo completar la exportación. Intenta nuevamente.",
        icon: <AlertCircle className="h-4 w-4" />,
      });
      console.error("Error en exportación:", error);
    }
  };

  const handleDelete = () => {
    if (!onDelete || selectedRows.size === 0) return;
    
    // ISO 9241-11: Protección contra errores - Confirmación antes de eliminar
    if (confirmDelete) {
      const confirmMessage = selectedRows.size === 1
        ? "¿Estás seguro de eliminar este registro?"
        : `¿Estás seguro de eliminar ${selectedRows.size} registros?`;
      
      const userConfirmed = window.confirm(
        `${confirmMessage}\n\nEsta acción no se puede deshacer.`
      );
      
      if (!userConfirmed) {
        return;
      }
    }

    const rowsToDelete = data.filter((row, idx) => 
      selectedRows.has(getUniqueRowId(row, idx))
    );
    
    try {
      onDelete(rowsToDelete);
      setSelectedRows(new Set());

      // ISO 9241-11: Satisfacción - Feedback positivo
      if (showSuccessMessages) {
        toast.success("Eliminación exitosa", {
          description: `${rowsToDelete.length} registro(s) eliminados correctamente.`,
          icon: <CheckCircle2 className="h-4 w-4" />,
        });
      }
    } catch (error) {
      // ISO 9241-11: Protección contra errores - Manejo de errores
      toast.error("Error al eliminar", {
        description: "No se pudieron eliminar los registros. Intenta nuevamente.",
        icon: <AlertCircle className="h-4 w-4" />,
      });
      console.error("Error en eliminación:", error);
    }
  };

  const exportToCSV = (dataToExport: T[]) => {
    const headers = columns.map((col) => col.label).join(",");
    const rows = dataToExport.map((row) =>
      columns
        .map((col) => {
          const value = getNestedValue(row, col.key as string);
          // Escapar comillas y envolver en comillas si contiene coma
          const strValue = value?.toString() || "";
          return strValue.includes(",") ? `"${strValue.replace(/"/g, '""')}"` : strValue;
        })
        .join(",")
    );

    const csv = [headers, ...rows].join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `export_${new Date().toISOString().split("T")[0]}.csv`;
    link.click();
  };

  const exportToJSON = (dataToExport: T[]) => {
    const json = JSON.stringify(dataToExport, null, 2);
    const blob = new Blob([json], { type: "application/json" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `export_${new Date().toISOString().split("T")[0]}.json`;
    link.click();
  };

  const clearFilters = () => {
    setSearchTerm("");
    setColumnFilters({});
    setSortColumn(null);
    setSortDirection(null);
  };

  const isAllSelected = paginatedData.length > 0 && 
    paginatedData.every((row, idx) => 
      selectedRows.has(getUniqueRowId(row, (currentPage - 1) * rowsPerPage + idx))
    );

  const isSomeSelected = selectedRows.size > 0 && !isAllSelected;

  // Notificar cambios en selección
  React.useEffect(() => {
    if (onSelectionChange) {
      const selected = data.filter((row, idx) => 
        selectedRows.has(getUniqueRowId(row, idx))
      );
      onSelectionChange(selected);
    }
  }, [selectedRows, data, onSelectionChange, getUniqueRowId]);

  // ISO 9241-11: Operabilidad - Atajos de teclado
  React.useEffect(() => {
    if (!enableKeyboardShortcuts) return;

    const handleKeyPress = (e: KeyboardEvent) => {
      // Ctrl/Cmd + A: Seleccionar todas
      if ((e.ctrlKey || e.metaKey) && e.key === 'a' && enableSelection) {
        e.preventDefault();
        handleSelectAll(true);
        toast.info("Todas las filas seleccionadas", {
          description: `${paginatedData.length} registros seleccionados en esta página.`,
        });
      }
      
      // Ctrl/Cmd + E: Exportar a CSV
      if ((e.ctrlKey || e.metaKey) && e.key === 'e' && enableExport) {
        e.preventDefault();
        handleExport('csv');
      }

      // Escape: Limpiar selección
      if (e.key === 'Escape' && selectedRows.size > 0) {
        setSelectedRows(new Set());
        toast.info("Selección limpiada");
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [enableKeyboardShortcuts, enableSelection, enableExport, paginatedData.length, selectedRows.size]);

  return (
    <TooltipProvider>
    <div className={cn("space-y-4", className)}>
      {/* ISO 9241-11: Adecuación reconocible - Título y descripción */}
      {(title || description) && (
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            {title && (
              <h2 className="text-2xl font-bold text-foreground">{title}</h2>
            )}
            {showHelp && helpText && (
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-6 w-6">
                    <HelpCircle className="h-4 w-4 text-muted-foreground" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="right" className="max-w-sm">
                  <p className="text-sm">{helpText}</p>
                </TooltipContent>
              </Tooltip>
            )}
          </div>
          {description && (
            <p className="text-sm text-muted-foreground">{description}</p>
          )}
        </div>
      )}

      {/* ISO 9241-11: Eficacia - Estadísticas rápidas */}
      {showStats && data.length > 0 && (
        <div className="flex gap-4 p-4 bg-muted/30 rounded-lg border border-border animate-in fade-in duration-300">
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="font-mono">
              Total: {data.length}
            </Badge>
          </div>
          {searchTerm && (
            <div className="flex items-center gap-2">
              <Badge variant="secondary" className="font-mono">
                Filtrados: {sortedData.length}
              </Badge>
            </div>
          )}
          {selectedRows.size > 0 && (
            <div className="flex items-center gap-2">
              <Badge variant="default" className="font-mono">
                Seleccionados: {selectedRows.size}
              </Badge>
            </div>
          )}
        </div>
      )}

      {/* Barra de herramientas */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="flex-1 w-full sm:w-auto">
          {searchable && (
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder={searchPlaceholder}
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setCurrentPage(1);
                }}
                className="pl-9 max-w-sm"
                aria-label="Buscar en la tabla"
              />
            </div>
          )}
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          {(searchTerm || Object.keys(columnFilters).length > 0 || sortColumn) && (
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={clearFilters}
                  aria-label="Limpiar filtros"
                >
                  <X className="h-4 w-4 mr-2" />
                  Limpiar
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Restablecer búsqueda, filtros y ordenamiento</p>
              </TooltipContent>
            </Tooltip>
          )}

          {enableExport && (
            <div className="flex gap-1">
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleExport("csv")}
                    disabled={sortedData.length === 0}
                    aria-label="Exportar a CSV"
                  >
                    <Download className="h-4 w-4 mr-2" />
                    CSV
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Exportar datos a formato CSV (Ctrl+E)</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Compatible con Excel y Google Sheets
                  </p>
                </TooltipContent>
              </Tooltip>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleExport("json")}
                    disabled={sortedData.length === 0}
                    aria-label="Exportar a JSON"
                  >
                    <Download className="h-4 w-4 mr-2" />
                    JSON
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Exportar datos a formato JSON</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Ideal para programación y APIs
                  </p>
                </TooltipContent>
              </Tooltip>
            </div>
          )}

          {enableDelete && selectedRows.size > 0 && onDelete && (
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={handleDelete}
                  aria-label={`Eliminar ${selectedRows.size} elementos seleccionados`}
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Eliminar ({selectedRows.size})
                </Button>
              </TooltipTrigger>
              <TooltipContent side="left">
                <p className="font-semibold">Eliminar registros seleccionados</p>
                <p className="text-xs text-muted-foreground mt-1">
                  Se solicitará confirmación antes de eliminar
                </p>
              </TooltipContent>
            </Tooltip>
          )}
        </div>
      </div>

      {/* Información de resultados */}
      <div className="flex items-center justify-between text-sm text-muted-foreground">
        <div>
          {selectedRows.size > 0 ? (
            <span className="font-medium text-foreground">
              {selectedRows.size} de {sortedData.length} seleccionados
            </span>
          ) : (
            <span>
              Mostrando {paginatedData.length > 0 ? (currentPage - 1) * rowsPerPage + 1 : 0} -{" "}
              {Math.min(currentPage * rowsPerPage, sortedData.length)} de {sortedData.length}{" "}
              resultados
            </span>
          )}
        </div>

        {sortColumn && (
          <Badge variant="secondary" className="gap-1">
            <Filter className="h-3 w-3" />
            Ordenado por: {columns.find((c) => c.key === sortColumn)?.label}
          </Badge>
        )}
      </div>

      {/* Tabla */}
      <div className="rounded-md border bg-card overflow-hidden">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader className={cn(stickyHeader && "sticky top-0 bg-card z-10")}>
              <TableRow>
                {enableSelection && (
                  <TableHead className="w-12">
                    <Checkbox
                      checked={isAllSelected}
                      onCheckedChange={handleSelectAll}
                      aria-label="Seleccionar todas las filas"
                      className={cn(
                        isSomeSelected && "data-[state=checked]:bg-primary/50"
                      )}
                    />
                  </TableHead>
                )}
                {columns.map((column) => (
                  <TableHead
                    key={column.key as string}
                    style={{ width: column.width }}
                    className={cn(
                      column.align === "center" && "text-center",
                      column.align === "right" && "text-right",
                      column.sortable && "cursor-pointer select-none hover:bg-muted/50"
                    )}
                    onClick={() => column.sortable && handleSort(column.key as string)}
                  >
                    <div className="flex items-center gap-2">
                      <span>{column.label}</span>
                      {column.sortable && (
                        <div className="inline-flex">
                          {sortColumn === column.key ? (
                            sortDirection === "asc" ? (
                              <ChevronUp className="h-4 w-4" />
                            ) : (
                              <ChevronDown className="h-4 w-4" />
                            )
                          ) : (
                            <ChevronsUpDown className="h-4 w-4 text-muted-foreground/50" />
                          )}
                        </div>
                      )}
                    </div>
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell
                    colSpan={columns.length + (enableSelection ? 1 : 0)}
                    className="text-center py-12"
                  >
                    <div className="flex flex-col items-center gap-3 animate-in fade-in duration-500">
                      <RefreshCw className="h-8 w-8 animate-spin text-primary" />
                      <div>
                        <p className="text-sm font-medium text-foreground">Cargando datos...</p>
                        <p className="text-xs text-muted-foreground mt-1">Por favor espera un momento</p>
                      </div>
                    </div>
                  </TableCell>
                </TableRow>
              ) : paginatedData.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={columns.length + (enableSelection ? 1 : 0)}
                    className="text-center py-12"
                  >
                    {/* ISO 9241-11: Estética - Estado vacío personalizable */}
                    {customEmptyState || (
                      <div className="flex flex-col items-center gap-4 animate-in fade-in duration-500">
                        <div className="rounded-full bg-muted p-4">
                          <AlertCircle className="h-8 w-8 text-muted-foreground" />
                        </div>
                        <div>
                          <p className="font-medium text-foreground">{emptyMessage}</p>
                          {(searchTerm || Object.keys(columnFilters).length > 0) ? (
                            <div className="mt-3 space-y-2">
                              <p className="text-sm text-muted-foreground">
                                Intenta ajustar los filtros de búsqueda
                              </p>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={clearFilters}
                                className="mt-2"
                              >
                                <X className="h-4 w-4 mr-2" />
                                Limpiar filtros
                              </Button>
                            </div>
                          ) : (
                            <p className="text-sm text-muted-foreground mt-2">
                              No hay registros para mostrar
                            </p>
                          )}
                        </div>
                      </div>
                    )}
                  </TableCell>
                </TableRow>
              ) : (
                paginatedData.map((row, index) => {
                  const rowId = getUniqueRowId(row, (currentPage - 1) * rowsPerPage + index);
                  const isSelected = selectedRows.has(rowId);

                  return (
                    <TableRow
                      key={rowId}
                      className={cn(
                        "transition-colors duration-150",
                        onRowClick && "cursor-pointer hover:bg-muted/50",
                        isSelected && "bg-muted/50 border-l-2 border-l-primary"
                      )}
                      onClick={() => onRowClick?.(row)}
                    >
                      {enableSelection && (
                        <TableCell onClick={(e) => e.stopPropagation()}>
                          <Checkbox
                            checked={isSelected}
                            onCheckedChange={(checked) =>
                              handleSelectRow(rowId, checked as boolean)
                            }
                            aria-label={`Seleccionar fila ${index + 1}`}
                          />
                        </TableCell>
                      )}
                      {columns.map((column) => {
                        const value = getNestedValue(row, column.key as string);
                        return (
                          <TableCell
                            key={column.key as string}
                            className={cn(
                              column.align === "center" && "text-center",
                              column.align === "right" && "text-right"
                            )}
                          >
                            {column.render ? column.render(value, row) : value}
                          </TableCell>
                        );
                      })}
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* Paginación */}
      {totalPages > 1 && (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 bg-muted/20 rounded-lg border border-border">
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">Filas por página:</span>
            <Tooltip>
              <TooltipTrigger asChild>
                <Select
                  value={rowsPerPage.toString()}
                  onValueChange={(value) => {
                    setRowsPerPage(Number(value));
                    setCurrentPage(1);
                  }}
                >
                  <SelectTrigger className="w-20" aria-label="Seleccionar filas por página">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {rowsPerPageOptions.map((option) => (
                      <SelectItem key={option} value={option.toString()}>
                        {option}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </TooltipTrigger>
              <TooltipContent>
                <p>Ajustar número de registros por página</p>
              </TooltipContent>
            </Tooltip>
          </div>

          <div className="flex items-center gap-1">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setCurrentPage(1)}
                  disabled={currentPage === 1}
                  aria-label="Primera página"
                >
                  <ChevronsLeft className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Primera página</TooltipContent>
            </Tooltip>
            
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  aria-label="Página anterior"
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Página anterior</TooltipContent>
            </Tooltip>

            <div className="flex items-center gap-1 mx-2 px-3 py-1 bg-background rounded-md border">
              <span className="text-sm font-medium">{currentPage}</span>
              <span className="text-sm text-muted-foreground">de</span>
              <span className="text-sm font-medium">{totalPages}</span>
            </div>

            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                  aria-label="Página siguiente"
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Página siguiente</TooltipContent>
            </Tooltip>
            
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setCurrentPage(totalPages)}
                  disabled={currentPage === totalPages}
                  aria-label="Última página"
                >
                  <ChevronsRight className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Última página</TooltipContent>
            </Tooltip>
          </div>
        </div>
      )}

      {/* ISO 9241-11: Ayuda contextual - Atajos de teclado */}
      {showHelp && enableKeyboardShortcuts && (
        <div className="text-xs text-muted-foreground p-3 bg-muted/20 rounded-md border border-border">
          <p className="font-medium mb-1">⌨️ Atajos de teclado:</p>
          <div className="grid grid-cols-2 gap-x-4 gap-y-1">
            {enableSelection && (
              <span>• <kbd className="px-1 py-0.5 bg-background rounded border">Ctrl+A</kbd> Seleccionar todas</span>
            )}
            {enableExport && (
              <span>• <kbd className="px-1 py-0.5 bg-background rounded border">Ctrl+E</kbd> Exportar CSV</span>
            )}
            {selectedRows.size > 0 && (
              <span>• <kbd className="px-1 py-0.5 bg-background rounded border">Esc</kbd> Limpiar selección</span>
            )}
          </div>
        </div>
      )}
    </div>
    </TooltipProvider>
  );
}

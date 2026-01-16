import { useState, useEffect, useCallback, useMemo } from "react";

/**
 * Hook para gestionar datos de tabla con filtrado, ordenamiento y paginación
 */
export function useTableData<T extends Record<string, any>>(
  initialData: T[],
  options?: {
    initialPageSize?: number;
    searchKeys?: (keyof T)[];
  }
) {
  const [data, setData] = useState<T[]>(initialData);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortKey, setSortKey] = useState<keyof T | null>(null);
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(options?.initialPageSize || 10);

  // Actualizar datos cuando cambia initialData
  useEffect(() => {
    setData(initialData);
  }, [initialData]);

  // Datos filtrados
  const filteredData = useMemo(() => {
    if (!searchTerm) return data;

    const searchKeys = options?.searchKeys || (Object.keys(data[0] || {}) as (keyof T)[]);
    const lowerSearch = searchTerm.toLowerCase();

    return data.filter((item) =>
      searchKeys.some((key) => {
        const value = item[key];
        return value?.toString().toLowerCase().includes(lowerSearch);
      })
    );
  }, [data, searchTerm, options?.searchKeys]);

  // Datos ordenados
  const sortedData = useMemo(() => {
    if (!sortKey) return filteredData;

    return [...filteredData].sort((a, b) => {
      const aValue = a[sortKey];
      const bValue = b[sortKey];

      if (aValue === bValue) return 0;
      if (aValue === null || aValue === undefined) return 1;
      if (bValue === null || bValue === undefined) return -1;

      const result = aValue < bValue ? -1 : 1;
      return sortDirection === "asc" ? result : -result;
    });
  }, [filteredData, sortKey, sortDirection]);

  // Datos paginados
  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return sortedData.slice(start, start + pageSize);
  }, [sortedData, currentPage, pageSize]);

  const totalPages = Math.ceil(sortedData.length / pageSize);

  // Handlers
  const handleSort = useCallback((key: keyof T) => {
    setSortKey((prevKey) => {
      if (prevKey === key) {
        setSortDirection((prev) => (prev === "asc" ? "desc" : "asc"));
        return key;
      }
      setSortDirection("asc");
      return key;
    });
  }, []);

  const handleSearch = useCallback((term: string) => {
    setSearchTerm(term);
    setCurrentPage(1); // Reset a primera página
  }, []);

  const handlePageChange = useCallback((page: number) => {
    setCurrentPage(Math.max(1, Math.min(page, totalPages)));
  }, [totalPages]);

  const handlePageSizeChange = useCallback((size: number) => {
    setPageSize(size);
    setCurrentPage(1);
  }, []);

  const resetFilters = useCallback(() => {
    setSearchTerm("");
    setSortKey(null);
    setSortDirection("asc");
    setCurrentPage(1);
  }, []);

  return {
    data: paginatedData,
    allData: sortedData,
    searchTerm,
    sortKey,
    sortDirection,
    currentPage,
    pageSize,
    totalPages,
    totalItems: sortedData.length,
    handleSort,
    handleSearch,
    handlePageChange,
    handlePageSizeChange,
    resetFilters,
    setData,
  };
}

/**
 * Hook para gestionar selección de filas en tabla
 */
export function useTableSelection<T extends Record<string, any>>(
  data: T[],
  getId?: (item: T) => string | number
) {
  const [selectedIds, setSelectedIds] = useState<Set<string | number>>(new Set());

  const getItemId = useCallback(
    (item: T, index: number): string | number => {
      if (getId) return getId(item);
      if (item.id !== undefined) return item.id;
      return index;
    },
    [getId]
  );

  const isSelected = useCallback(
    (item: T, index: number): boolean => {
      return selectedIds.has(getItemId(item, index));
    },
    [selectedIds, getItemId]
  );

  const toggleSelection = useCallback(
    (item: T, index: number) => {
      const id = getItemId(item, index);
      setSelectedIds((prev) => {
        const newSet = new Set(prev);
        if (newSet.has(id)) {
          newSet.delete(id);
        } else {
          newSet.add(id);
        }
        return newSet;
      });
    },
    [getItemId]
  );

  const selectAll = useCallback(() => {
    const allIds = data.map((item, index) => getItemId(item, index));
    setSelectedIds(new Set(allIds));
  }, [data, getItemId]);

  const clearSelection = useCallback(() => {
    setSelectedIds(new Set());
  }, []);

  const toggleAll = useCallback(() => {
    if (selectedIds.size === data.length) {
      clearSelection();
    } else {
      selectAll();
    }
  }, [selectedIds.size, data.length, clearSelection, selectAll]);

  const selectedItems = useMemo(() => {
    return data.filter((item, index) => selectedIds.has(getItemId(item, index)));
  }, [data, selectedIds, getItemId]);

  return {
    selectedIds,
    selectedItems,
    selectedCount: selectedIds.size,
    isSelected,
    toggleSelection,
    selectAll,
    clearSelection,
    toggleAll,
    isAllSelected: data.length > 0 && selectedIds.size === data.length,
    isSomeSelected: selectedIds.size > 0 && selectedIds.size < data.length,
  };
}

/**
 * Hook para gestionar estado de carga y errores en operaciones de tabla
 */
export function useTableOperations() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const executeOperation = useCallback(
    async <T,>(operation: () => Promise<T>): Promise<T | null> => {
      setIsLoading(true);
      setError(null);

      try {
        const result = await operation();
        return result;
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Ha ocurrido un error";
        setError(errorMessage);
        return null;
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    isLoading,
    error,
    executeOperation,
    clearError,
    setIsLoading,
    setError,
  };
}

/**
 * Hook para persistir configuración de tabla en localStorage
 */
export function useTablePreferences(
  key: string,
  defaults: {
    pageSize?: number;
    sortKey?: string;
    sortDirection?: "asc" | "desc";
  } = {}
) {
  const storageKey = `table-preferences-${key}`;

  const [preferences, setPreferences] = useState(() => {
    try {
      const stored = localStorage.getItem(storageKey);
      return stored ? JSON.parse(stored) : defaults;
    } catch {
      return defaults;
    }
  });

  const updatePreferences = useCallback(
    (updates: Partial<typeof preferences>) => {
      setPreferences((prev: any) => {
        const newPrefs = { ...prev, ...updates };
        try {
          localStorage.setItem(storageKey, JSON.stringify(newPrefs));
        } catch (error) {
          console.error("Error al guardar preferencias:", error);
        }
        return newPrefs;
      });
    },
    [storageKey]
  );

  const resetPreferences = useCallback(() => {
    setPreferences(defaults);
    try {
      localStorage.removeItem(storageKey);
    } catch (error) {
      console.error("Error al eliminar preferencias:", error);
    }
  }, [defaults, storageKey]);

  return {
    preferences,
    updatePreferences,
    resetPreferences,
  };
}

/**
 * Hook para debounce en búsqueda de tabla
 */
export function useDebouncedSearch(
  initialValue: string = "",
  delay: number = 300
) {
  const [value, setValue] = useState(initialValue);
  const [debouncedValue, setDebouncedValue] = useState(initialValue);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return [debouncedValue, value, setValue] as const;
}

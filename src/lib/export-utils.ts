// Utilidades para exportación de datos

export interface ExportOptions {
  filename?: string;
  columns?: string[];
  excludeColumns?: string[];
  dateFormat?: string;
}

/**
 * Exporta datos a formato CSV
 */
export function exportToCSV<T extends Record<string, any>>(
  data: T[],
  options: ExportOptions = {}
): void {
  if (!data || data.length === 0) {
    console.warn("No hay datos para exportar");
    return;
  }

  const {
    filename = `export_${new Date().toISOString().split("T")[0]}.csv`,
    columns,
    excludeColumns = [],
  } = options;

  // Determinar columnas a exportar
  const allColumns = columns || Object.keys(data[0]);
  const exportColumns = allColumns.filter((col) => !excludeColumns.includes(col));

  // Crear encabezados (formatear nombres)
  const headers = exportColumns.map((col) => formatColumnName(col)).join(",");

  // Crear filas
  const rows = data.map((row) =>
    exportColumns
      .map((col) => {
        const value = row[col];
        return escapeCSVValue(value);
      })
      .join(",")
  );

  // Combinar y crear blob
  const csv = [headers, ...rows].join("\n");
  const blob = new Blob(["\ufeff" + csv], { type: "text/csv;charset=utf-8;" });

  // Descargar
  downloadBlob(blob, filename);
}

/**
 * Exporta datos a formato JSON
 */
export function exportToJSON<T extends Record<string, any>>(
  data: T[],
  options: ExportOptions = {}
): void {
  if (!data || data.length === 0) {
    console.warn("No hay datos para exportar");
    return;
  }

  const {
    filename = `export_${new Date().toISOString().split("T")[0]}.json`,
    columns,
    excludeColumns = [],
  } = options;

  // Filtrar columnas si es necesario
  let exportData = data;
  if (columns || excludeColumns.length > 0) {
    exportData = data.map((row) => {
      const filtered: any = {};
      const cols = columns || Object.keys(row);
      cols.forEach((col) => {
        if (!excludeColumns.includes(col)) {
          filtered[col] = row[col];
        }
      });
      return filtered;
    });
  }

  const json = JSON.stringify(exportData, null, 2);
  const blob = new Blob([json], { type: "application/json" });
  downloadBlob(blob, filename);
}

/**
 * Exporta datos a formato Excel (XLSX básico)
 */
export function exportToExcel<T extends Record<string, any>>(
  data: T[],
  options: ExportOptions = {}
): void {
  // Para Excel real, necesitarías una librería como xlsx o exceljs
  // Por ahora, exportamos como CSV que Excel puede abrir
  const filename = options.filename?.replace(".xlsx", ".csv") || 
    `export_${new Date().toISOString().split("T")[0]}.csv`;
  
  exportToCSV(data, { ...options, filename });
}

/**
 * Formatea el nombre de una columna para exportación
 */
function formatColumnName(columnName: string): string {
  // Convertir camelCase a "Title Case"
  return columnName
    .replace(/([A-Z])/g, " $1")
    .replace(/^./, (str) => str.toUpperCase())
    .trim();
}

/**
 * Escapa valores para CSV
 */
function escapeCSVValue(value: any): string {
  if (value === null || value === undefined) {
    return "";
  }

  // Convertir a string
  let strValue = String(value);

  // Si contiene coma, salto de línea o comillas, envolver en comillas
  if (
    strValue.includes(",") ||
    strValue.includes("\n") ||
    strValue.includes('"')
  ) {
    // Escapar comillas dobles duplicándolas
    strValue = `"${strValue.replace(/"/g, '""')}"`;
  }

  return strValue;
}

/**
 * Descarga un blob como archivo
 */
function downloadBlob(blob: Blob, filename: string): void {
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  link.style.display = "none";

  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);

  // Limpiar URL
  setTimeout(() => URL.revokeObjectURL(url), 100);
}

/**
 * Copia datos al portapapeles
 */
export async function copyToClipboard<T extends Record<string, any>>(
  data: T[],
  format: "csv" | "json" | "text" = "text"
): Promise<boolean> {
  try {
    let text = "";

    if (format === "csv") {
      const headers = Object.keys(data[0]).join(",");
      const rows = data.map((row) =>
        Object.values(row)
          .map((val) => escapeCSVValue(val))
          .join(",")
      );
      text = [headers, ...rows].join("\n");
    } else if (format === "json") {
      text = JSON.stringify(data, null, 2);
    } else {
      text = data
        .map((row) => Object.values(row).join("\t"))
        .join("\n");
    }

    await navigator.clipboard.writeText(text);
    return true;
  } catch (error) {
    console.error("Error al copiar al portapapeles:", error);
    return false;
  }
}

/**
 * Imprime una tabla de datos
 */
export function printTable<T extends Record<string, any>>(
  data: T[],
  title?: string
): void {
  if (!data || data.length === 0) return;

  const columns = Object.keys(data[0]);
  
  // Crear HTML para impresión
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <title>${title || "Tabla de Datos"}</title>
      <style>
        body {
          font-family: Arial, sans-serif;
          padding: 20px;
        }
        h1 {
          color: #333;
          margin-bottom: 20px;
        }
        table {
          width: 100%;
          border-collapse: collapse;
          margin-top: 20px;
        }
        th, td {
          border: 1px solid #ddd;
          padding: 12px;
          text-align: left;
        }
        th {
          background-color: #4CAF50;
          color: white;
          font-weight: bold;
        }
        tr:nth-child(even) {
          background-color: #f2f2f2;
        }
        .print-date {
          color: #666;
          font-size: 14px;
          margin-top: 10px;
        }
        @media print {
          button { display: none; }
        }
      </style>
    </head>
    <body>
      ${title ? `<h1>${title}</h1>` : ""}
      <div class="print-date">
        Impreso el: ${new Date().toLocaleString("es-ES")}
      </div>
      <table>
        <thead>
          <tr>
            ${columns.map((col) => `<th>${formatColumnName(col)}</th>`).join("")}
          </tr>
        </thead>
        <tbody>
          ${data
            .map(
              (row) => `
            <tr>
              ${columns.map((col) => `<td>${row[col] || ""}</td>`).join("")}
            </tr>
          `
            )
            .join("")}
        </tbody>
      </table>
      <script>
        window.onload = () => {
          window.print();
          window.onafterprint = () => window.close();
        };
      </script>
    </body>
    </html>
  `;

  // Abrir ventana de impresión
  const printWindow = window.open("", "_blank");
  if (printWindow) {
    printWindow.document.write(html);
    printWindow.document.close();
  }
}

/**
 * Genera un resumen estadístico de los datos
 */
export function generateDataSummary<T extends Record<string, any>>(
  data: T[]
): Record<string, any> {
  if (!data || data.length === 0) {
    return { total: 0 };
  }

  const summary: Record<string, any> = {
    total: data.length,
    columns: Object.keys(data[0]).length,
  };

  // Analizar cada columna
  Object.keys(data[0]).forEach((col) => {
    const values = data.map((row) => row[col]).filter((v) => v != null);
    const uniqueValues = new Set(values);

    summary[col] = {
      nonNull: values.length,
      null: data.length - values.length,
      unique: uniqueValues.size,
    };

    // Si es numérico, calcular estadísticas
    const numericValues = values.filter((v) => typeof v === "number" || !isNaN(Number(v)));
    if (numericValues.length > 0) {
      const numbers = numericValues.map(Number);
      summary[col].min = Math.min(...numbers);
      summary[col].max = Math.max(...numbers);
      summary[col].avg = numbers.reduce((a, b) => a + b, 0) / numbers.length;
    }
  });

  return summary;
}

import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { DataTable, Column } from "@/components/ui/data-table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import {
  PlusCircle,
  Edit,
  Eye,
  Trash2,
  Users,
  Calendar,
  Mail,
  Phone,
  MapPin,
} from "lucide-react";
import { exportToCSV, exportToJSON } from "@/lib/export-utils";

// Interfaz de Visitante (ejemplo)
interface Visitante {
  id: string;
  nombresApellidos: string;
  documento: string;
  telefono: string;
  correo: string;
  nacionalidad: string;
  edad: string;
  tipoVisitante: string;
  fechaVisita: string;
  condicionesMedicas?: string;
  estado: "activo" | "pendiente" | "completado";
}

// Datos de ejemplo
const visitantesEjemplo: Visitante[] = [
  {
    id: "1",
    nombresApellidos: "Juan Pérez García",
    documento: "1234567890",
    telefono: "+593 99 123 4567",
    correo: "juan.perez@email.com",
    nacionalidad: "Ecuador",
    edad: "35",
    tipoVisitante: "Individual",
    fechaVisita: "2026-01-20",
    condicionesMedicas: "Ninguna",
    estado: "activo",
  },
  {
    id: "2",
    nombresApellidos: "María González López",
    documento: "0987654321",
    telefono: "+593 98 765 4321",
    correo: "maria.gonzalez@email.com",
    nacionalidad: "Colombia",
    edad: "28",
    tipoVisitante: "Grupo",
    fechaVisita: "2026-01-22",
    condicionesMedicas: "Alergia al polen",
    estado: "pendiente",
  },
  {
    id: "3",
    nombresApellidos: "Robert Smith",
    documento: "PASS123456",
    telefono: "+1 555 123 4567",
    correo: "robert.smith@email.com",
    nacionalidad: "Estados Unidos",
    edad: "42",
    tipoVisitante: "Individual",
    fechaVisita: "2026-01-18",
    condicionesMedicas: "Ninguna",
    estado: "completado",
  },
  {
    id: "4",
    nombresApellidos: "Ana Martínez Ruiz",
    documento: "1122334455",
    telefono: "+593 97 222 3333",
    correo: "ana.martinez@email.com",
    nacionalidad: "Ecuador",
    edad: "31",
    tipoVisitante: "Grupo",
    fechaVisita: "2026-01-25",
    estado: "activo",
  },
  {
    id: "5",
    nombresApellidos: "Carlos Rodríguez",
    documento: "5544332211",
    telefono: "+593 96 111 2222",
    correo: "carlos.rodriguez@email.com",
    nacionalidad: "Perú",
    edad: "38",
    tipoVisitante: "Individual",
    fechaVisita: "2026-01-23",
    condicionesMedicas: "Diabetes tipo 2",
    estado: "activo",
  },
  {
    id: "6",
    nombresApellidos: "Sophie Dubois",
    documento: "PASS789012",
    telefono: "+33 6 12 34 56 78",
    correo: "sophie.dubois@email.com",
    nacionalidad: "Francia",
    edad: "26",
    tipoVisitante: "Individual",
    fechaVisita: "2026-02-01",
    estado: "pendiente",
  },
  {
    id: "7",
    nombresApellidos: "Luis Fernando Castro",
    documento: "9988776655",
    telefono: "+593 95 888 9999",
    correo: "luis.castro@email.com",
    nacionalidad: "Ecuador",
    edad: "45",
    tipoVisitante: "Grupo",
    fechaVisita: "2026-01-19",
    condicionesMedicas: "Presión alta",
    estado: "completado",
  },
  {
    id: "8",
    nombresApellidos: "Emma Johnson",
    documento: "PASS345678",
    telefono: "+44 7700 900123",
    correo: "emma.johnson@email.com",
    nacionalidad: "Reino Unido",
    edad: "33",
    tipoVisitante: "Individual",
    fechaVisita: "2026-02-05",
    estado: "pendiente",
  },
];

export default function GestionVisitantes() {
  const navigate = useNavigate();
  const [visitantes, setVisitantes] = useState<Visitante[]>(visitantesEjemplo);
  const [selectedVisitantes, setSelectedVisitantes] = useState<Visitante[]>([]);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [visitanteToDelete, setVisitanteToDelete] = useState<Visitante | null>(null);

  // Cargar visitantes (simula carga desde API o localStorage)
  useEffect(() => {
    // Aquí podrías cargar desde localStorage o API
    const stored = localStorage.getItem("visitantes");
    if (stored) {
      try {
        setVisitantes(JSON.parse(stored));
      } catch (error) {
        console.error("Error al cargar visitantes:", error);
      }
    }
  }, []);

  // Guardar cambios en localStorage
  useEffect(() => {
    localStorage.setItem("visitantes", JSON.stringify(visitantes));
  }, [visitantes]);

  // Definir columnas de la tabla
  const columns: Column<Visitante>[] = [
    {
      key: "nombresApellidos",
      label: "Nombre Completo",
      sortable: true,
      filterable: true,
      render: (value, row) => (
        <div className="flex items-center gap-2">
          <Users className="h-4 w-4 text-muted-foreground" />
          <span className="font-medium">{value}</span>
        </div>
      ),
    },
    {
      key: "documento",
      label: "Documento",
      sortable: true,
      render: (value) => (
        <span className="font-mono text-sm">{value}</span>
      ),
    },
    {
      key: "correo",
      label: "Correo",
      sortable: true,
      render: (value) => (
        <div className="flex items-center gap-2">
          <Mail className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm">{value}</span>
        </div>
      ),
    },
    {
      key: "telefono",
      label: "Teléfono",
      render: (value) => (
        <div className="flex items-center gap-2">
          <Phone className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm">{value}</span>
        </div>
      ),
    },
    {
      key: "nacionalidad",
      label: "Nacionalidad",
      sortable: true,
      filterable: true,
      render: (value) => (
        <div className="flex items-center gap-2">
          <MapPin className="h-4 w-4 text-muted-foreground" />
          <span>{value}</span>
        </div>
      ),
    },
    {
      key: "fechaVisita",
      label: "Fecha de Visita",
      sortable: true,
      render: (value) => (
        <div className="flex items-center gap-2">
          <Calendar className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm">
            {new Date(value).toLocaleDateString("es-ES")}
          </span>
        </div>
      ),
    },
    {
      key: "tipoVisitante",
      label: "Tipo",
      sortable: true,
      filterable: true,
      render: (value) => (
        <Badge variant={value === "Grupo" ? "default" : "secondary"}>
          {value}
        </Badge>
      ),
    },
    {
      key: "estado",
      label: "Estado",
      sortable: true,
      filterable: true,
      render: (value: Visitante["estado"]) => {
        const variants = {
          activo: "default",
          pendiente: "secondary",
          completado: "outline",
        } as const;
        
        return (
          <Badge variant={variants[value]}>
            {value.charAt(0).toUpperCase() + value.slice(1)}
          </Badge>
        );
      },
    },
    {
      key: "acciones",
      label: "Acciones",
      width: "120px",
      align: "center",
      render: (_, row) => (
        <div className="flex items-center justify-center gap-1">
          <Button
            variant="ghost"
            size="icon"
            onClick={(e) => {
              e.stopPropagation();
              handleView(row);
            }}
            aria-label={`Ver detalles de ${row.nombresApellidos}`}
          >
            <Eye className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={(e) => {
              e.stopPropagation();
              handleEdit(row);
            }}
            aria-label={`Editar ${row.nombresApellidos}`}
          >
            <Edit className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={(e) => {
              e.stopPropagation();
              confirmDelete(row);
            }}
            aria-label={`Eliminar ${row.nombresApellidos}`}
          >
            <Trash2 className="h-4 w-4 text-destructive" />
          </Button>
        </div>
      ),
    },
  ];

  // Handlers
  const handleRowClick = (visitante: Visitante) => {
    console.log("Fila clickeada:", visitante);
    // Navegar a detalles o abrir modal
  };

  const handleView = (visitante: Visitante) => {
    toast.info("Ver detalles", {
      description: `Mostrando detalles de ${visitante.nombresApellidos}`,
    });
    // Aquí podrías abrir un modal o navegar a página de detalles
  };

  const handleEdit = (visitante: Visitante) => {
    navigate(`/visitantes/editar/${visitante.id}`);
  };

  const confirmDelete = (visitante: Visitante) => {
    setVisitanteToDelete(visitante);
    setDeleteDialogOpen(true);
  };

  const handleDelete = () => {
    if (!visitanteToDelete) return;

    setVisitantes((prev) =>
      prev.filter((v) => v.id !== visitanteToDelete.id)
    );

    toast.success("Visitante eliminado", {
      description: `${visitanteToDelete.nombresApellidos} ha sido eliminado correctamente`,
    });

    setDeleteDialogOpen(false);
    setVisitanteToDelete(null);
  };

  const handleBulkDelete = (selectedRows: Visitante[]) => {
    if (selectedRows.length === 0) return;

    const confirmed = window.confirm(
      `¿Está seguro de eliminar ${selectedRows.length} visitante(s)?`
    );

    if (confirmed) {
      const idsToDelete = new Set(selectedRows.map((v) => v.id));
      setVisitantes((prev) => prev.filter((v) => !idsToDelete.has(v.id)));

      toast.success("Visitantes eliminados", {
        description: `Se eliminaron ${selectedRows.length} visitante(s) correctamente`,
      });
    }
  };

  const handleExport = (data: Visitante[], format: "csv" | "json") => {
    const filename = `visitantes_${new Date().toISOString().split("T")[0]}`;

    if (format === "csv") {
      exportToCSV(data, {
        filename: `${filename}.csv`,
        excludeColumns: ["acciones"],
      });
      toast.success("Exportado a CSV", {
        description: `${data.length} registros exportados`,
      });
    } else {
      exportToJSON(data, {
        filename: `${filename}.json`,
        excludeColumns: ["acciones"],
      });
      toast.success("Exportado a JSON", {
        description: `${data.length} registros exportados`,
      });
    }
  };

  const handleNuevoVisitante = () => {
    navigate("/nuevo-visitante");
  };

  // Estadísticas rápidas
  const stats = {
    total: visitantes.length,
    activos: visitantes.filter((v) => v.estado === "activo").length,
    pendientes: visitantes.filter((v) => v.estado === "pendiente").length,
    completados: visitantes.filter((v) => v.estado === "completado").length,
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">
            Gestión de Visitantes
          </h1>
          <p className="text-muted-foreground mt-1">
            Administra y consulta los visitantes registrados
          </p>
        </div>
        <Button onClick={handleNuevoVisitante} size="lg">
          <PlusCircle className="h-5 w-5 mr-2" />
          Nuevo Visitante
        </Button>
      </div>

      {/* Estadísticas */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Total Visitantes</CardDescription>
            <CardTitle className="text-3xl">{stats.total}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Activos</CardDescription>
            <CardTitle className="text-3xl text-green-600">
              {stats.activos}
            </CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Pendientes</CardDescription>
            <CardTitle className="text-3xl text-yellow-600">
              {stats.pendientes}
            </CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Completados</CardDescription>
            <CardTitle className="text-3xl text-blue-600">
              {stats.completados}
            </CardTitle>
          </CardHeader>
        </Card>
      </div>

      {/* Tabla con mejoras ISO 9241-11 */}
      <Card>
        <CardContent className="pt-6">
          <DataTable
            data={visitantes}
            columns={columns}
            // ISO 9241-11: Adecuación reconocible
            title="Lista de Visitantes"
            description="Vista completa de todos los visitantes registrados en el sistema con herramientas de búsqueda, filtrado y exportación."
            // ISO 9241-11: Aprendibilidad
            helpText="Puedes buscar visitantes por nombre, email o documento. Click en las columnas para ordenar. Usa Ctrl+A para seleccionar todos y Ctrl+E para exportar."
            showHelp={true}
            // Funcionalidades
            searchPlaceholder="Buscar por nombre, documento, correo..."
            onRowClick={handleRowClick}
            onSelectionChange={setSelectedVisitantes}
            onExport={handleExport}
            onDelete={handleBulkDelete}
            // ISO 9241-11: Eficacia - Mostrar estadísticas
            showStats={true}
            // ISO 9241-11: Protección contra errores
            confirmDelete={true}
            // ISO 9241-11: Satisfacción - Mensajes de éxito
            showSuccessMessages={true}
            // ISO 9241-11: Operabilidad - Atajos de teclado
            enableKeyboardShortcuts={true}
            // Personalización
            emptyMessage="No hay visitantes registrados"
            enableSelection={true}
            enableExport={true}
            enableDelete={true}
            rowsPerPageOptions={[5, 10, 25, 50]}
            initialRowsPerPage={10}
            getRowId={(row) => row.id}
          />
        </CardContent>
      </Card>

      {/* Dialog de confirmación de eliminación */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>¿Eliminar visitante?</DialogTitle>
            <DialogDescription>
              Esta acción no se puede deshacer. Se eliminará permanentemente el
              registro de{" "}
              <strong>{visitanteToDelete?.nombresApellidos}</strong>.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setDeleteDialogOpen(false)}
            >
              Cancelar
            </Button>
            <Button variant="destructive" onClick={handleDelete}>
              Eliminar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

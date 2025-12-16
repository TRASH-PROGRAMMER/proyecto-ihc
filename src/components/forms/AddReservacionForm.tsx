import React, { useState, useMemo } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Calendar } from "@/components/ui/calendar";
import {
  Calendar as CalendarIcon,
  Clock,
  Users,
  DollarSign,
  CheckCircle2,
  AlertCircle,
  Save,
  ArrowLeft,
  X,
  ChevronDown,
} from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { format } from "date-fns";
import { es } from "date-fns/locale";

// Interfaz del formulario
interface ReservacionData {
  sitioAsociado: string;
  horarios: {
    [dia: string]: {
      inicio: string;
      fin: string;
      activo: boolean;
    };
  };
  fechasNoDisponibles: Date[];
  capacidadMaximaDia: string;
  capacidadPorHorario: string;
  tolerancia: string;
  tipoReservacion: string;
  precio: string;
  guiaObligatorio: string;
}

const DIAS_SEMANA = [
  "Lunes",
  "Martes",
  "Miércoles",
  "Jueves",
  "Viernes",
  "Sábado",
  "Domingo",
];

const TIPOS_RESERVACION = ["Individual", "Grupos", "Agencias", "Todos"];

const SITIOS_TURISTICOS = [
  "Laguna de Quilotoa",
  "Parque Nacional Cotopaxi",
  "Baños de Agua Santa",
  "Otavalo",
  "Puerto López",
  "Galápagos",
  "Selva Amazónica",
];

// Horario por defecto
const HORARIOS_DEFECTO = {
  Lunes: { inicio: "08:00", fin: "17:00", activo: true },
  Martes: { inicio: "08:00", fin: "17:00", activo: true },
  Miércoles: { inicio: "08:00", fin: "17:00", activo: true },
  Jueves: { inicio: "08:00", fin: "17:00", activo: true },
  Viernes: { inicio: "08:00", fin: "17:00", activo: true },
  Sábado: { inicio: "08:00", fin: "16:00", activo: true },
  Domingo: { inicio: "09:00", fin: "16:00", activo: true },
};

export const AddReservacionForm: React.FC = () => {
  const navigate = useNavigate();
  const { register, handleSubmit, watch, setValue, formState: { errors } } = useForm<ReservacionData>({
    defaultValues: {
      sitioAsociado: "",
      horarios: HORARIOS_DEFECTO,
      fechasNoDisponibles: [],
      capacidadMaximaDia: "50",
      capacidadPorHorario: "10",
      tolerancia: "15",
      tipoReservacion: "",
      precio: "",
      guiaObligatorio: "",
    },
  });

  const [showCalendar, setShowCalendar] = useState(false);
  const formValues = watch();

  // Calcular progreso del formulario
  const progreso = useMemo(() => {
    const campos = [
      formValues.sitioAsociado,
      // Validar que al menos un horario esté activo
      Object.values(formValues.horarios).some((h) => h.activo),
      formValues.fechasNoDisponibles.length > 0,
      formValues.capacidadMaximaDia,
      formValues.capacidadPorHorario,
      formValues.tolerancia,
      formValues.tipoReservacion,
      formValues.precio,
      formValues.guiaObligatorio,
    ];

    const camposCompletos = campos.filter((campo) => {
      if (typeof campo === "boolean") return campo;
      if (typeof campo === "string") return campo.trim() !== "";
      return false;
    }).length;

    return Math.round((camposCompletos / campos.length) * 100);
  }, [formValues]);

  // Actualizar horario de un día
  const updateHorario = (dia: string, campo: "inicio" | "fin" | "activo", valor: string | boolean) => {
    const horarioActual = formValues.horarios[dia];
    setValue("horarios", {
      ...formValues.horarios,
      [dia]: {
        ...horarioActual,
        [campo]: valor,
      },
    });
  };

  // Agregar fecha no disponible
  const addFechaNoDisponible = (date: Date) => {
    const fechasActuales = formValues.fechasNoDisponibles || [];
    const fechaExiste = fechasActuales.some(
      (f) => f.toDateString() === date.toDateString()
    );

    if (!fechaExiste) {
      setValue("fechasNoDisponibles", [...fechasActuales, date]);
      toast({
        title: "Fecha agregada",
        description: `${format(date, "d 'de' MMMM 'de' yyyy", { locale: es })} marcada como no disponible`,
      });
    }
  };

  // Eliminar fecha no disponible
  const removeFechaNoDisponible = (index: number) => {
    const nuevasFechas = formValues.fechasNoDisponibles.filter(
      (_, i) => i !== index
    );
    setValue("fechasNoDisponibles", nuevasFechas);
  };

  // Aplicar horarios a todos los días
  const aplicarATodos = (tipo: "laboral" | "fin_semana") => {
    const horarios: ReservacionData["horarios"] = {
      Lunes: { inicio: "08:00", fin: "17:00", activo: true },
      Martes: { inicio: "08:00", fin: "17:00", activo: true },
      Miércoles: { inicio: "08:00", fin: "17:00", activo: true },
      Jueves: { inicio: "08:00", fin: "17:00", activo: true },
      Viernes: { inicio: "08:00", fin: "17:00", activo: true },
      Sábado: { inicio: "08:00", fin: "16:00", activo: true },
      Domingo: { inicio: "09:00", fin: "16:00", activo: tipo === "laboral" ? false : true },
    };
    setValue("horarios", horarios);
  };

  // Envío del formulario
  const onSubmit = (data: ReservacionData) => {
    console.log("Datos de reservación:", data);

    toast({
      title: "Reservación guardada",
      description: "La configuración de reservación se ha guardado exitosamente",
    });

    // navigate("/dashboard/admin");
  };

  return (
    <div className="max-w-5xl mx-auto p-6 space-y-6">
      {/* Encabezado */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Calendar className="h-8 w-8 text-primary" />
            Nueva Reservación
          </h1>
          <p className="text-muted-foreground mt-1">
            Configura horarios, disponibilidad y precios
          </p>
        </div>
        <Button
          variant="outline"
          onClick={() => navigate(-1)}
          className="flex items-center gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Volver
        </Button>
      </div>

      {/* Barra de progreso */}
      <Card>
        <CardContent className="pt-6">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label className="text-sm font-medium">Progreso del formulario</Label>
              <Badge variant={progreso === 100 ? "default" : "secondary"}>
                {progreso}% completado
              </Badge>
            </div>
            <Progress value={progreso} className="h-3" />
            {progreso === 100 && (
              <div className="flex items-center gap-2 text-sm text-green-600">
                <CheckCircle2 className="h-4 w-4" />
                <span>Formulario completado, listo para guardar</span>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Formulario */}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Sección: Información Básica */}
        <Card>
          <CardHeader>
            <CardTitle>Información Básica</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Sitio asociado */}
            <div className="space-y-2">
              <Label htmlFor="sitioAsociado">
                Sitio turístico asociado <span className="text-red-500">*</span>
              </Label>
              <Select
                value={formValues.sitioAsociado}
                onValueChange={(value) => setValue("sitioAsociado", value)}
              >
                <SelectTrigger id="sitioAsociado">
                  <SelectValue placeholder="Selecciona un sitio turístico" />
                </SelectTrigger>
                <SelectContent>
                  {SITIOS_TURISTICOS.map((sitio) => (
                    <SelectItem key={sitio} value={sitio}>
                      {sitio}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Tipo de reservación */}
            <div className="space-y-2">
              <Label htmlFor="tipoReservacion">
                Tipo de reservación <span className="text-red-500">*</span>
              </Label>
              <Select
                value={formValues.tipoReservacion}
                onValueChange={(value) => setValue("tipoReservacion", value)}
              >
                <SelectTrigger id="tipoReservacion">
                  <SelectValue placeholder="Selecciona tipo de reservación" />
                </SelectTrigger>
                <SelectContent>
                  {TIPOS_RESERVACION.map((tipo) => (
                    <SelectItem key={tipo} value={tipo}>
                      {tipo}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Guía obligatorio */}
            <div className="space-y-2">
              <Label htmlFor="guiaObligatorio">
                ¿Guía turístico obligatorio? <span className="text-red-500">*</span>
              </Label>
              <Select
                value={formValues.guiaObligatorio}
                onValueChange={(value) => setValue("guiaObligatorio", value)}
              >
                <SelectTrigger id="guiaObligatorio">
                  <SelectValue placeholder="Selecciona opción" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="si">Sí</SelectItem>
                  <SelectItem value="no">No</SelectItem>
                  <SelectItem value="opcional">Opcional</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Sección: Horarios */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5" />
                Horarios por Día
              </CardTitle>
              <div className="flex gap-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => aplicarATodos("laboral")}
                >
                  Horario Laboral
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => aplicarATodos("fin_semana")}
                >
                  Con Fin de Semana
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Día</TableHead>
                    <TableHead>Activo</TableHead>
                    <TableHead>Hora Inicio</TableHead>
                    <TableHead>Hora Fin</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {DIAS_SEMANA.map((dia) => (
                    <TableRow key={dia}>
                      <TableCell className="font-medium">{dia}</TableCell>
                      <TableCell>
                        <Checkbox
                          checked={formValues.horarios[dia]?.activo ?? true}
                          onCheckedChange={(checked) =>
                            updateHorario(dia, "activo", checked as boolean)
                          }
                        />
                      </TableCell>
                      <TableCell>
                        <input
                          type="time"
                          value={formValues.horarios[dia]?.inicio ?? "08:00"}
                          onChange={(e) =>
                            updateHorario(dia, "inicio", e.target.value)
                          }
                          className="w-32 px-2 py-1 border rounded text-sm"
                          disabled={!formValues.horarios[dia]?.activo}
                        />
                      </TableCell>
                      <TableCell>
                        <input
                          type="time"
                          value={formValues.horarios[dia]?.fin ?? "17:00"}
                          onChange={(e) => updateHorario(dia, "fin", e.target.value)}
                          className="w-32 px-2 py-1 border rounded text-sm"
                          disabled={!formValues.horarios[dia]?.activo}
                        />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>

        {/* Sección: Fechas No Disponibles */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CalendarIcon className="h-5 w-5" />
              Fechas No Disponibles
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Marca los días en que el sitio no tendrá servicio (cierres, mantenimiento, etc.)
            </p>

            <div className="border rounded-lg p-4 bg-slate-50">
              <Button
                type="button"
                variant="outline"
                className="w-full mb-4"
                onClick={() => setShowCalendar(!showCalendar)}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {showCalendar ? "Ocultar calendario" : "Mostrar calendario"}
                <ChevronDown
                  className={`ml-2 h-4 w-4 transition-transform ${
                    showCalendar ? "rotate-180" : ""
                  }`}
                />
              </Button>

              {showCalendar && (
                <div className="flex justify-center p-4 bg-white rounded-lg border">
                  <Calendar
                    mode="single"
                    onDayClick={(date) => {
                      addFechaNoDisponible(date);
                    }}
                    disabled={(date) => {
                      const today = new Date();
                      today.setHours(0, 0, 0, 0);
                      return date < today;
                    }}
                    locale={es}
                  />
                </div>
              )}
            </div>

            {/* Lista de fechas no disponibles */}
            {formValues.fechasNoDisponibles.length > 0 && (
              <div className="space-y-2">
                <Label className="text-sm font-medium">
                  Fechas marcadas como no disponibles ({formValues.fechasNoDisponibles.length})
                </Label>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
                  {formValues.fechasNoDisponibles
                    .sort((a, b) => a.getTime() - b.getTime())
                    .map((fecha, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between bg-red-50 border border-red-200 rounded-lg px-3 py-2 text-sm"
                      >
                        <span>
                          {format(fecha, "d MMM", { locale: es })}
                        </span>
                        <button
                          type="button"
                          onClick={() => removeFechaNoDisponible(index)}
                          className="ml-2 text-red-600 hover:text-red-800"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                    ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Sección: Capacidad y Precios */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Capacidad y Precios
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Capacidad máxima por día */}
              <div className="space-y-2">
                <Label htmlFor="capacidadMaximaDia">
                  Capacidad máxima por día <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="capacidadMaximaDia"
                  type="number"
                  min="1"
                  placeholder="Ej: 50"
                  {...register("capacidadMaximaDia", {
                    required: "Este campo es obligatorio",
                    min: { value: 1, message: "Debe ser mayor a 0" },
                  })}
                />
                {errors.capacidadMaximaDia && (
                  <p className="text-sm text-red-500">
                    {errors.capacidadMaximaDia.message}
                  </p>
                )}
              </div>

              {/* Capacidad por horario */}
              <div className="space-y-2">
                <Label htmlFor="capacidadPorHorario">
                  Capacidad por horario/bloque <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="capacidadPorHorario"
                  type="number"
                  min="1"
                  placeholder="Ej: 10"
                  {...register("capacidadPorHorario", {
                    required: "Este campo es obligatorio",
                    min: { value: 1, message: "Debe ser mayor a 0" },
                  })}
                />
                {errors.capacidadPorHorario && (
                  <p className="text-sm text-red-500">
                    {errors.capacidadPorHorario.message}
                  </p>
                )}
              </div>
            </div>

            <Separator />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Precio */}
              <div className="space-y-2">
                <Label htmlFor="precio">
                  Precio <span className="text-red-500">*</span>
                </Label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="precio"
                    type="number"
                    step="0.01"
                    min="0"
                    placeholder="Ej: 25.00"
                    className="pl-10"
                    {...register("precio", {
                      required: "El precio es obligatorio",
                      min: { value: 0, message: "El precio no puede ser negativo" },
                    })}
                  />
                </div>
                <p className="text-xs text-muted-foreground">
                  Por persona o paquete según el tipo de reservación
                </p>
                {errors.precio && (
                  <p className="text-sm text-red-500">{errors.precio.message}</p>
                )}
              </div>

              {/* Tolerancia */}
              <div className="space-y-2">
                <Label htmlFor="tolerancia">
                  Tolerancia de llegada (minutos) <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="tolerancia"
                  type="number"
                  min="0"
                  placeholder="Ej: 15"
                  {...register("tolerancia", {
                    required: "La tolerancia es obligatoria",
                    min: { value: 0, message: "Debe ser 0 o mayor" },
                  })}
                />
                <p className="text-xs text-muted-foreground">
                  Tiempo máximo de espera antes de cancelar
                </p>
                {errors.tolerancia && (
                  <p className="text-sm text-red-500">{errors.tolerancia.message}</p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Resumen */}
        {progreso === 100 && (
          <Card className="bg-green-50 border-green-200">
            <CardContent className="pt-6">
              <div className="flex items-start gap-3">
                <CheckCircle2 className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                <div>
                  <h3 className="font-semibold text-green-900">
                    Formulario completado
                  </h3>
                  <p className="text-sm text-green-800 mt-1">
                    Todos los campos obligatorios han sido completados. Puedes guardar
                    la configuración de reservación.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Botones de acción */}
        <div className="flex gap-4 justify-end">
          <Button
            type="button"
            variant="outline"
            onClick={() => navigate(-1)}
            className="w-32"
          >
            Cancelar
          </Button>
          <Button
            type="submit"
            disabled={progreso < 100}
            className="w-32 flex items-center gap-2"
          >
            <Save className="h-4 w-4" />
            Guardar
          </Button>
        </div>
      </form>
    </div>
  );
};

export default AddReservacionForm;

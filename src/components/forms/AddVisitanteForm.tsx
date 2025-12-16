import React, { useMemo } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
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
  User,
  FileText,
  Phone,
  Mail,
  Globe,
  AlertTriangle,
  Calendar,
  Users,
  CheckCircle2,
  AlertCircle,
  Save,
  ArrowLeft,
} from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { format } from "date-fns";
import { es } from "date-fns/locale";

// Interfaz del formulario
interface VisitanteData {
  nombresApellidos: string;
  documento: string;
  telefono: string;
  correo: string;
  nacionalidad: string;
  condicionesMedicas: string;
  edad: string;
  tipoVisitante: string;
  fechaVisita: string;
}

const NACIONALIDADES = [
  "Ecuador",
  "Colombia",
  "Perú",
  "Bolivia",
  "Brasil",
  "Argentina",
  "Chile",
  "Venezuela",
  "Paraguay",
  "Uruguay",
  "Guatemala",
  "Honduras",
  "Nicaragua",
  "Costa Rica",
  "Panamá",
  "México",
  "Estados Unidos",
  "Canadá",
  "España",
  "Francia",
  "Italia",
  "Alemania",
  "Reino Unido",
  "Países Bajos",
  "Bélgica",
  "Suiza",
  "Austria",
  "Portugal",
  "Grecia",
  "Australia",
  "Nueva Zelanda",
  "Japón",
  "China",
  "India",
  "Tailandia",
  "Malasia",
  "Singapur",
  "Vietnam",
  "Corea del Sur",
  "Filipinas",
  "Indonesia",
  "Otro",
];

const TIPOS_VISITANTE = ["Individual", "Grupo"];

export const AddVisitanteForm: React.FC = () => {
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<VisitanteData>({
    defaultValues: {
      nombresApellidos: "",
      documento: "",
      telefono: "",
      correo: "",
      nacionalidad: "",
      condicionesMedicas: "",
      edad: "",
      tipoVisitante: "",
      fechaVisita: "",
    },
  });

  const formValues = watch();

  // Calcular progreso del formulario
  const progreso = useMemo(() => {
    const campos = [
      formValues.nombresApellidos,
      formValues.documento,
      formValues.telefono,
      formValues.correo,
      formValues.nacionalidad,
      // Las condiciones médicas son opcionales
      true, // Placeholder para mantener el conteo
      formValues.edad,
      formValues.tipoVisitante,
      formValues.fechaVisita,
    ];

    const camposCompletos = campos.filter((campo) => {
      if (typeof campo === "boolean") return campo;
      if (typeof campo === "string") return campo.trim() !== "";
      return false;
    }).length;

    return Math.round((camposCompletos / campos.length) * 100);
  }, [formValues]);

  // Envío del formulario
  const onSubmit = (data: VisitanteData) => {
    console.log("Datos del visitante:", data);

    toast({
      title: "Visitante registrado",
      description: `${data.nombresApellidos} se ha registrado exitosamente`,
    });

    // navigate("/dashboard/admin");
  };

  // Validar teléfono
  const validarTelefono = (valor: string) => {
    const telefonoRegex = /^(\+593|0)?9\d{8,9}$/;
    return telefonoRegex.test(valor) || "Teléfono inválido";
  };

  // Validar edad
  const validarEdad = (valor: number) => {
    return valor >= 1 && valor <= 120
      ? true
      : "La edad debe estar entre 1 y 120 años";
  };

  // Obtener fecha mínima (hoy)
  const hoy = new Date().toISOString().split("T")[0];

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      {/* Encabezado */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <User className="h-8 w-8 text-primary" />
            Registro de Visitante
          </h1>
          <p className="text-muted-foreground mt-1">
            Completa la información del visitante
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
        {/* Sección: Información Personal */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              Información Personal
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Nombres y apellidos */}
            <div className="space-y-2">
              <Label htmlFor="nombresApellidos">
                Nombres y apellidos <span className="text-red-500">*</span>
              </Label>
              <Input
                id="nombresApellidos"
                placeholder="Ej: Juan Carlos Rodríguez García"
                {...register("nombresApellidos", {
                  required: "El nombre es obligatorio",
                  minLength: {
                    value: 5,
                    message: "El nombre debe tener al menos 5 caracteres",
                  },
                })}
              />
              {errors.nombresApellidos && (
                <p className="text-sm text-red-500">{errors.nombresApellidos.message}</p>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Documento */}
              <div className="space-y-2">
                <Label htmlFor="documento">
                  Documento <span className="text-red-500">*</span>
                </Label>
                <div className="relative">
                  <FileText className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="documento"
                    placeholder="Cédula / Pasaporte"
                    className="pl-10"
                    {...register("documento", {
                      required: "El documento es obligatorio",
                      minLength: {
                        value: 8,
                        message: "El documento debe tener al menos 8 caracteres",
                      },
                    })}
                  />
                </div>
                {errors.documento && (
                  <p className="text-sm text-red-500">{errors.documento.message}</p>
                )}
              </div>

              {/* Edad */}
              <div className="space-y-2">
                <Label htmlFor="edad">
                  Edad <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="edad"
                  type="number"
                  min="1"
                  max="120"
                  placeholder="Ej: 35"
                  {...register("edad", {
                    required: "La edad es obligatoria",
                    validate: (valor) => validarEdad(parseInt(valor)),
                  })}
                />
                {errors.edad && (
                  <p className="text-sm text-red-500">{errors.edad.message}</p>
                )}
              </div>
            </div>

            <Separator />

            {/* Nacionalidad */}
            <div className="space-y-2">
              <Label htmlFor="nacionalidad">
                Nacionalidad <span className="text-red-500">*</span>
              </Label>
              <Select
                value={formValues.nacionalidad}
                onValueChange={(value) => setValue("nacionalidad", value)}
              >
                <SelectTrigger id="nacionalidad">
                  <SelectValue placeholder="Selecciona nacionalidad" />
                </SelectTrigger>
                <SelectContent>
                  {NACIONALIDADES.map((nacionalidad) => (
                    <SelectItem key={nacionalidad} value={nacionalidad}>
                      {nacionalidad}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Sección: Contacto */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Phone className="h-5 w-5" />
              Información de Contacto
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Teléfono */}
            <div className="space-y-2">
              <Label htmlFor="telefono">
                Teléfono <span className="text-red-500">*</span>
              </Label>
              <div className="relative">
                <Phone className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="telefono"
                  placeholder="Ej: 0987654321"
                  className="pl-10"
                  {...register("telefono", {
                    required: "El teléfono es obligatorio",
                    validate: validarTelefono,
                  })}
                />
              </div>
              <p className="text-xs text-muted-foreground">
                Formato: +593 o 0 seguido de 9 y 8-9 dígitos
              </p>
              {errors.telefono && (
                <p className="text-sm text-red-500">{errors.telefono.message}</p>
              )}
            </div>

            {/* Correo */}
            <div className="space-y-2">
              <Label htmlFor="correo">
                Correo electrónico <span className="text-red-500">*</span>
              </Label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="correo"
                  type="email"
                  placeholder="Ej: visitante@email.com"
                  className="pl-10"
                  {...register("correo", {
                    required: "El correo es obligatorio",
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                      message: "Correo inválido",
                    },
                  })}
                />
              </div>
              {errors.correo && (
                <p className="text-sm text-red-500">{errors.correo.message}</p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Sección: Visita */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Información de la Visita
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Tipo de visitante */}
              <div className="space-y-2">
                <Label htmlFor="tipoVisitante">
                  Tipo de visitante <span className="text-red-500">*</span>
                </Label>
                <Select
                  value={formValues.tipoVisitante}
                  onValueChange={(value) => setValue("tipoVisitante", value)}
                >
                  <SelectTrigger id="tipoVisitante">
                    <SelectValue placeholder="Selecciona tipo" />
                  </SelectTrigger>
                  <SelectContent>
                    {TIPOS_VISITANTE.map((tipo) => (
                      <SelectItem key={tipo} value={tipo}>
                        <div className="flex items-center gap-2">
                          <Users className="h-4 w-4" />
                          {tipo}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Fecha de visita */}
              <div className="space-y-2">
                <Label htmlFor="fechaVisita">
                  Fecha de visita <span className="text-red-500">*</span>
                </Label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-3 h-4 w-4 text-muted-foreground pointer-events-none" />
                  <Input
                    id="fechaVisita"
                    type="date"
                    min={hoy}
                    className="pl-10"
                    {...register("fechaVisita", {
                      required: "La fecha de visita es obligatoria",
                    })}
                  />
                </div>
                {errors.fechaVisita && (
                  <p className="text-sm text-red-500">{errors.fechaVisita.message}</p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Sección: Condiciones Médicas */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5" />
              Información Médica
            </CardTitle>
            <p className="text-sm text-muted-foreground mt-2">
              (Opcional) Información relevante para garantizar tu seguridad
            </p>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Condiciones médicas */}
            <div className="space-y-2">
              <Label htmlFor="condicionesMedicas">
                Condiciones médicas relevantes
              </Label>
              <Textarea
                id="condicionesMedicas"
                placeholder="Ej: Alergia a... / Movilidad reducida / Claustrofobia / Presión arterial alta / Otro"
                rows={4}
                {...register("condicionesMedicas")}
              />
              <p className="text-xs text-muted-foreground">
                Esta información nos ayudará a proporcionar una experiencia segura y cómoda
              </p>
            </div>

            <Alert className="bg-blue-50 border-blue-200">
              <AlertCircle className="h-4 w-4 text-blue-600" />
              <AlertDescription className="text-blue-800">
                Las condiciones médicas se mantendrán confidenciales y solo serán compartidas
                con el personal necesario para tu seguridad.
              </AlertDescription>
            </Alert>
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
                    el registro del visitante.
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

export default AddVisitanteForm;

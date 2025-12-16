import React, { useState, useMemo } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
  Languages,
  Award,
  Calendar,
  Image as ImageIcon,
  CheckCircle2,
  AlertCircle,
  Save,
  ArrowLeft,
  X,
  Plus,
  Upload,
} from "lucide-react";
import { toast } from "@/hooks/use-toast";

// Interfaz del formulario
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

const IDIOMAS_OPCIONES = [
  "Español",
  "Inglés",
  "Francés",
  "Italiano",
  "Alemán",
  "Portugués",
  "Quechua",
];

const CERTIFICACIONES_OPCIONES = [
  "Primeros auxilios",
  "Guía certificado nacional",
  "Guía certificado internacional",
  "Rescate en altura",
  "Primeros auxilios en montaña",
  "Buceo certificado",
  "Fotografía profesional",
  "Turismo ecológico",
];

const DISPONIBILIDADES = [
  "Lunes a viernes",
  "Fines de semana",
  "Flexible",
  "Disponibilidad completa",
  "Feriados",
];

export const AddGuiaForm: React.FC = () => {
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<GuiaData>({
    defaultValues: {
      nombreCompleto: "",
      documento: "",
      edad: "",
      telefono: "",
      correo: "",
      idiomas: [],
      certificaciones: [],
      anosExperiencia: "",
      disponibilidad: "",
      foto: "",
      estado: "",
    },
  });

  const [uploadingImage, setUploadingImage] = useState(false);
  const [imagenPreview, setImagenPreview] = useState<string>("");
  const [nuevoIdioma, setNuevoIdioma] = useState("");
  const [nuevaCertificacion, setNuevaCertificacion] = useState("");

  const formValues = watch();

  // Calcular progreso del formulario
  const progreso = useMemo(() => {
    const campos = [
      formValues.nombreCompleto,
      formValues.documento,
      formValues.edad,
      formValues.telefono,
      formValues.correo,
      formValues.idiomas.length > 0,
      formValues.certificaciones.length > 0,
      formValues.anosExperiencia,
      formValues.disponibilidad,
      formValues.foto,
      formValues.estado,
    ];

    const camposCompletos = campos.filter((campo) => {
      if (typeof campo === "boolean") return campo;
      if (typeof campo === "string") return campo.trim() !== "";
      return false;
    }).length;

    return Math.round((camposCompletos / campos.length) * 100);
  }, [formValues]);

  // Manejo de subida de foto
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingImage(true);

    try {
      // Validar tipo de archivo
      if (!file.type.startsWith("image/")) {
        toast({
          title: "Error",
          description: "Solo se permiten archivos de imagen",
          variant: "destructive",
        });
        return;
      }

      // Validar tamaño (máx 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast({
          title: "Error",
          description: "La imagen excede el tamaño máximo de 5MB",
          variant: "destructive",
        });
        return;
      }

      // Crear preview local
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagenPreview(reader.result as string);
      };
      reader.readAsDataURL(file);

      // TODO: Implementar subida real a Cloudinary
      const uploadedUrl = `https://via.placeholder.com/200?text=${file.name}`;
      setValue("foto", uploadedUrl);

      toast({
        title: "Éxito",
        description: "Foto subida correctamente",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Error al subir la foto",
        variant: "destructive",
      });
    } finally {
      setUploadingImage(false);
    }
  };

  // Eliminar foto
  const handleRemoveImage = () => {
    setImagenPreview("");
    setValue("foto", "");
  };

  // Agregar idioma
  const addIdioma = () => {
    if (nuevoIdioma.trim() && !formValues.idiomas.includes(nuevoIdioma)) {
      setValue("idiomas", [...formValues.idiomas, nuevoIdioma]);
      setNuevoIdioma("");
    }
  };

  // Eliminar idioma
  const removeIdioma = (idioma: string) => {
    setValue(
      "idiomas",
      formValues.idiomas.filter((i) => i !== idioma)
    );
  };

  // Agregar certificación
  const addCertificacion = () => {
    if (
      nuevaCertificacion.trim() &&
      !formValues.certificaciones.includes(nuevaCertificacion)
    ) {
      setValue("certificaciones", [
        ...formValues.certificaciones,
        nuevaCertificacion,
      ]);
      setNuevaCertificacion("");
    }
  };

  // Eliminar certificación
  const removeCertificacion = (cert: string) => {
    setValue(
      "certificaciones",
      formValues.certificaciones.filter((c) => c !== cert)
    );
  };

  // Envío del formulario
  const onSubmit = (data: GuiaData) => {
    console.log("Datos del guía:", data);

    toast({
      title: "Guía turístico registrado",
      description: `${data.nombreCompleto} se ha registrado exitosamente`,
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
    return valor >= 18 && valor <= 80
      ? true
      : "La edad debe estar entre 18 y 80 años";
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      {/* Encabezado */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <User className="h-8 w-8 text-primary" />
            Nuevo Guía Turístico
          </h1>
          <p className="text-muted-foreground mt-1">
            Registra la información del guía turístico
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
            {/* Nombre completo */}
            <div className="space-y-2">
              <Label htmlFor="nombreCompleto">
                Nombre completo <span className="text-red-500">*</span>
              </Label>
              <Input
                id="nombreCompleto"
                placeholder="Ej: Juan Carlos Rodríguez"
                {...register("nombreCompleto", {
                  required: "El nombre completo es obligatorio",
                  minLength: {
                    value: 5,
                    message: "El nombre debe tener al menos 5 caracteres",
                  },
                })}
              />
              {errors.nombreCompleto && (
                <p className="text-sm text-red-500">{errors.nombreCompleto.message}</p>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Documento */}
              <div className="space-y-2">
                <Label htmlFor="documento">
                  Documento (Cédula/Pasaporte) <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="documento"
                  placeholder="Ej: 1234567890"
                  {...register("documento", {
                    required: "El documento es obligatorio",
                    minLength: {
                      value: 10,
                      message: "El documento debe tener al menos 10 caracteres",
                    },
                  })}
                />
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
                  min="18"
                  max="80"
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

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                    placeholder="Ej: guia@email.com"
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
            </div>
          </CardContent>
        </Card>

        {/* Sección: Experiencia y Competencias */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Award className="h-5 w-5" />
              Experiencia y Competencias
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Años de experiencia */}
            <div className="space-y-2">
              <Label htmlFor="anosExperiencia">
                Años de experiencia <span className="text-red-500">*</span>
              </Label>
              <Input
                id="anosExperiencia"
                type="number"
                min="0"
                placeholder="Ej: 5"
                {...register("anosExperiencia", {
                  required: "Los años de experiencia son obligatorios",
                  min: { value: 0, message: "Debe ser 0 o mayor" },
                })}
              />
              {errors.anosExperiencia && (
                <p className="text-sm text-red-500">{errors.anosExperiencia.message}</p>
              )}
            </div>

            <Separator />

            {/* Idiomas */}
            <div className="space-y-3">
              <Label className="text-sm font-medium">
                Idiomas <span className="text-red-500">*</span>
              </Label>
              <div className="flex gap-2">
                <Select value={nuevoIdioma} onValueChange={setNuevoIdioma}>
                  <SelectTrigger className="flex-1">
                    <SelectValue placeholder="Selecciona un idioma" />
                  </SelectTrigger>
                  <SelectContent>
                    {IDIOMAS_OPCIONES.map((idioma) => (
                      <SelectItem
                        key={idioma}
                        value={idioma}
                        disabled={formValues.idiomas.includes(idioma)}
                      >
                        {idioma}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Button
                  type="button"
                  variant="outline"
                  onClick={addIdioma}
                  disabled={!nuevoIdioma}
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>

              {formValues.idiomas.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {formValues.idiomas.map((idioma) => (
                    <Badge
                      key={idioma}
                      variant="secondary"
                      className="px-3 py-1 flex items-center gap-2"
                    >
                      <Languages className="h-3 w-3" />
                      {idioma}
                      <button
                        type="button"
                        onClick={() => removeIdioma(idioma)}
                        className="ml-1 hover:text-red-600"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
              )}
            </div>

            <Separator />

            {/* Certificaciones */}
            <div className="space-y-3">
              <Label className="text-sm font-medium">
                Certificaciones <span className="text-red-500">*</span>
              </Label>
              <div className="flex gap-2">
                <Select
                  value={nuevaCertificacion}
                  onValueChange={setNuevaCertificacion}
                >
                  <SelectTrigger className="flex-1">
                    <SelectValue placeholder="Selecciona una certificación" />
                  </SelectTrigger>
                  <SelectContent>
                    {CERTIFICACIONES_OPCIONES.map((cert) => (
                      <SelectItem
                        key={cert}
                        value={cert}
                        disabled={formValues.certificaciones.includes(cert)}
                      >
                        {cert}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Button
                  type="button"
                  variant="outline"
                  onClick={addCertificacion}
                  disabled={!nuevaCertificacion}
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>

              {formValues.certificaciones.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {formValues.certificaciones.map((cert) => (
                    <Badge
                      key={cert}
                      variant="outline"
                      className="px-3 py-1 flex items-center gap-2"
                    >
                      <Award className="h-3 w-3" />
                      {cert}
                      <button
                        type="button"
                        onClick={() => removeCertificacion(cert)}
                        className="ml-1 hover:text-red-600"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Sección: Disponibilidad */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Disponibilidad y Foto
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Disponibilidad */}
            <div className="space-y-2">
              <Label htmlFor="disponibilidad">
                Disponibilidad <span className="text-red-500">*</span>
              </Label>
              <Select
                value={formValues.disponibilidad}
                onValueChange={(value) => setValue("disponibilidad", value)}
              >
                <SelectTrigger id="disponibilidad">
                  <SelectValue placeholder="Selecciona disponibilidad" />
                </SelectTrigger>
                <SelectContent>
                  {DISPONIBILIDADES.map((disp) => (
                    <SelectItem key={disp} value={disp}>
                      {disp}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <Separator />

            {/* Foto */}
            <div className="space-y-2">
              <Label htmlFor="foto">Foto de perfil</Label>
              <div className="border-2 border-dashed rounded-lg p-6 text-center hover:border-primary transition-colors">
                <input
                  id="foto"
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />
                <label htmlFor="foto" className="cursor-pointer flex flex-col items-center gap-2">
                  <Upload className="h-8 w-8 text-muted-foreground" />
                  <div className="space-y-1">
                    <p className="text-sm font-medium">
                      Haz clic para subir la foto
                    </p>
                    <p className="text-xs text-muted-foreground">
                      PNG, JPG, JPEG hasta 5MB
                    </p>
                  </div>
                </label>
              </div>

              {/* Preview de foto */}
              {imagenPreview && (
                <div className="relative inline-block">
                  <img
                    src={imagenPreview}
                    alt="Preview"
                    className="w-32 h-32 object-cover rounded-lg border"
                  />
                  <Button
                    type="button"
                    variant="destructive"
                    size="icon"
                    className="absolute top-2 right-2 h-6 w-6"
                    onClick={handleRemoveImage}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              )}

              {uploadingImage && (
                <Alert>
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>Subiendo foto...</AlertDescription>
                </Alert>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Sección: Estado */}
        <Card>
          <CardHeader>
            <CardTitle>Estado del Guía</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <Label htmlFor="estado">
                Estado <span className="text-red-500">*</span>
              </Label>
              <Select
                value={formValues.estado}
                onValueChange={(value) => setValue("estado", value)}
              >
                <SelectTrigger id="estado">
                  <SelectValue placeholder="Selecciona estado" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="activo">Activo</SelectItem>
                  <SelectItem value="inactivo">Inactivo</SelectItem>
                </SelectContent>
              </Select>
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
                    el registro del guía turístico.
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

export default AddGuiaForm;

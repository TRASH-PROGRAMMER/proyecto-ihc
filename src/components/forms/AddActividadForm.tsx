import React, { useState, useMemo } from "react";
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
  Activity,
  MapPin,
  FileText,
  Clock,
  Users,
  DollarSign,
  Zap,
  Image as ImageIcon,
  CheckCircle2,
  AlertCircle,
  Save,
  ArrowLeft,
  X,
  Upload,
} from "lucide-react";
import { toast } from "@/hooks/use-toast";

// Interfaz del formulario
interface ActividadData {
  nombreActividad: string;
  localidadSitio: string;
  tipoActividad: string;
  descripcion: string;
  duracion: string;
  edadMinima: string;
  precio: string;
  exigenciaFisica: string;
  guiaRequerido: string;
  equipoNecesario: string;
  fotos: string[];
  estado: string;
}

const LOCALIDADES = [
  "Laguna de Quilotoa",
  "Parque Nacional Cotopaxi",
  "Baños de Agua Santa",
  "Otavalo",
  "Puerto López",
  "Galápagos",
  "Selva Amazónica",
  "Imbabura",
];

const TIPOS_ACTIVIDAD = [
  "Aventura",
  "Cultural",
  "Naturaleza",
  "Ecoturismo",
  "Gastronomía",
  "Deportiva",
  "Educativa",
  "Histórica",
];

const EXIGENCIA_FISICA = ["Baja", "Media", "Alta"];

const ESTADOS = ["Activo", "Suspendido"];

export const AddActividadForm: React.FC = () => {
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<ActividadData>({
    defaultValues: {
      nombreActividad: "",
      localidadSitio: "",
      tipoActividad: "",
      descripcion: "",
      duracion: "",
      edadMinima: "",
      precio: "",
      exigenciaFisica: "",
      guiaRequerido: "",
      equipoNecesario: "",
      fotos: [],
      estado: "",
    },
  });

  const [uploadingImages, setUploadingImages] = useState(false);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);

  const formValues = watch();

  // Calcular progreso del formulario
  const progreso = useMemo(() => {
    const campos = [
      formValues.nombreActividad,
      formValues.localidadSitio,
      formValues.tipoActividad,
      formValues.descripcion,
      formValues.duracion,
      formValues.edadMinima,
      formValues.precio,
      formValues.exigenciaFisica,
      formValues.guiaRequerido,
      formValues.equipoNecesario,
      formValues.fotos.length > 0,
      formValues.estado,
    ];

    const camposCompletos = campos.filter((campo) => {
      if (typeof campo === "boolean") return campo;
      if (typeof campo === "string") return campo.trim() !== "";
      return false;
    }).length;

    return Math.round((camposCompletos / campos.length) * 100);
  }, [formValues]);

  // Manejo de subida de múltiples imágenes
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploadingImages(true);

    try {
      const newImages: string[] = [];

      for (let i = 0; i < files.length; i++) {
        const file = files[i];

        // Validar tipo de archivo
        if (!file.type.startsWith("image/")) {
          toast({
            title: "Error",
            description: `${file.name} no es una imagen válida`,
            variant: "destructive",
          });
          continue;
        }

        // Validar tamaño (máx 5MB)
        if (file.size > 5 * 1024 * 1024) {
          toast({
            title: "Error",
            description: `${file.name} excede el tamaño máximo de 5MB`,
            variant: "destructive",
          });
          continue;
        }

        // Crear preview local
        const reader = new FileReader();
        reader.onloadend = () => {
          setImagePreviews((prev) => [...prev, reader.result as string]);
        };
        reader.readAsDataURL(file);

        // TODO: Implementar subida real a Cloudinary
        const uploadedUrl = `https://via.placeholder.com/300?text=${file.name}`;
        newImages.push(uploadedUrl);
      }

      setValue("fotos", [...formValues.fotos, ...newImages]);

      if (newImages.length > 0) {
        toast({
          title: "Éxito",
          description: `${newImages.length} imagen(es) subida(s) correctamente`,
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Error al subir las imágenes",
        variant: "destructive",
      });
    } finally {
      setUploadingImages(false);
    }
  };

  // Eliminar imagen
  const handleRemoveImage = (index: number) => {
    const newFotos = formValues.fotos.filter((_, i) => i !== index);
    const newPreviews = imagePreviews.filter((_, i) => i !== index);
    setValue("fotos", newFotos);
    setImagePreviews(newPreviews);
  };

  // Envío del formulario
  const onSubmit = (data: ActividadData) => {
    console.log("Datos de la actividad:", data);

    toast({
      title: "Actividad registrada",
      description: `${data.nombreActividad} se ha registrado exitosamente`,
    });

    // navigate("/dashboard/admin");
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      {/* Encabezado */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Activity className="h-8 w-8 text-primary" />
            Nueva Actividad/Servicio
          </h1>
          <p className="text-muted-foreground mt-1">
            Registra una nueva actividad o servicio turístico
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
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5" />
              Información Básica
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Nombre de la actividad */}
            <div className="space-y-2">
              <Label htmlFor="nombreActividad">
                Nombre de la actividad <span className="text-red-500">*</span>
              </Label>
              <Input
                id="nombreActividad"
                placeholder="Ej: Senderismo a Laguna Quilotoa"
                {...register("nombreActividad", {
                  required: "El nombre de la actividad es obligatorio",
                  minLength: {
                    value: 5,
                    message: "El nombre debe tener al menos 5 caracteres",
                  },
                })}
              />
              {errors.nombreActividad && (
                <p className="text-sm text-red-500">{errors.nombreActividad.message}</p>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Localidad/Sitio */}
              <div className="space-y-2">
                <Label htmlFor="localidadSitio">
                  Localidad/Sitio <span className="text-red-500">*</span>
                </Label>
                <Select
                  value={formValues.localidadSitio}
                  onValueChange={(value) => setValue("localidadSitio", value)}
                >
                  <SelectTrigger id="localidadSitio">
                    <SelectValue placeholder="Selecciona localidad" />
                  </SelectTrigger>
                  <SelectContent>
                    {LOCALIDADES.map((localidad) => (
                      <SelectItem key={localidad} value={localidad}>
                        {localidad}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Tipo de actividad */}
              <div className="space-y-2">
                <Label htmlFor="tipoActividad">
                  Tipo de actividad <span className="text-red-500">*</span>
                </Label>
                <Select
                  value={formValues.tipoActividad}
                  onValueChange={(value) => setValue("tipoActividad", value)}
                >
                  <SelectTrigger id="tipoActividad">
                    <SelectValue placeholder="Selecciona tipo" />
                  </SelectTrigger>
                  <SelectContent>
                    {TIPOS_ACTIVIDAD.map((tipo) => (
                      <SelectItem key={tipo} value={tipo}>
                        {tipo}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Sección: Descripción */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Descripción
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="descripcion">
                Descripción <span className="text-red-500">*</span>
              </Label>
              <Textarea
                id="descripcion"
                placeholder="Describe detalladamente la actividad, qué incluye, puntos destacados, etc."
                rows={6}
                {...register("descripcion", {
                  required: "La descripción es obligatoria",
                  minLength: {
                    value: 50,
                    message: "La descripción debe tener al menos 50 caracteres",
                  },
                })}
              />
              <p className="text-xs text-muted-foreground text-right">
                {formValues.descripcion?.length || 0} caracteres (mínimo 50)
              </p>
              {errors.descripcion && (
                <p className="text-sm text-red-500">{errors.descripcion.message}</p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Sección: Duración y Requisitos */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              Duración y Requisitos
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Duración */}
              <div className="space-y-2">
                <Label htmlFor="duracion">
                  Duración (minutos) <span className="text-red-500">*</span>
                </Label>
                <div className="relative">
                  <Clock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="duracion"
                    type="number"
                    min="15"
                    placeholder="Ej: 120"
                    className="pl-10"
                    {...register("duracion", {
                      required: "La duración es obligatoria",
                      min: { value: 15, message: "Mínimo 15 minutos" },
                    })}
                  />
                </div>
                {errors.duracion && (
                  <p className="text-sm text-red-500">{errors.duracion.message}</p>
                )}
              </div>

              {/* Edad mínima */}
              <div className="space-y-2">
                <Label htmlFor="edadMinima">
                  Edad mínima <span className="text-red-500">*</span>
                </Label>
                <div className="relative">
                  <Users className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="edadMinima"
                    type="number"
                    min="0"
                    placeholder="Ej: 12"
                    className="pl-10"
                    {...register("edadMinima", {
                      required: "La edad mínima es obligatoria",
                      min: { value: 0, message: "Debe ser 0 o mayor" },
                    })}
                  />
                </div>
                {errors.edadMinima && (
                  <p className="text-sm text-red-500">{errors.edadMinima.message}</p>
                )}
              </div>
            </div>

            <Separator />

            {/* Exigencia física */}
            <div className="space-y-2">
              <Label htmlFor="exigenciaFisica">
                Exigencia física <span className="text-red-500">*</span>
              </Label>
              <Select
                value={formValues.exigenciaFisica}
                onValueChange={(value) => setValue("exigenciaFisica", value)}
              >
                <SelectTrigger id="exigenciaFisica">
                  <SelectValue placeholder="Selecciona exigencia" />
                </SelectTrigger>
                <SelectContent>
                  {EXIGENCIA_FISICA.map((exigencia) => (
                    <SelectItem key={exigencia} value={exigencia}>
                      {exigencia}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Guía requerido */}
            <div className="space-y-2">
              <Label htmlFor="guiaRequerido">
                ¿Guía requerido? <span className="text-red-500">*</span>
              </Label>
              <Select
                value={formValues.guiaRequerido}
                onValueChange={(value) => setValue("guiaRequerido", value)}
              >
                <SelectTrigger id="guiaRequerido">
                  <SelectValue placeholder="Selecciona opción" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="si">Sí</SelectItem>
                  <SelectItem value="no">No</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Sección: Precio y Equipo */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <DollarSign className="h-5 w-5" />
              Precio y Equipo
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Precio */}
            <div className="space-y-2">
              <Label htmlFor="precio">
                Precio (USD) <span className="text-red-500">*</span>
              </Label>
              <div className="relative">
                <DollarSign className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="precio"
                  type="number"
                  step="0.01"
                  min="0"
                  placeholder="Ej: 45.00"
                  className="pl-10"
                  {...register("precio", {
                    required: "El precio es obligatorio",
                    min: { value: 0, message: "El precio no puede ser negativo" },
                  })}
                />
              </div>
              <p className="text-xs text-muted-foreground">Por persona</p>
              {errors.precio && (
                <p className="text-sm text-red-500">{errors.precio.message}</p>
              )}
            </div>

            <Separator />

            {/* Equipo necesario */}
            <div className="space-y-2">
              <Label htmlFor="equipoNecesario">
                Equipo necesario <span className="text-red-500">*</span>
              </Label>
              <Textarea
                id="equipoNecesario"
                placeholder="Ej: Zapatos de senderismo, mochila, agua, protector solar, casco (si es necesario), etc."
                rows={4}
                {...register("equipoNecesario", {
                  required: "El equipo necesario es obligatorio",
                  minLength: {
                    value: 10,
                    message: "Describe el equipo necesario",
                  },
                })}
              />
              {errors.equipoNecesario && (
                <p className="text-sm text-red-500">{errors.equipoNecesario.message}</p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Sección: Fotos */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ImageIcon className="h-5 w-5" />
              Galería de Fotos
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="border-2 border-dashed rounded-lg p-6 text-center hover:border-primary transition-colors">
              <input
                id="fotos"
                type="file"
                accept="image/*"
                multiple
                onChange={handleImageUpload}
                className="hidden"
              />
              <label htmlFor="fotos" className="cursor-pointer flex flex-col items-center gap-2">
                <Upload className="h-8 w-8 text-muted-foreground" />
                <div className="space-y-1">
                  <p className="text-sm font-medium">
                    Haz clic para subir o arrastra imágenes
                  </p>
                  <p className="text-xs text-muted-foreground">
                    PNG, JPG, JPEG hasta 5MB por archivo
                  </p>
                </div>
              </label>
            </div>

            {/* Previews de imágenes */}
            {imagePreviews.length > 0 && (
              <div>
                <Label className="text-sm font-medium mb-2 block">
                  Imágenes subidas ({imagePreviews.length})
                </Label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {imagePreviews.map((preview, index) => (
                    <div key={index} className="relative group">
                      <img
                        src={preview}
                        alt={`Preview ${index + 1}`}
                        className="w-full h-32 object-cover rounded-lg border"
                      />
                      <Button
                        type="button"
                        variant="destructive"
                        size="icon"
                        className="absolute top-2 right-2 h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                        onClick={() => handleRemoveImage(index)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {uploadingImages && (
              <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>Subiendo imágenes...</AlertDescription>
              </Alert>
            )}
          </CardContent>
        </Card>

        {/* Sección: Estado */}
        <Card>
          <CardHeader>
            <CardTitle>Estado de la Actividad</CardTitle>
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
                  {ESTADOS.map((estado) => (
                    <SelectItem key={estado} value={estado}>
                      {estado}
                    </SelectItem>
                  ))}
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
                    la actividad.
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

export default AddActividadForm;

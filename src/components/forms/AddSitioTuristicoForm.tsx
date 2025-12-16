import React, { useState, useEffect, useMemo } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
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
  MapPin,
  Image as ImageIcon,
  FileText,
  Clock,
  Mountain,
  CheckCircle2,
  AlertCircle,
  Upload,
  X,
  Save,
  ArrowLeft,
} from "lucide-react";
import { toast } from "@/hooks/use-toast";

// Interfaz del formulario
interface SitioTuristicoData {
  nombreSitio: string;
  tipoSitio: string;
  dificultad: string;
  tiempoEstimado: string;
  descripcionCorta: string;
  descripcionDetallada: string;
  fotos: string[];
  serviciosBanos: boolean;
  serviciosParqueadero: boolean;
  serviciosSenalizacion: boolean;
  serviciosGuia: boolean;
  serviciosRestaurante: boolean;
  accesibilidadPMR: boolean;
  estado: string;
}

const TIPOS_SITIO = [
  "Sendero",
  "Mirador",
  "Lago",
  "Bosque",
  "Cascada",
  "Montaña",
  "Playa",
  "Río",
  "Parque Natural",
  "Reserva Ecológica",
];

const DIFICULTADES = ["Baja", "Media", "Alta"];

const ESTADOS = ["Activo", "Mantenimiento", "Cerrado"];

export const AddSitioTuristicoForm: React.FC = () => {
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<SitioTuristicoData>({
    defaultValues: {
      nombreSitio: "",
      tipoSitio: "",
      dificultad: "",
      tiempoEstimado: "",
      descripcionCorta: "",
      descripcionDetallada: "",
      fotos: [],
      serviciosBanos: false,
      serviciosParqueadero: false,
      serviciosSenalizacion: false,
      serviciosGuia: false,
      serviciosRestaurante: false,
      accesibilidadPMR: false,
      estado: "",
    },
  });

  const [uploadingImage, setUploadingImage] = useState(false);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);

  // Observar todos los campos del formulario
  const formValues = watch();

  // Calcular progreso del formulario
  const progreso = useMemo(() => {
    const campos = [
      formValues.nombreSitio,
      formValues.tipoSitio,
      formValues.dificultad,
      formValues.tiempoEstimado,
      formValues.descripcionCorta,
      formValues.descripcionDetallada,
      formValues.fotos.length > 0,
      // Al menos un servicio seleccionado
      formValues.serviciosBanos ||
        formValues.serviciosParqueadero ||
        formValues.serviciosSenalizacion ||
        formValues.serviciosGuia ||
        formValues.serviciosRestaurante,
      formValues.estado,
    ];

    const camposCompletos = campos.filter((campo) => {
      if (typeof campo === "boolean") return campo;
      if (typeof campo === "string") return campo.trim() !== "";
      return false;
    }).length;

    return Math.round((camposCompletos / campos.length) * 100);
  }, [formValues]);

  // Manejo de subida de imágenes
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploadingImage(true);

    try {
      // Simulación de subida a Cloudinary (implementar integración real)
      const newImages: string[] = [];

      for (let i = 0; i < files.length; i++) {
        const file = files[i];

        // Validar tipo de archivo
        if (!file.type.startsWith("image/")) {
          toast({
            title: "Error",
            description: "Solo se permiten archivos de imagen",
            variant: "destructive",
          });
          continue;
        }

        // Validar tamaño (máx 5MB)
        if (file.size > 5 * 1024 * 1024) {
          toast({
            title: "Error",
            description: `La imagen ${file.name} excede el tamaño máximo de 5MB`,
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
        // const uploadedUrl = await uploadToCloudinary(file);
        const uploadedUrl = `https://via.placeholder.com/300?text=${file.name}`;
        newImages.push(uploadedUrl);
      }

      setValue("fotos", [...formValues.fotos, ...newImages]);

      toast({
        title: "Éxito",
        description: `${newImages.length} imagen(es) subida(s) correctamente`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Error al subir las imágenes",
        variant: "destructive",
      });
    } finally {
      setUploadingImage(false);
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
  const onSubmit = (data: SitioTuristicoData) => {
    console.log("Datos del sitio turístico:", data);

    // TODO: Implementar guardado en backend/localStorage
    toast({
      title: "Sitio turístico guardado",
      description: `${data.nombreSitio} se ha registrado exitosamente`,
    });

    // Opcional: Navegar a otra página
    // navigate("/dashboard");
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      {/* Encabezado */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Mountain className="h-8 w-8 text-primary" />
            Nuevo Sitio Turístico
          </h1>
          <p className="text-muted-foreground mt-1">
            Completa la información del lugar turístico
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
              <MapPin className="h-5 w-5" />
              Información Básica
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Nombre del sitio */}
            <div className="space-y-2">
              <Label htmlFor="nombreSitio">
                Nombre del sitio <span className="text-red-500">*</span>
              </Label>
              <Input
                id="nombreSitio"
                placeholder="Ej: Laguna de Quilotoa"
                {...register("nombreSitio", {
                  required: "El nombre del sitio es obligatorio",
                  minLength: {
                    value: 3,
                    message: "El nombre debe tener al menos 3 caracteres",
                  },
                })}
              />
              {errors.nombreSitio && (
                <p className="text-sm text-red-500">{errors.nombreSitio.message}</p>
              )}
            </div>

            {/* Tipo de sitio */}
            <div className="space-y-2">
              <Label htmlFor="tipoSitio">
                Tipo de sitio <span className="text-red-500">*</span>
              </Label>
              <Select
                value={formValues.tipoSitio}
                onValueChange={(value) => setValue("tipoSitio", value)}
              >
                <SelectTrigger id="tipoSitio">
                  <SelectValue placeholder="Selecciona el tipo de sitio" />
                </SelectTrigger>
                <SelectContent>
                  {TIPOS_SITIO.map((tipo) => (
                    <SelectItem key={tipo} value={tipo}>
                      {tipo}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.tipoSitio && (
                <p className="text-sm text-red-500">{errors.tipoSitio.message}</p>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Dificultad */}
              <div className="space-y-2">
                <Label htmlFor="dificultad">
                  Dificultad <span className="text-red-500">*</span>
                </Label>
                <Select
                  value={formValues.dificultad}
                  onValueChange={(value) => setValue("dificultad", value)}
                >
                  <SelectTrigger id="dificultad">
                    <SelectValue placeholder="Selecciona dificultad" />
                  </SelectTrigger>
                  <SelectContent>
                    {DIFICULTADES.map((dif) => (
                      <SelectItem key={dif} value={dif}>
                        {dif}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Tiempo estimado */}
              <div className="space-y-2">
                <Label htmlFor="tiempoEstimado">
                  Tiempo estimado (minutos) <span className="text-red-500">*</span>
                </Label>
                <div className="relative">
                  <Clock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="tiempoEstimado"
                    type="number"
                    min="0"
                    placeholder="Ej: 120"
                    className="pl-10"
                    {...register("tiempoEstimado", {
                      required: "El tiempo estimado es obligatorio",
                      min: { value: 1, message: "El tiempo debe ser mayor a 0" },
                    })}
                  />
                </div>
                {errors.tiempoEstimado && (
                  <p className="text-sm text-red-500">{errors.tiempoEstimado.message}</p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Sección: Descripciones */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Descripciones
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Descripción corta */}
            <div className="space-y-2">
              <Label htmlFor="descripcionCorta">
                Descripción corta <span className="text-red-500">*</span>
              </Label>
              <Textarea
                id="descripcionCorta"
                placeholder="Breve resumen del sitio (máx 200 caracteres)"
                rows={3}
                maxLength={200}
                {...register("descripcionCorta", {
                  required: "La descripción corta es obligatoria",
                  maxLength: {
                    value: 200,
                    message: "Máximo 200 caracteres",
                  },
                })}
              />
              <p className="text-xs text-muted-foreground text-right">
                {formValues.descripcionCorta?.length || 0}/200 caracteres
              </p>
              {errors.descripcionCorta && (
                <p className="text-sm text-red-500">{errors.descripcionCorta.message}</p>
              )}
            </div>

            {/* Descripción detallada */}
            <div className="space-y-2">
              <Label htmlFor="descripcionDetallada">
                Descripción detallada <span className="text-red-500">*</span>
              </Label>
              <Textarea
                id="descripcionDetallada"
                placeholder="Información completa sobre el sitio, historia, características, etc."
                rows={6}
                {...register("descripcionDetallada", {
                  required: "La descripción detallada es obligatoria",
                  minLength: {
                    value: 50,
                    message: "La descripción debe tener al menos 50 caracteres",
                  },
                })}
              />
              <p className="text-xs text-muted-foreground text-right">
                {formValues.descripcionDetallada?.length || 0} caracteres
              </p>
              {errors.descripcionDetallada && (
                <p className="text-sm text-red-500">
                  {errors.descripcionDetallada.message}
                </p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Sección: Fotos */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ImageIcon className="h-5 w-5" />
              Fotografías
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="fotos">Subir fotos del sitio</Label>
              <div className="border-2 border-dashed rounded-lg p-6 text-center hover:border-primary transition-colors">
                <input
                  id="fotos"
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleImageUpload}
                  className="hidden"
                />
                <label
                  htmlFor="fotos"
                  className="cursor-pointer flex flex-col items-center gap-2"
                >
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
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
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
              )}

              {uploadingImage && (
                <Alert>
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>Subiendo imágenes...</AlertDescription>
                </Alert>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Sección: Servicios y Accesibilidad */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle2 className="h-5 w-5" />
              Servicios y Accesibilidad
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Servicios disponibles */}
            <div className="space-y-3">
              <Label>Servicios disponibles</Label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="serviciosBanos"
                    checked={formValues.serviciosBanos}
                    onCheckedChange={(checked) =>
                      setValue("serviciosBanos", checked as boolean)
                    }
                  />
                  <Label htmlFor="serviciosBanos" className="font-normal cursor-pointer">
                    Baños
                  </Label>
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="serviciosParqueadero"
                    checked={formValues.serviciosParqueadero}
                    onCheckedChange={(checked) =>
                      setValue("serviciosParqueadero", checked as boolean)
                    }
                  />
                  <Label
                    htmlFor="serviciosParqueadero"
                    className="font-normal cursor-pointer"
                  >
                    Parqueadero
                  </Label>
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="serviciosSenalizacion"
                    checked={formValues.serviciosSenalizacion}
                    onCheckedChange={(checked) =>
                      setValue("serviciosSenalizacion", checked as boolean)
                    }
                  />
                  <Label
                    htmlFor="serviciosSenalizacion"
                    className="font-normal cursor-pointer"
                  >
                    Señalización
                  </Label>
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="serviciosGuia"
                    checked={formValues.serviciosGuia}
                    onCheckedChange={(checked) =>
                      setValue("serviciosGuia", checked as boolean)
                    }
                  />
                  <Label htmlFor="serviciosGuia" className="font-normal cursor-pointer">
                    Guía turístico
                  </Label>
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="serviciosRestaurante"
                    checked={formValues.serviciosRestaurante}
                    onCheckedChange={(checked) =>
                      setValue("serviciosRestaurante", checked as boolean)
                    }
                  />
                  <Label
                    htmlFor="serviciosRestaurante"
                    className="font-normal cursor-pointer"
                  >
                    Restaurante/Cafetería
                  </Label>
                </div>
              </div>
            </div>

            <Separator />

            {/* Accesibilidad PMR */}
            <div className="space-y-2">
              <Label>Accesibilidad para personas con movilidad reducida (PMR)</Label>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="accesibilidadPMR"
                  checked={formValues.accesibilidadPMR}
                  onCheckedChange={(checked) =>
                    setValue("accesibilidadPMR", checked as boolean)
                  }
                />
                <Label htmlFor="accesibilidadPMR" className="font-normal cursor-pointer">
                  Este sitio es accesible para personas con movilidad reducida
                </Label>
              </div>
              {formValues.accesibilidadPMR && (
                <Alert className="bg-green-50 border-green-200">
                  <CheckCircle2 className="h-4 w-4 text-green-600" />
                  <AlertDescription className="text-green-800">
                    Sitio certificado como accesible para PMR
                  </AlertDescription>
                </Alert>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Sección: Estado */}
        <Card>
          <CardHeader>
            <CardTitle>Estado del sitio</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <Label htmlFor="estado">
                Estado actual <span className="text-red-500">*</span>
              </Label>
              <Select
                value={formValues.estado}
                onValueChange={(value) => setValue("estado", value)}
              >
                <SelectTrigger id="estado">
                  <SelectValue placeholder="Selecciona el estado" />
                </SelectTrigger>
                <SelectContent>
                  {ESTADOS.map((estado) => (
                    <SelectItem key={estado} value={estado}>
                      {estado}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.estado && (
                <p className="text-sm text-red-500">{errors.estado.message}</p>
              )}
            </div>
          </CardContent>
        </Card>

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

export default AddSitioTuristicoForm;

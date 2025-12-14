import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { PlusCircle, Trash2, ArrowRight, Info, Users, History, ArrowLeft, MapPin, Calendar } from "lucide-react";
import { getAllLocalidades, deleteLocalidad, LocalidadData } from "@/utils/localidadStorage";

export default function DashboardAdmin() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [localidades, setLocalidades] = useState<LocalidadData[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Cargar localidades al montar el componente
  useEffect(() => {
    loadLocalidades();
  }, []);

  const loadLocalidades = () => {
    setIsLoading(true);
    try {
      const data = getAllLocalidades();
      setLocalidades(data);
    } catch (error) {
      console.error("Error al cargar localidades:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddLocalidad = () => {
    // Generar ID único para nueva localidad
    const nuevoId = `localidad-${Date.now()}`;
    // Navegar directamente al formulario de información
    navigate(`/dashboard/admin/localidades/${nuevoId}/info`);
  };

  const handleDeleteLocalidad = (id: string, nombre: string) => {
    if (!confirm(`¿Seguro que quieres eliminar la localidad "${nombre}"? Esta acción no se puede deshacer.`)) return;
    
    try {
      deleteLocalidad(id);
      loadLocalidades(); // Recargar lista
    } catch (error) {
      console.error("Error al eliminar localidad:", error);
      alert("Error al eliminar la localidad. Intenta nuevamente.");
    }
  };

  const handleGoToSection = (localidadId: string, section: "info" | "guias" | "historial") => {
    navigate(`/dashboard/admin/localidades/${localidadId}/${section}`);
  };

  // Mostrar loading
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando localidades...</p>
        </div>
      </div>
    );
  }

  // Vista principal del dashboard
  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 sm:p-6">
      <div className="w-full max-w-7xl mx-auto">
        {/* Header mejorado */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-2">
                Panel de Administración
              </h1>
              <p className="text-gray-600 flex items-center gap-2">
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                  👤 {user?.nombre}
                </span>
                <span className="text-sm">
                  {localidades.length} {localidades.length === 1 ? 'localidad registrada' : 'localidades registradas'}
                </span>
              </p>
            </div>
            <Button
              onClick={handleAddLocalidad}
              className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 self-start sm:self-auto"
            >
              <PlusCircle className="w-5 h-5" />
              Nueva Localidad
            </Button>
          </div>
        </div>

        {/* Lista de localidades existentes */}
        {localidades.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-12 text-center">
            <div className="w-20 h-20 bg-gradient-to-br from-green-100 to-green-200 rounded-full flex items-center justify-center mx-auto mb-6">
              <MapPin className="w-10 h-10 text-green-600" />
            </div>
            <h3 className="text-2xl font-bold text-gray-800 mb-3">No hay localidades registradas</h3>
            <p className="text-gray-600 mb-8 max-w-md mx-auto">
              Comienza agregando tu primera localidad turística para empezar a gestionar rutas, guías y visitantes.
            </p>
            <Button
              onClick={handleAddLocalidad}
              className="bg-green-600 hover:bg-green-700 text-white px-8 py-3 text-lg"
            >
              <PlusCircle className="w-5 h-5 mr-2" />
              Crear primera localidad
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {localidades.map((loc) => (
              <Card
                key={loc.id}
                className="hover:shadow-xl transition-all duration-200 border-2 hover:border-green-300 bg-white overflow-hidden"
              >
                <CardHeader className="pb-3 bg-gradient-to-r from-green-50 to-blue-50 border-b">
                  <CardTitle className="flex items-start justify-between gap-2">
                    <div className="flex-1">
                      <h3 className="text-lg font-bold text-gray-800 mb-1 line-clamp-2">
                        {loc.nombre || 'Sin nombre'}
                      </h3>
                      <div className="flex flex-col gap-1 text-xs text-gray-600">
                        {loc.ciudad && (
                          <span className="flex items-center gap-1">
                            <MapPin className="w-3 h-3" />
                            {loc.ciudad}, {loc.provincia || loc.pais}
                          </span>
                        )}
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          {new Date(loc.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      loc.status === 'published' 
                        ? 'bg-green-100 text-green-800' 
                        : loc.status === 'draft'
                        ? 'bg-yellow-100 text-yellow-800'
                        : 'bg-gray-100 text-gray-800'
                    }`}>
                      {loc.status === 'published' ? '✓ Publicado' : loc.status === 'draft' ? '📝 Borrador' : 'Archivado'}
                    </span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-4 space-y-2">
                  {loc.descripcionCorta && (
                    <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                      {loc.descripcionCorta}
                    </p>
                  )}
                  <div className="space-y-2">
                    <Button
                      onClick={() => handleGoToSection(loc.id, "info")}
                      className="w-full bg-green-600 hover:bg-green-700 text-white text-sm justify-start"
                    >
                      <Info className="w-4 h-4 mr-2" />
                      Información
                    </Button>
                    <Button
                      onClick={() => handleGoToSection(loc.id, "guias")}
                      className="w-full bg-blue-600 hover:bg-blue-700 text-white text-sm justify-start"
                    >
                      <Users className="w-4 h-4 mr-2" />
                      Gestionar Guías
                    </Button>
                    <Button
                      onClick={() => handleGoToSection(loc.id, "historial")}
                      className="w-full bg-yellow-600 hover:bg-yellow-700 text-white text-sm justify-start"
                    >
                      <History className="w-4 h-4 mr-2" />
                      Ver Historial
                    </Button>
                    <Button
                      onClick={() => handleDeleteLocalidad(loc.id, loc.nombre)}
                      variant="destructive"
                      className="w-full mt-3 text-sm justify-start"
                    >
                      <Trash2 className="w-4 h-4 mr-2" />
                      Eliminar Localidad
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Información adicional al final */}
        {localidades.length > 0 && (
          <Alert className="mt-6 border-blue-200 bg-blue-50">
            <Info className="w-4 h-4" />
            <AlertDescription className="text-blue-800">
              <strong>Tip:</strong> Puedes gestionar la información, guías y ver el historial de cambios de cada localidad desde sus respectivas tarjetas.
            </AlertDescription>
          </Alert>
        )}
      </div>
    </div>
  );
}
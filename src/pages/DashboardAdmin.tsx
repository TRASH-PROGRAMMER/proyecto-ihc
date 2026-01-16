import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { PlusCircle, Trash2, ArrowRight, Info, Users, History, ArrowLeft, MapPin, Calendar, Bell, Settings, Zap, TrendingUp, Eye, HelpCircle, ChevronDown, ChevronUp, Grid } from "lucide-react";
import { getAllLocalidades, deleteLocalidad, LocalidadData } from "@/utils/localidadStorage";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

export default function DashboardAdmin() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [localidades, setLocalidades] = useState<LocalidadData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [notificaciones, setNotificaciones] = useState([
    { id: 1, tipo: 'info', mensaje: 'Nueva localidad pendiente de revisión', tiempo: 'Hace 5 min', leido: false },
    { id: 2, tipo: 'success', mensaje: 'Localidad "Montecristi" aprobada', tiempo: 'Hace 1 hora', leido: false },
    { id: 3, tipo: 'warning', mensaje: 'Actualización del sistema disponible', tiempo: 'Hace 2 horas', leido: true },
  ]);
  const [mostrarNotificaciones, setMostrarNotificaciones] = useState(false);
  const [widgetsVisibles, setWidgetsVisibles] = useState({
    estadisticas: true,
    actividad: true,
    accesosRapidos: true,
  });

  // Cargar localidades al montar el componente
  useEffect(() => {
    loadLocalidades();
  }, []);

  // Atajos de teclado
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      // Ctrl/Cmd + N: Nueva localidad
      if ((e.ctrlKey || e.metaKey) && e.key === 'n') {
        e.preventDefault();
        handleAddLocalidad();
      }
      // Ctrl/Cmd + K: Mostrar/ocultar notificaciones
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        setMostrarNotificaciones(!mostrarNotificaciones);
      }
      // ?: Mostrar ayuda
      if (e.key === '?') {
        alert('Atajos de teclado:\n\nCtrl/Cmd + N: Nueva localidad\nCtrl/Cmd + K: Notificaciones\nCtrl/Cmd + 1-3: Saltar a widgets\n?: Ver ayuda');
      }
    };
    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [mostrarNotificaciones]);

  const marcarNotificacionLeida = (id: number) => {
    setNotificaciones(prev => 
      prev.map(n => n.id === id ? { ...n, leido: true } : n)
    );
  };

  const toggleWidget = (widget: keyof typeof widgetsVisibles) => {
    setWidgetsVisibles(prev => ({ ...prev, [widget]: !prev[widget] }));
  };

  const notificacionesNoLeidas = notificaciones.filter(n => !n.leido).length;

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
    <TooltipProvider>
      <div className="flex flex-col min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 sm:p-6">
        <div className="w-full max-w-7xl mx-auto">
          {/* Header mejorado con notificaciones */}
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
              
              <div className="flex items-center gap-3">
                {/* Notificaciones */}
                <Tooltip>
                  <TooltipTrigger asChild>
                    <button
                      onClick={() => setMostrarNotificaciones(!mostrarNotificaciones)}
                      className="relative p-2 hover:bg-gray-100 rounded-full transition-colors"
                    >
                      <Bell className="w-5 h-5 text-gray-600" />
                      {notificacionesNoLeidas > 0 && (
                        <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                          {notificacionesNoLeidas}
                        </span>
                      )}
                    </button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p className="text-xs">Notificaciones ({notificacionesNoLeidas} nuevas)</p>
                    <p className="text-xs text-gray-400">Ctrl/Cmd + K</p>
                  </TooltipContent>
                </Tooltip>

                {/* Ayuda */}
                <Tooltip>
                  <TooltipTrigger asChild>
                    <button
                      onClick={() => alert('Atajos de teclado:\n\nCtrl/Cmd + N: Nueva localidad\nCtrl/Cmd + K: Notificaciones\n?: Ver ayuda')}
                      className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                    >
                      <HelpCircle className="w-5 h-5 text-gray-600" />
                    </button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p className="text-xs">Ayuda y atajos de teclado</p>
                    <p className="text-xs text-gray-400">Presiona ?</p>
                  </TooltipContent>
                </Tooltip>

                {/* Configurar widgets */}
                <Tooltip>
                  <TooltipTrigger asChild>
                    <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                      <Settings className="w-5 h-5 text-gray-600" />
                    </button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p className="text-xs">Configurar dashboard</p>
                  </TooltipContent>
                </Tooltip>

                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      onClick={handleAddLocalidad}
                      className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200"
                    >
                      <PlusCircle className="w-5 h-5" />
                      Nueva Localidad
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p className="text-xs">Crear nueva localidad</p>
                    <p className="text-xs text-gray-400">Ctrl/Cmd + N</p>
                  </TooltipContent>
                </Tooltip>
              </div>
            </div>

            {/* Panel de notificaciones */}
            {mostrarNotificaciones && (
              <div className="mt-4 border-t pt-4 animate-in slide-in-from-top-2">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-semibold text-sm">Notificaciones</h3>
                  <button
                    onClick={() => setNotificaciones(prev => prev.map(n => ({ ...n, leido: true })))}
                    className="text-xs text-emerald-600 hover:text-emerald-700"
                  >
                    Marcar todas como leídas
                  </button>
                </div>
                <div className="space-y-2 max-h-64 overflow-y-auto">
                  {notificaciones.map(notif => (
                    <div
                      key={notif.id}
                      onClick={() => marcarNotificacionLeida(notif.id)}
                      className={`p-3 rounded-lg border cursor-pointer transition-all ${
                        notif.leido ? 'bg-gray-50 border-gray-200' : 'bg-blue-50 border-blue-200'
                      }`}
                    >
                      <div className="flex items-start gap-2">
                        <Bell className={`w-4 h-4 mt-0.5 ${
                          notif.leido ? 'text-gray-400' : 'text-blue-600'
                        }`} />
                        <div className="flex-1">
                          <p className="text-sm font-medium">{notif.mensaje}</p>
                          <p className="text-xs text-gray-500">{notif.tiempo}</p>
                        </div>
                        {!notif.leido && <div className="w-2 h-2 bg-blue-600 rounded-full"></div>}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Widgets de estadísticas */}
          {widgetsVisibles.estadisticas && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <Tooltip>
                <TooltipTrigger asChild>
                  <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                      <CardTitle className="text-sm font-medium text-gray-600">Total Localidades</CardTitle>
                      <MapPin className="w-5 h-5 text-emerald-600" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-3xl font-bold">{localidades.length}</div>
                      <p className="text-xs text-gray-500 mt-1">+2 esta semana</p>
                    </CardContent>
                  </Card>
                </TooltipTrigger>
                <TooltipContent>
                  <p className="text-xs">Número total de localidades registradas</p>
                </TooltipContent>
              </Tooltip>

              <Tooltip>
                <TooltipTrigger asChild>
                  <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                      <CardTitle className="text-sm font-medium text-gray-600">Guías Activos</CardTitle>
                      <Users className="w-5 h-5 text-blue-600" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-3xl font-bold">24</div>
                      <p className="text-xs text-gray-500 mt-1">↑ 12% vs mes pasado</p>
                    </CardContent>
                  </Card>
                </TooltipTrigger>
                <TooltipContent>
                  <p className="text-xs">Guías certificados activos en la plataforma</p>
                </TooltipContent>
              </Tooltip>

              <Tooltip>
                <TooltipTrigger asChild>
                  <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                      <CardTitle className="text-sm font-medium text-gray-600">Visitantes/Mes</CardTitle>
                      <TrendingUp className="w-5 h-5 text-orange-600" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-3xl font-bold">1.2K</div>
                      <p className="text-xs text-gray-500 mt-1">↑ 8% vs mes pasado</p>
                    </CardContent>
                  </Card>
                </TooltipTrigger>
                <TooltipContent>
                  <p className="text-xs">Visitantes mensuales en todas las rutas</p>
                </TooltipContent>
              </Tooltip>
            </div>
          )}

          {/* Accesos rápidos */}
          {widgetsVisibles.accesosRapidos && (
            <Card className="mb-6">
              <CardHeader className="flex flex-row items-center justify-between">
                <div className="flex items-center gap-2">
                  <Zap className="w-5 h-5 text-yellow-600" />
                  <CardTitle className="text-lg">Accesos Rápidos</CardTitle>
                </div>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <button
                      onClick={() => toggleWidget('accesosRapidos')}
                      className="p-1 hover:bg-gray-100 rounded"
                    >
                      <ChevronUp className="w-4 h-4" />
                    </button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p className="text-xs">Ocultar widget</p>
                  </TooltipContent>
                </Tooltip>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <button
                        onClick={handleAddLocalidad}
                        className="flex flex-col items-center gap-2 p-4 rounded-lg border-2 border-dashed border-emerald-300 hover:border-emerald-500 hover:bg-emerald-50 transition-all"
                      >
                        <PlusCircle className="w-6 h-6 text-emerald-600" />
                        <span className="text-sm font-medium">Nueva Localidad</span>
                      </button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="text-xs">Crear nueva localidad turística</p>
                      <p className="text-xs text-gray-400">Ctrl/Cmd + N</p>
                    </TooltipContent>
                  </Tooltip>

                  <Tooltip>
                    <TooltipTrigger asChild>
                      <button className="flex flex-col items-center gap-2 p-4 rounded-lg border-2 border-gray-200 hover:border-blue-400 hover:bg-blue-50 transition-all">
                        <Users className="w-6 h-6 text-blue-600" />
                        <span className="text-sm font-medium">Ver Guías</span>
                      </button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="text-xs">Gestionar guías certificados</p>
                    </TooltipContent>
                  </Tooltip>

                  <Tooltip>
                    <TooltipTrigger asChild>
                      <button className="flex flex-col items-center gap-2 p-4 rounded-lg border-2 border-gray-200 hover:border-orange-400 hover:bg-orange-50 transition-all">
                        <TrendingUp className="w-6 h-6 text-orange-600" />
                        <span className="text-sm font-medium">Estadísticas</span>
                      </button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="text-xs">Ver estadísticas detalladas</p>
                    </TooltipContent>
                  </Tooltip>

                  <Tooltip>
                    <TooltipTrigger asChild>
                      <button className="flex flex-col items-center gap-2 p-4 rounded-lg border-2 border-gray-200 hover:border-purple-400 hover:bg-purple-50 transition-all">
                        <Settings className="w-6 h-6 text-purple-600" />
                        <span className="text-sm font-medium">Configuración</span>
                      </button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="text-xs">Configurar el sistema</p>
                    </TooltipContent>
                  </Tooltip>
                </div>
              </CardContent>
            </Card>
          )}

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
    </TooltipProvider>
  );
}
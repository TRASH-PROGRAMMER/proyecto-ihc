import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { 
  Calendar, 
  MapPin, 
  Users, 
  Star, 
  DollarSign, 
  TrendingUp, 
  Bell, 
  HelpCircle, 
  Settings, 
  MessageSquare, 
  Clock, 
  CheckCircle, 
  PlusCircle,
  Eye,
  Zap,
  ChevronUp
} from "lucide-react";

interface Tour {
  id: string;
  nombre: string;
  fecha: string;
  participantes: number;
  maxParticipantes: number;
  estado: 'pendiente' | 'confirmada' | 'completada';
  precio: number;
}

interface Notificacion {
  id: number;
  tipo: 'nueva-reserva' | 'cancelacion' | 'mensaje' | 'pago';
  mensaje: string;
  tiempo: string;
  leido: boolean;
}

export default function DashboardGuia() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [mostrarNotificaciones, setMostrarNotificaciones] = useState(false);
  const [widgetsVisibles, setWidgetsVisibles] = useState({
    estadisticas: true,
    proximosTours: true,
    accesosRapidos: true,
  });

  const [tours, setTours] = useState<Tour[]>([
    { id: '1', nombre: 'Ruta del Café Orgánico', fecha: '2024-01-20', participantes: 8, maxParticipantes: 12, estado: 'confirmada', precio: 45 },
    { id: '2', nombre: 'Tour de Artesanías', fecha: '2024-01-22', participantes: 5, maxParticipantes: 10, estado: 'pendiente', precio: 35 },
    { id: '3', nombre: 'Caminata Ecológica', fecha: '2024-01-25', participantes: 12, maxParticipantes: 15, estado: 'confirmada', precio: 50 },
  ]);

  const [notificaciones, setNotificaciones] = useState<Notificacion[]>([
    { id: 1, tipo: 'nueva-reserva', mensaje: 'Nueva reserva para "Ruta del Café" - 3 personas', tiempo: 'Hace 15 min', leido: false },
    { id: 2, tipo: 'mensaje', mensaje: 'Mensaje de María García sobre horarios', tiempo: 'Hace 1 hora', leido: false },
    { id: 3, tipo: 'pago', mensaje: 'Pago recibido: $135.00 - Tour del 18/01', tiempo: 'Hace 3 horas', leido: true },
  ]);

  useEffect(() => {
    setTimeout(() => setIsLoading(false), 1000);
  }, []);

  // Atajos de teclado
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 't') {
        e.preventDefault();
        alert('Crear nuevo tour');
      }
      if ((e.ctrlKey || e.metaKey) && e.key === 'c') {
        e.preventDefault();
        alert('Ver calendario');
      }
      if ((e.ctrlKey || e.metaKey) && e.key === 'm') {
        e.preventDefault();
        alert('Ver mensajes');
      }
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        setMostrarNotificaciones(!mostrarNotificaciones);
      }
      if (e.key === '?') {
        alert('Atajos de teclado:\\n\\nCtrl/Cmd + T: Nuevo tour\\nCtrl/Cmd + C: Calendario\\nCtrl/Cmd + M: Mensajes\\nCtrl/Cmd + K: Notificaciones\\n?: Ver ayuda');
      }
    };
    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [mostrarNotificaciones]);

  const marcarNotificacionLeida = (id: number) => {
    setNotificaciones(prev => prev.map(n => n.id === id ? { ...n, leido: true } : n));
  };

  const toggleWidget = (widget: keyof typeof widgetsVisibles) => {
    setWidgetsVisibles(prev => ({ ...prev, [widget]: !prev[widget] }));
  };

  const notificacionesNoLeidas = notificaciones.filter(n => !n.leido).length;
  const toursProximos = tours.filter(t => t.estado !== 'completada').length;
  const totalParticipantes = tours.reduce((acc, t) => acc + t.participantes, 0);
  const ingresosMes = tours.reduce((acc, t) => acc + (t.precio * t.participantes), 0);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <TooltipProvider>
      <div className="flex flex-col min-h-screen bg-gradient-to-br from-emerald-50 to-blue-50 p-4 sm:p-6">
        <div className="w-full max-w-7xl mx-auto">
          {/* Header */}
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-2">
                  Dashboard del Guía
                </h1>
                <p className="text-gray-600 flex items-center gap-2">
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-emerald-100 text-emerald-800">
                    👤 {user?.nombre}
                  </span>
                  <span className="text-sm">{toursProximos} tours próximos</span>
                </p>
              </div>
              
              <div className="flex items-center gap-3">
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

                <Tooltip>
                  <TooltipTrigger asChild>
                    <button
                      onClick={() => alert('Atajos de teclado:\\n\\nCtrl/Cmd + T: Nuevo tour\\nCtrl/Cmd + C: Calendario\\nCtrl/Cmd + M: Mensajes\\nCtrl/Cmd + K: Notificaciones\\n?: Ver ayuda')}
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
                    <Button className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700">
                      <PlusCircle className="w-5 h-5" />
                      Nuevo Tour
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p className="text-xs">Crear nuevo tour</p>
                    <p className="text-xs text-gray-400">Ctrl/Cmd + T</p>
                  </TooltipContent>
                </Tooltip>
              </div>
            </div>

            {/* Panel notificaciones */}
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
                        notif.leido ? 'bg-gray-50 border-gray-200' : 'bg-emerald-50 border-emerald-200'
                      }`}
                    >
                      <div className="flex items-start gap-2">
                        <Bell className={`w-4 h-4 mt-0.5 ${notif.leido ? 'text-gray-400' : 'text-emerald-600'}`} />
                        <div className="flex-1">
                          <p className="text-sm font-medium">{notif.mensaje}</p>
                          <p className="text-xs text-gray-500">{notif.tiempo}</p>
                        </div>
                        {!notif.leido && <div className="w-2 h-2 bg-emerald-600 rounded-full"></div>}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Widgets estadísticas */}
          {widgetsVisibles.estadisticas && (
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
              <Tooltip>
                <TooltipTrigger asChild>
                  <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                      <CardTitle className="text-sm font-medium text-gray-600">Tours Activos</CardTitle>
                      <MapPin className="w-5 h-5 text-emerald-600" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-3xl font-bold">{toursProximos}</div>
                      <p className="text-xs text-gray-500 mt-1">En las próximas semanas</p>
                    </CardContent>
                  </Card>
                </TooltipTrigger>
                <TooltipContent>
                  <p className="text-xs">Tours programados y confirmados</p>
                </TooltipContent>
              </Tooltip>

              <Tooltip>
                <TooltipTrigger asChild>
                  <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                      <CardTitle className="text-sm font-medium text-gray-600">Participantes</CardTitle>
                      <Users className="w-5 h-5 text-blue-600" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-3xl font-bold">{totalParticipantes}</div>
                      <p className="text-xs text-gray-500 mt-1">En tours programados</p>
                    </CardContent>
                  </Card>
                </TooltipTrigger>
                <TooltipContent>
                  <p className="text-xs">Total de participantes registrados</p>
                </TooltipContent>
              </Tooltip>

              <Tooltip>
                <TooltipTrigger asChild>
                  <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                      <CardTitle className="text-sm font-medium text-gray-600">Calificación</CardTitle>
                      <Star className="w-5 h-5 text-yellow-600" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-3xl font-bold">4.8</div>
                      <p className="text-xs text-gray-500 mt-1">⭐⭐⭐⭐⭐ (42 reseñas)</p>
                    </CardContent>
                  </Card>
                </TooltipTrigger>
                <TooltipContent>
                  <p className="text-xs">Calificación promedio de tus tours</p>
                </TooltipContent>
              </Tooltip>

              <Tooltip>
                <TooltipTrigger asChild>
                  <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                      <CardTitle className="text-sm font-medium text-gray-600">Ingresos/Mes</CardTitle>
                      <DollarSign className="w-5 h-5 text-green-600" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-3xl font-bold">${ingresosMes}</div>
                      <p className="text-xs text-gray-500 mt-1">↑ 15% vs mes anterior</p>
                    </CardContent>
                  </Card>
                </TooltipTrigger>
                <TooltipContent>
                  <p className="text-xs">Ingresos totales del mes actual</p>
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
                    <button onClick={() => toggleWidget('accesosRapidos')} className="p-1 hover:bg-gray-100 rounded">
                      <ChevronUp className="w-4 h-4" />
                    </button>
                  </TooltipTrigger>
                  <TooltipContent><p className="text-xs">Ocultar widget</p></TooltipContent>
                </Tooltip>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <button className="flex flex-col items-center gap-2 p-4 rounded-lg border-2 border-dashed border-emerald-300 hover:border-emerald-500 hover:bg-emerald-50 transition-all">
                        <PlusCircle className="w-6 h-6 text-emerald-600" />
                        <span className="text-sm font-medium">Nuevo Tour</span>
                      </button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="text-xs">Crear nuevo tour</p>
                      <p className="text-xs text-gray-400">Ctrl/Cmd + T</p>
                    </TooltipContent>
                  </Tooltip>

                  <Tooltip>
                    <TooltipTrigger asChild>
                      <button className="flex flex-col items-center gap-2 p-4 rounded-lg border-2 border-gray-200 hover:border-blue-400 hover:bg-blue-50 transition-all">
                        <Calendar className="w-6 h-6 text-blue-600" />
                        <span className="text-sm font-medium">Calendario</span>
                      </button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="text-xs">Ver calendario de tours</p>
                      <p className="text-xs text-gray-400">Ctrl/Cmd + C</p>
                    </TooltipContent>
                  </Tooltip>

                  <Tooltip>
                    <TooltipTrigger asChild>
                      <button className="flex flex-col items-center gap-2 p-4 rounded-lg border-2 border-gray-200 hover:border-purple-400 hover:bg-purple-50 transition-all">
                        <MessageSquare className="w-6 h-6 text-purple-600" />
                        <span className="text-sm font-medium">Mensajes</span>
                      </button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="text-xs">Ver mensajes de turistas</p>
                      <p className="text-xs text-gray-400">Ctrl/Cmd + M</p>
                    </TooltipContent>
                  </Tooltip>

                  <Tooltip>
                    <TooltipTrigger asChild>
                      <button className="flex flex-col items-center gap-2 p-4 rounded-lg border-2 border-gray-200 hover:border-yellow-400 hover:bg-yellow-50 transition-all">
                        <TrendingUp className="w-6 h-6 text-yellow-600" />
                        <span className="text-sm font-medium">Estadísticas</span>
                      </button>
                    </TooltipTrigger>
                    <TooltipContent><p className="text-xs">Ver reportes detallados</p></TooltipContent>
                  </Tooltip>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Próximos tours */}
          {widgetsVisibles.proximosTours && (
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div className="flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-emerald-600" />
                  <CardTitle className="text-lg">Próximos Tours</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {tours.map(tour => (
                    <div key={tour.id} className="p-4 rounded-lg border hover:border-emerald-300 hover:bg-emerald-50 transition-all">
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex-1">
                          <h4 className="font-semibold text-gray-800 mb-1">{tour.nombre}</h4>
                          <div className="flex flex-wrap gap-3 text-sm text-gray-600">
                            <span className="flex items-center gap-1">
                              <Calendar className="w-4 h-4" />
                              {new Date(tour.fecha).toLocaleDateString('es-ES', { day: 'numeric', month: 'long' })}
                            </span>
                            <span className="flex items-center gap-1">
                              <Users className="w-4 h-4" />
                              {tour.participantes}/{tour.maxParticipantes}
                            </span>
                            <span className="flex items-center gap-1">
                              <DollarSign className="w-4 h-4" />
                              ${tour.precio}/persona
                            </span>
                          </div>
                        </div>
                        <div className="flex flex-col items-end gap-2">
                          <Badge className={
                            tour.estado === 'confirmada' ? 'bg-green-100 text-green-800' :
                            tour.estado === 'pendiente' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-gray-100 text-gray-800'
                          }>
                            {tour.estado === 'confirmada' ? <CheckCircle className="w-3 h-3 mr-1" /> :
                             tour.estado === 'pendiente' ? <Clock className="w-3 h-3 mr-1" /> :
                             null}
                            {tour.estado}
                          </Badge>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button size="sm" variant="outline">
                                <Eye className="w-4 h-4 mr-1" />
                                Ver detalles
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent><p className="text-xs">Ver información completa del tour</p></TooltipContent>
                          </Tooltip>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </TooltipProvider>
  );
}

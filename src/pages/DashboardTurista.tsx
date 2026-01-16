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
  Heart, 
  Star, 
  Search, 
  Bell, 
  HelpCircle, 
  Settings, 
  Compass, 
  CheckCircle, 
  Clock,
  Users,
  TrendingUp,
  Zap,
  ChevronUp,
  Eye,
  BookOpen,
  History
} from "lucide-react";

interface Reserva {
  id: string;
  nombreTour: string;
  guia: string;
  fecha: string;
  estado: 'confirmada' | 'pendiente' | 'completada';
  participantes: number;
  precio: number;
  localidad: string;
}

interface Notificacion {
  id: number;
  tipo: 'confirmacion' | 'recordatorio' | 'oferta' | 'cancelacion';
  mensaje: string;
  tiempo: string;
  leido: boolean;
}

export default function DashboardTurista() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [mostrarNotificaciones, setMostrarNotificaciones] = useState(false);
  const [widgetsVisibles, setWidgetsVisibles] = useState({
    estadisticas: true,
    misReservas: true,
    accesosRapidos: true,
  });

  const [reservas, setReservas] = useState<Reserva[]>([
    { id: '1', nombreTour: 'Ruta del Café Orgánico', guia: 'Juan Pérez', fecha: '2024-01-20', estado: 'confirmada', participantes: 2, precio: 90, localidad: 'Montecristi' },
    { id: '2', nombreTour: 'Caminata Ecológica', guia: 'María García', fecha: '2024-01-25', estado: 'pendiente', participantes: 3, precio: 150, localidad: 'Mindo' },
    { id: '3', nombreTour: 'Tour Cultural', guia: 'Carlos López', fecha: '2024-01-15', estado: 'completada', participantes: 2, precio: 70, localidad: 'Otavalo' },
  ]);

  const [notificaciones, setNotificaciones] = useState<Notificacion[]>([
    { id: 1, tipo: 'confirmacion', mensaje: 'Tu reserva para "Ruta del Café" ha sido confirmada', tiempo: 'Hace 30 min', leido: false },
    { id: 2, tipo: 'recordatorio', mensaje: 'Tu tour "Caminata Ecológica" es en 5 días', tiempo: 'Hace 2 horas', leido: false },
    { id: 3, tipo: 'oferta', mensaje: '25% de descuento en tours de aventura este mes', tiempo: 'Hace 1 día', leido: true },
  ]);

  const [favoritos] = useState(['Montecristi', 'Mindo', 'Otavalo', 'Baños']);

  useEffect(() => {
    setTimeout(() => setIsLoading(false), 1000);
  }, []);

  // Atajos de teclado
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 's') {
        e.preventDefault();
        alert('Buscar tours');
      }
      if ((e.ctrlKey || e.metaKey) && e.key === 'b') {
        e.preventDefault();
        alert('Ver mis reservas');
      }
      if ((e.ctrlKey || e.metaKey) && e.key === 'f') {
        e.preventDefault();
        alert('Ver favoritos');
      }
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        setMostrarNotificaciones(!mostrarNotificaciones);
      }
      if (e.key === '?') {
        alert('Atajos de teclado:\\n\\nCtrl/Cmd + S: Buscar tours\\nCtrl/Cmd + B: Mis reservas\\nCtrl/Cmd + F: Favoritos\\nCtrl/Cmd + K: Notificaciones\\n?: Ver ayuda');
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
  const reservasActivas = reservas.filter(r => r.estado !== 'completada').length;
  const toursCompletados = reservas.filter(r => r.estado === 'completada').length;
  const totalGastado = reservas.reduce((acc, r) => acc + r.precio, 0);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <TooltipProvider>
      <div className="flex flex-col min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 p-4 sm:p-6">
        <div className="w-full max-w-7xl mx-auto">
          {/* Header */}
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-2">
                  Dashboard del Turista
                </h1>
                <p className="text-gray-600 flex items-center gap-2">
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                    👤 {user?.nombre}
                  </span>
                  <span className="text-sm">{reservasActivas} reservas activas</span>
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
                      onClick={() => alert('Atajos de teclado:\\n\\nCtrl/Cmd + S: Buscar tours\\nCtrl/Cmd + B: Mis reservas\\nCtrl/Cmd + F: Favoritos\\nCtrl/Cmd + K: Notificaciones\\n?: Ver ayuda')}
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
                    <Button className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700">
                      <Search className="w-5 h-5" />
                      Buscar Tours
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p className="text-xs">Explorar tours disponibles</p>
                    <p className="text-xs text-gray-400">Ctrl/Cmd + S</p>
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
                    className="text-xs text-blue-600 hover:text-blue-700"
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
                        <Bell className={`w-4 h-4 mt-0.5 ${notif.leido ? 'text-gray-400' : 'text-blue-600'}`} />
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

          {/* Widgets estadísticas */}
          {widgetsVisibles.estadisticas && (
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
              <Tooltip>
                <TooltipTrigger asChild>
                  <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                      <CardTitle className="text-sm font-medium text-gray-600">Reservas Activas</CardTitle>
                      <Calendar className="w-5 h-5 text-blue-600" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-3xl font-bold">{reservasActivas}</div>
                      <p className="text-xs text-gray-500 mt-1">Próximos tours</p>
                    </CardContent>
                  </Card>
                </TooltipTrigger>
                <TooltipContent>
                  <p className="text-xs">Tours confirmados y pendientes</p>
                </TooltipContent>
              </Tooltip>

              <Tooltip>
                <TooltipTrigger asChild>
                  <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                      <CardTitle className="text-sm font-medium text-gray-600">Tours Completados</CardTitle>
                      <CheckCircle className="w-5 h-5 text-green-600" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-3xl font-bold">{toursCompletados}</div>
                      <p className="text-xs text-gray-500 mt-1">Experiencias vividas</p>
                    </CardContent>
                  </Card>
                </TooltipTrigger>
                <TooltipContent>
                  <p className="text-xs">Tours que ya realizaste</p>
                </TooltipContent>
              </Tooltip>

              <Tooltip>
                <TooltipTrigger asChild>
                  <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                      <CardTitle className="text-sm font-medium text-gray-600">Destinos Favoritos</CardTitle>
                      <Heart className="w-5 h-5 text-red-600" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-3xl font-bold">{favoritos.length}</div>
                      <p className="text-xs text-gray-500 mt-1">Lugares guardados</p>
                    </CardContent>
                  </Card>
                </TooltipTrigger>
                <TooltipContent>
                  <p className="text-xs">Tus localidades favoritas</p>
                </TooltipContent>
              </Tooltip>

              <Tooltip>
                <TooltipTrigger asChild>
                  <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                      <CardTitle className="text-sm font-medium text-gray-600">Total Invertido</CardTitle>
                      <TrendingUp className="w-5 h-5 text-purple-600" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-3xl font-bold">${totalGastado}</div>
                      <p className="text-xs text-gray-500 mt-1">En todas tus experiencias</p>
                    </CardContent>
                  </Card>
                </TooltipTrigger>
                <TooltipContent>
                  <p className="text-xs">Total gastado en tours</p>
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
                      <button className="flex flex-col items-center gap-2 p-4 rounded-lg border-2 border-dashed border-blue-300 hover:border-blue-500 hover:bg-blue-50 transition-all">
                        <Search className="w-6 h-6 text-blue-600" />
                        <span className="text-sm font-medium">Buscar Tours</span>
                      </button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="text-xs">Explorar tours disponibles</p>
                      <p className="text-xs text-gray-400">Ctrl/Cmd + S</p>
                    </TooltipContent>
                  </Tooltip>

                  <Tooltip>
                    <TooltipTrigger asChild>
                      <button className="flex flex-col items-center gap-2 p-4 rounded-lg border-2 border-gray-200 hover:border-green-400 hover:bg-green-50 transition-all">
                        <BookOpen className="w-6 h-6 text-green-600" />
                        <span className="text-sm font-medium">Mis Reservas</span>
                      </button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="text-xs">Ver todas tus reservas</p>
                      <p className="text-xs text-gray-400">Ctrl/Cmd + B</p>
                    </TooltipContent>
                  </Tooltip>

                  <Tooltip>
                    <TooltipTrigger asChild>
                      <button className="flex flex-col items-center gap-2 p-4 rounded-lg border-2 border-gray-200 hover:border-red-400 hover:bg-red-50 transition-all">
                        <Heart className="w-6 h-6 text-red-600" />
                        <span className="text-sm font-medium">Favoritos</span>
                      </button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="text-xs">Ver destinos favoritos</p>
                      <p className="text-xs text-gray-400">Ctrl/Cmd + F</p>
                    </TooltipContent>
                  </Tooltip>

                  <Tooltip>
                    <TooltipTrigger asChild>
                      <button className="flex flex-col items-center gap-2 p-4 rounded-lg border-2 border-gray-200 hover:border-orange-400 hover:bg-orange-50 transition-all">
                        <History className="w-6 h-6 text-orange-600" />
                        <span className="text-sm font-medium">Historial</span>
                      </button>
                    </TooltipTrigger>
                    <TooltipContent><p className="text-xs">Ver tours completados</p></TooltipContent>
                  </Tooltip>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Mis Reservas */}
          {widgetsVisibles.misReservas && (
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div className="flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-blue-600" />
                  <CardTitle className="text-lg">Mis Reservas</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {reservas.filter(r => r.estado !== 'completada').map(reserva => (
                    <div key={reserva.id} className="p-4 rounded-lg border hover:border-blue-300 hover:bg-blue-50 transition-all">
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex-1">
                          <h4 className="font-semibold text-gray-800 mb-1">{reserva.nombreTour}</h4>
                          <div className="flex flex-wrap gap-3 text-sm text-gray-600">
                            <span className="flex items-center gap-1">
                              <MapPin className="w-4 h-4" />
                              {reserva.localidad}
                            </span>
                            <span className="flex items-center gap-1">
                              <Calendar className="w-4 h-4" />
                              {new Date(reserva.fecha).toLocaleDateString('es-ES', { day: 'numeric', month: 'long' })}
                            </span>
                            <span className="flex items-center gap-1">
                              <Users className="w-4 h-4" />
                              {reserva.participantes} {reserva.participantes === 1 ? 'persona' : 'personas'}
                            </span>
                            <span className="flex items-center gap-1">
                              <Compass className="w-4 h-4" />
                              Guía: {reserva.guia}
                            </span>
                          </div>
                        </div>
                        <div className="flex flex-col items-end gap-2">
                          <Badge className={
                            reserva.estado === 'confirmada' ? 'bg-green-100 text-green-800' :
                            reserva.estado === 'pendiente' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-gray-100 text-gray-800'
                          }>
                            {reserva.estado === 'confirmada' ? <CheckCircle className="w-3 h-3 mr-1" /> :
                             reserva.estado === 'pendiente' ? <Clock className="w-3 h-3 mr-1" /> :
                             null}
                            {reserva.estado}
                          </Badge>
                          <p className="text-lg font-bold text-gray-800">${reserva.precio}</p>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button size="sm" variant="outline">
                                <Eye className="w-4 h-4 mr-1" />
                                Ver detalles
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent><p className="text-xs">Ver información completa de la reserva</p></TooltipContent>
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
/**
 * Sistema de Ayuda Contextual Global
 * ISO 9241-11: Aprendibilidad y Eficiencia
 * ISO/IEC 25010: Aprendibilidad, Operabilidad
 * 
 * Proporciona ayuda contextual según la página/componente actual
 */

import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { HelpCircle, Keyboard, Info, BookOpen, Video } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface HelpContent {
  title: string;
  description: string;
  keyboardShortcuts?: Array<{ keys: string; description: string }>;
  tips?: string[];
  videoUrl?: string;
  docsUrl?: string;
}

const helpContentByPage: Record<string, HelpContent> = {
  "/": {
    title: "Página de Inicio",
    description: "Descubre rutas turísticas comunitarias sostenibles en Bolivia. Explora comunidades locales, conoce guías expertos y planifica tu próxima aventura.",
    tips: [
      "Usa la barra de búsqueda para encontrar rutas específicas",
      "Filtra por comunidad, dificultad o duración",
      "Guarda tus rutas favoritas para acceso rápido"
    ],
    keyboardShortcuts: [
      { keys: "Ctrl+K", description: "Búsqueda rápida" },
      { keys: "Ctrl+B", description: "Abrir/cerrar menú" }
    ]
  },
  "/rutas": {
    title: "Rutas Turísticas",
    description: "Explora nuestro catálogo de rutas comunitarias. Cada ruta ha sido verificada por comunidades locales.",
    tips: [
      "Haz clic en una ruta para ver detalles completos",
      "Usa los filtros para encontrar la ruta perfecta",
      "Verifica la disponibilidad antes de reservar"
    ],
    keyboardShortcuts: [
      { keys: "↑↓", description: "Navegar entre rutas" },
      { keys: "Enter", description: "Abrir ruta seleccionada" },
      { keys: "Ctrl+F", description: "Buscar en rutas" }
    ]
  },
  "/guias": {
    title: "Guías Locales",
    description: "Conoce a nuestros guías certificados. Todos son miembros activos de sus comunidades.",
    tips: [
      "Lee las reseñas de otros viajeros",
      "Verifica las certificaciones del guía",
      "Contacta directamente para consultas"
    ],
    keyboardShortcuts: [
      { keys: "Ctrl+G", description: "Buscar guía" },
      { keys: "Tab", description: "Navegar entre perfiles" }
    ]
  },
  "/comunidades": {
    title: "Comunidades",
    description: "Descubre las comunidades que forman parte de EcoRutas. Aprende sobre su cultura, tradiciones y proyectos de turismo sostenible.",
    tips: [
      "Explora los proyectos de cada comunidad",
      "Conoce los beneficios directos del turismo",
      "Contacta para visitas especiales"
    ]
  },
  "/visitantes": {
    title: "Gestión de Visitantes",
    description: "Sistema de administración de visitantes con búsqueda, filtrado y exportación de datos.",
    tips: [
      "Usa la búsqueda para encontrar visitantes rápidamente",
      "Selecciona múltiples filas con Ctrl+Clic",
      "Exporta datos a CSV o JSON según necesites",
      "Los cambios se guardan automáticamente"
    ],
    keyboardShortcuts: [
      { keys: "Ctrl+A", description: "Seleccionar todos" },
      { keys: "Ctrl+E", description: "Exportar selección" },
      { keys: "Esc", description: "Limpiar selección" },
      { keys: "Ctrl+F", description: "Buscar" }
    ]
  },
  "/dashboard/admin": {
    title: "Panel de Administración",
    description: "Centro de control del sistema. Administra usuarios, rutas, reservaciones y configuración general.",
    tips: [
      "Revisa las estadísticas diarias en el dashboard",
      "Usa los accesos rápidos para tareas comunes",
      "Configura notificaciones para eventos importantes"
    ],
    keyboardShortcuts: [
      { keys: "Ctrl+D", description: "Ver dashboard" },
      { keys: "Ctrl+U", description: "Gestión de usuarios" }
    ]
  },
  "/dashboard/guia": {
    title: "Dashboard de Guía",
    description: "Gestiona tus tours, reservaciones y perfil como guía certificado.",
    tips: [
      "Actualiza tu disponibilidad regularmente",
      "Responde rápido a las consultas de turistas",
      "Mantén tu perfil completo y actualizado"
    ]
  },
  "/dashboard/turista": {
    title: "Dashboard de Turista",
    description: "Administra tus reservaciones, rutas favoritas y perfil personal.",
    tips: [
      "Revisa los detalles de tus próximas reservaciones",
      "Guarda rutas que te interesen para después",
      "Deja reseñas después de tus experiencias"
    ]
  },
  "/login": {
    title: "Inicio de Sesión",
    description: "Accede a tu cuenta EcoRutas de forma segura.",
    tips: [
      "Usa contraseñas fuertes y únicas",
      "Activa 'Recordarme' solo en dispositivos personales",
      "Reporta cualquier actividad sospechosa"
    ],
    keyboardShortcuts: [
      { keys: "Enter", description: "Enviar formulario" },
      { keys: "Tab", description: "Navegar entre campos" }
    ]
  },
  "/register": {
    title: "Registro de Usuario",
    description: "Crea tu cuenta para acceder a todas las funciones de EcoRutas.",
    tips: [
      "La barra de progreso muestra tu avance",
      "Los campos se validan en tiempo real",
      "Lee los términos y condiciones antes de aceptar"
    ],
    keyboardShortcuts: [
      { keys: "Tab", description: "Siguiente campo" },
      { keys: "Shift+Tab", description: "Campo anterior" }
    ]
  }
};

export const HelpButton = () => {
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const [helpContent, setHelpContent] = useState<HelpContent>(
    helpContentByPage["/"]
  );

  // Actualizar contenido según la página
  useEffect(() => {
    const content = helpContentByPage[location.pathname] || {
      title: "EcoRutas",
      description: "Sistema de turismo comunitario sostenible",
      tips: ["Usa F1 para ayuda contextual en cualquier momento"]
    };
    setHelpContent(content);
  }, [location.pathname]);

  // ISO 9241-11: Eficiencia - Atajo de teclado F1
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.key === "F1") {
        e.preventDefault();
        setIsOpen(true);
      }
    };

    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, []);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="gap-2"
          aria-label="Abrir ayuda contextual"
        >
          <HelpCircle className="h-4 w-4" />
          <span className="hidden sm:inline">Ayuda</span>
          <Badge variant="secondary" className="hidden md:inline text-xs">
            F1
          </Badge>
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <BookOpen className="h-5 w-5 text-primary" />
            {helpContent.title}
          </DialogTitle>
          <DialogDescription>{helpContent.description}</DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="tips" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="tips">
              <Info className="h-4 w-4 mr-2" />
              Consejos
            </TabsTrigger>
            <TabsTrigger value="shortcuts" disabled={!helpContent.keyboardShortcuts}>
              <Keyboard className="h-4 w-4 mr-2" />
              Atajos
            </TabsTrigger>
            <TabsTrigger value="resources" disabled={!helpContent.videoUrl && !helpContent.docsUrl}>
              <Video className="h-4 w-4 mr-2" />
              Recursos
            </TabsTrigger>
          </TabsList>

          {/* ISO 9241-11: Aprendibilidad - Consejos útiles */}
          <TabsContent value="tips" className="space-y-4">
            {helpContent.tips && helpContent.tips.length > 0 ? (
              <ul className="space-y-2">
                {helpContent.tips.map((tip, index) => (
                  <li key={index} className="flex gap-2">
                    <Badge variant="outline" className="h-5 w-5 shrink-0 rounded-full p-0 flex items-center justify-center">
                      {index + 1}
                    </Badge>
                    <span className="text-sm text-muted-foreground">{tip}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-muted-foreground">
                No hay consejos específicos para esta página.
              </p>
            )}
          </TabsContent>

          {/* ISO 9241-11: Eficiencia - Atajos de teclado */}
          <TabsContent value="shortcuts" className="space-y-4">
            {helpContent.keyboardShortcuts && helpContent.keyboardShortcuts.length > 0 ? (
              <div className="space-y-3">
                {helpContent.keyboardShortcuts.map((shortcut, index) => (
                  <div key={index} className="flex items-center justify-between p-3 border rounded-md">
                    <span className="text-sm text-muted-foreground">
                      {shortcut.description}
                    </span>
                    <Badge variant="secondary" className="font-mono">
                      {shortcut.keys}
                    </Badge>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">
                No hay atajos de teclado definidos para esta página.
              </p>
            )}
          </TabsContent>

          <TabsContent value="resources" className="space-y-4">
            {(helpContent.videoUrl || helpContent.docsUrl) ? (
              <div className="space-y-3">
                {helpContent.videoUrl && (
                  <Button variant="outline" className="w-full justify-start" asChild>
                    <a href={helpContent.videoUrl} target="_blank" rel="noopener noreferrer">
                      <Video className="h-4 w-4 mr-2" />
                      Ver tutorial en video
                    </a>
                  </Button>
                )}
                {helpContent.docsUrl && (
                  <Button variant="outline" className="w-full justify-start" asChild>
                    <a href={helpContent.docsUrl} target="_blank" rel="noopener noreferrer">
                      <BookOpen className="h-4 w-4 mr-2" />
                      Leer documentación completa
                    </a>
                  </Button>
                )}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">
                No hay recursos adicionales para esta página.
              </p>
            )}
          </TabsContent>
        </Tabs>

        {/* ISO 9241-11: Aprendibilidad - Recordatorio de ayuda global */}
        <div className="mt-4 p-3 bg-muted rounded-md">
          <p className="text-xs text-muted-foreground flex items-center gap-2">
            <Info className="h-3 w-3" />
            Presiona <Badge variant="secondary" className="text-xs">F1</Badge> en cualquier momento para abrir esta ayuda
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default HelpButton;

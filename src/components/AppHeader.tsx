import { SidebarTrigger } from "@/components/ui/sidebar";
import { Leaf, HelpCircle, Search } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useLocation } from "react-router-dom";
import { useState } from "react";
import { Input } from "@/components/ui/input";

const AppHeader = () => {
  const location = useLocation();
  const [searchOpen, setSearchOpen] = useState(false);

  // ISO 9241-11: Adecuación reconocible - Mostrar dónde está el usuario
  const getPageTitle = () => {
    const path = location.pathname;
    const titles: Record<string, string> = {
      "/": "Inicio",
      "/rutas": "Rutas Turísticas",
      "/guias": "Guías Locales",
      "/comunidades": "Comunidades",
      "/nosotros": "Nosotros",
      "/visitantes": "Gestión de Visitantes",
      "/dashboard/admin": "Panel de Administración",
      "/dashboard/guia": "Dashboard Guía",
      "/dashboard/turista": "Dashboard Turista",
      "/perfil": "Mi Perfil",
    };
    return titles[path] || "EcoRutas";
  };

  return (
    <TooltipProvider>
      <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="flex h-16 items-center px-4 gap-4">
          {/* ISO 9241-11: Operabilidad - Control fácil del menú */}
          <Tooltip>
            <TooltipTrigger asChild>
              <SidebarTrigger 
                className="hover:bg-muted rounded-md transition-colors" 
                aria-label="Abrir menú lateral de navegación"
                data-speak="Botón para abrir el menú lateral"
              />
            </TooltipTrigger>
            <TooltipContent side="bottom">
              <p>Abrir/Cerrar menú de navegación</p>
              <p className="text-xs text-muted-foreground">Atajo: Ctrl+B</p>
            </TooltipContent>
          </Tooltip>
          
          {/* Logo y nombre */}
          <div className="flex items-center gap-2">
            <Leaf className="h-6 w-6 text-primary animate-in zoom-in duration-300" aria-hidden="true" />
            <Link 
              to="/" 
              className="font-bold text-xl text-foreground hover:text-primary transition-colors"
              aria-label="EcoRutas - Ir a página principal"
              data-speak="EcoRutas, ir a inicio"
            >
              EcoRutas
            </Link>
          </div>

          {/* ISO 9241-11: Adecuación reconocible - Breadcrumb simple */}
          <div className="hidden sm:flex items-center text-sm text-muted-foreground">
            <span className="mx-2">›</span>
            <span className="font-medium text-foreground">{getPageTitle()}</span>
          </div>

          <div className="ml-auto flex items-center gap-2">
            {/* ISO 9241-11: Eficiencia - Búsqueda rápida global */}
            {!searchOpen ? (
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setSearchOpen(true)}
                    className="hidden md:flex"
                    aria-label="Buscar en el sistema"
                  >
                    <Search className="h-5 w-5" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Buscar en todo el sistema</p>
                  <p className="text-xs text-muted-foreground">Atajo: Ctrl+K</p>
                </TooltipContent>
              </Tooltip>
            ) : (
              <div className="hidden md:flex items-center gap-2 animate-in slide-in-from-right duration-300">
                <Input
                  placeholder="Buscar..."
                  className="w-48"
                  autoFocus
                  onBlur={() => setSearchOpen(false)}
                  aria-label="Campo de búsqueda global"
                />
              </div>
            )}

            {/* ISO 9241-11: Aprendibilidad - Ayuda contextual */}
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  asChild
                  aria-label="Ver ayuda del sistema"
                >
                  <Link to="/ayuda">
                    <HelpCircle className="h-5 w-5" />
                  </Link>
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Ayuda y documentación</p>
                <p className="text-xs text-muted-foreground">Presiona F1 para ayuda contextual</p>
              </TooltipContent>
            </Tooltip>

            <span 
              className="hidden lg:block text-sm text-muted-foreground border-l pl-4 ml-2"
              aria-label="Turismo Comunitario Sostenible"
            >
              Turismo Comunitario Sostenible
            </span>
          </div>
        </div>
      </header>
    </TooltipProvider>
  );
};

export default AppHeader;

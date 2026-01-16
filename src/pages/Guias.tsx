import Footer from "@/components/Footer";
import { Users, Award, MapPin, Phone, Mail, Star, Info, Filter, X, HelpCircle, Languages } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { useState, useEffect } from "react";

const Guias = () => {
  const [filtrosActivos, setFiltrosActivos] = useState<any>({});
  const [mostrarFiltros, setMostrarFiltros] = useState(false);
  const [loading, setLoading] = useState(true);
  
  // Simular carga de datos
  useEffect(() => {
    setTimeout(() => setLoading(false), 1200);
  }, []);

  // Atajos de teclado
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.key === 'f' && (e.ctrlKey || e.metaKey)) {
        e.preventDefault();
        setMostrarFiltros(!mostrarFiltros);
      }
      if (e.key === '?') {
        alert('Atajos de teclado:\n\nCtrl/Cmd + F: Abrir filtros\nEsc: Cerrar panel de filtros\n?: Ver ayuda');
      }
      if (e.key === 'Escape' && mostrarFiltros) {
        setMostrarFiltros(false);
      }
    };
    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [mostrarFiltros]);

  const aplicarFiltro = (categoria: string, valor: string) => {
    setFiltrosActivos((prev: any) => ({
      ...prev,
      [categoria]: prev[categoria]?.includes(valor)
        ? prev[categoria].filter((v: string) => v !== valor)
        : [...(prev[categoria] || []), valor]
    }));
  };

  const limpiarFiltros = () => {
    setFiltrosActivos({});
  };

  const filtrosDisponibles = [
    { 
      label: "Especialidad", 
      icon: <Award className="w-4 h-4" />, 
      opciones: ["Ecoturismo", "Historia", "Aventura"]
    },
    { 
      label: "Idiomas", 
      icon: <Languages className="w-4 h-4" />, 
      opciones: ["Español", "Inglés", "Francés"]
    },
    { 
      label: "Experiencia", 
      icon: <Star className="w-4 h-4" />, 
      opciones: ["5+ años", "10+ años"]
    }
  ];
  const guiasDestacados = [
    {
      nombre: "María González",
      especialidad: "Ecoturismo y Fauna Local",
      experiencia: "8 años",
      idiomas: ["Español", "Inglés"],
      rating: 4.9,
      imagen: "https://images.unsplash.com/photo-1607746882042-944635dfe10e?w=400&h=400&fit=crop",
      descripcion: "Experta en rutas ecológicas y observación de aves en la región costera."
    },
    {
      nombre: "Carlos Mendoza",
      especialidad: "Historia y Cultura",
      experiencia: "12 años",
      idiomas: ["Español", "Inglés", "Francés"],
      rating: 5.0,
      imagen: "https://images.unsplash.com/photo-1595152772835-219674b2a8a6?w=400&h=400&fit=crop",
      descripcion: "Historiador local especializado en patrimonio cultural de Manabí."
    },
    {
      nombre: "Ana Vera",
      especialidad: "Aventura y Deportes",
      experiencia: "5 años",
      idiomas: ["Español", "Inglés"],
      rating: 4.8,
      imagen: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=400&h=400&fit=crop",
      descripcion: "Guía de deportes acuáticos y aventuras extremas en la costa."
    }
  ];

  const SkeletonCard = () => (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden animate-pulse">
      <div className="w-full h-56 bg-gray-200"></div>
      <div className="p-6 space-y-4">
        <div className="h-6 bg-gray-200 rounded w-3/4"></div>
        <div className="h-4 bg-gray-200 rounded w-1/2"></div>
        <div className="h-16 bg-gray-200 rounded"></div>
        <div className="space-y-2">
          <div className="h-4 bg-gray-200 rounded"></div>
          <div className="h-4 bg-gray-200 rounded w-5/6"></div>
        </div>
        <div className="h-10 bg-gray-200 rounded"></div>
      </div>
    </div>
  );

  const servicios = [
    {
      icon: <MapPin className="w-6 h-6 text-emerald-600" />,
      titulo: "Tours Personalizados",
      descripcion: "Rutas adaptadas a tus intereses y necesidades"
    },
    {
      icon: <Users className="w-6 h-6 text-emerald-600" />,
      titulo: "Grupos Pequeños",
      descripcion: "Experiencias íntimas y personalizadas"
    },
    {
      icon: <Award className="w-6 h-6 text-emerald-600" />,
      titulo: "Certificados",
      descripcion: "Guías certificados por el Ministerio de Turismo"
    }
  ];

  return (
    <TooltipProvider>
      <div className="min-h-screen bg-gray-50 w-full">
        <div className="pt-12 pb-16 container mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header con Ayuda Contextual */}
          <div className="mb-12">
            <div className="flex items-center justify-between mb-4">
              <h1 className="text-4xl font-bold text-gray-900">Guías Locales Certificados</h1>
              <Tooltip>
                <TooltipTrigger asChild>
                  <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                    <HelpCircle className="w-6 h-6 text-emerald-600" />
                  </button>
                </TooltipTrigger>
                <TooltipContent side="left" className="max-w-xs">
                  <p className="font-semibold mb-2">Ayuda - Guías Certificados</p>
                  <p className="text-sm mb-2">Conecta con guías locales expertos certificados por el Ministerio de Turismo</p>
                  <div className="text-xs space-y-1 border-t pt-2 mt-2">
                    <p><kbd className="px-1 py-0.5 bg-gray-200 rounded">Ctrl/Cmd + F</kbd>: Abrir filtros</p>
                    <p><kbd className="px-1 py-0.5 bg-gray-200 rounded">Esc</kbd>: Cerrar filtros</p>
                    <p><kbd className="px-1 py-0.5 bg-gray-200 rounded">?</kbd>: Ver todos los atajos</p>
                  </div>
                </TooltipContent>
              </Tooltip>
            </div>
            <p className="text-lg text-gray-600 max-w-3xl">
              Conecta con guías comunitarios expertos que te mostrarán lo mejor de Manabí. 
              Todos nuestros guías están certificados y comprometidos con el turismo sostenible.
            </p>
            
            {/* Filtros Avanzados */}
            <div className="mt-6 flex gap-4 items-center">
              <Tooltip>
                <TooltipTrigger asChild>
                  <button 
                    onClick={() => setMostrarFiltros(!mostrarFiltros)}
                    className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
                  >
                    <Filter className="w-4 h-4" />
                    Filtros Avanzados
                  </button>
                </TooltipTrigger>
                <TooltipContent>
                  <p className="text-xs">Filtra guías por especialidad, idiomas y experiencia</p>
                </TooltipContent>
              </Tooltip>
              
              {Object.keys(filtrosActivos).length > 0 && (
                <button
                  onClick={limpiarFiltros}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
                >
                  <X className="w-4 h-4" />
                  Limpiar ({Object.values(filtrosActivos).flat().length})
                </button>
              )}
            </div>

            {/* Panel de Filtros */}
            {mostrarFiltros && (
              <div className="mt-4 p-6 bg-white rounded-xl border border-gray-200 shadow-lg animate-in slide-in-from-top-2">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold text-lg">Filtrar Guías</h3>
                  <button onClick={() => setMostrarFiltros(false)}>
                    <X className="w-5 h-5 text-gray-500 hover:text-gray-700" />
                  </button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {filtrosDisponibles.map((filtro, idx) => (
                    <div key={idx} className="space-y-2">
                      <div className="flex items-center gap-2">
                        {filtro.icon}
                        <label className="font-medium text-sm">{filtro.label}</label>
                        <Tooltip>
                          <TooltipTrigger>
                            <Info className="w-3 h-3 text-gray-400" />
                          </TooltipTrigger>
                          <TooltipContent>
                            <p className="text-xs">Filtra por {filtro.label.toLowerCase()}</p>
                          </TooltipContent>
                        </Tooltip>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {filtro.opciones.map((opcion, i) => (
                          <button
                            key={i}
                            onClick={() => aplicarFiltro(filtro.label, opcion)}
                            className={`px-3 py-1.5 rounded-full text-sm transition-all ${
                              filtrosActivos[filtro.label]?.includes(opcion)
                                ? 'bg-emerald-600 text-white shadow-sm'
                                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                            }`}
                          >
                            {opcion}
                          </button>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

        {/* Servicios */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
          {servicios.map((servicio, index) => (
            <div key={index} className="bg-white p-6 rounded-xl border border-gray-200 shadow hover:shadow-lg transition-shadow text-center">
              <div className="mb-4 flex justify-center">{servicio.icon}</div>
              <h3 className="text-xl font-semibold mb-2">{servicio.titulo}</h3>
              <p className="text-gray-600">{servicio.descripcion}</p>
            </div>
          ))}
        </div>

        {/* Guías Destacados con Skeleton Loaders */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold mb-8 text-center">Guías Destacados</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {loading ? (
              Array(3).fill(0).map((_, i) => <SkeletonCard key={i} />)
            ) : (
              guiasDestacados.map((guia, index) => (
              <div key={index} className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow hover:shadow-lg transition-shadow">
                <img src={guia.imagen} alt={guia.nombre} className="w-full h-56 object-cover" />
                <div className="p-6">
                  <h3 className="text-xl font-semibold mb-2">{guia.nombre}</h3>
                  <div className="flex items-center gap-2 mb-3">
                    <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    <span className="font-medium">{guia.rating}</span>
                  </div>
                  <p className="text-sm text-emerald-600 font-medium mb-2">{guia.especialidad}</p>
                  <p className="text-gray-600 text-sm mb-4">{guia.descripcion}</p>
                  <div className="space-y-2 text-sm text-gray-600 mb-4">
                    <div className="flex items-center gap-2">
                      <Award className="w-4 h-4" />
                      <span>{guia.experiencia} de experiencia</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Users className="w-4 h-4" />
                      <span>{guia.idiomas.join(", ")}</span>
                    </div>
                  </div>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <button className="w-full bg-emerald-600 text-white py-2 rounded-lg font-semibold hover:bg-emerald-700 transition-colors">
                        Ver Perfil
                      </button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="text-xs">Ver perfil completo y contactar al guía</p>
                    </TooltipContent>
                  </Tooltip>
                </div>
              </div>
            )))}
          </div>
        </div>

        {/* Cómo Funciona */}
        <div className="mb-16 text-center">
          <h2 className="text-3xl font-bold mb-8">¿Cómo Funciona?</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {["Explora Perfiles", "Contacta Directamente", "Personaliza tu Tour", "Disfruta"].map((step, idx) => (
              <div key={idx} className="text-center">
                <div className="w-12 h-12 bg-emerald-600 text-white rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-4">
                  {idx + 1}
                </div>
                <h3 className="font-semibold mb-2">{step}</h3>
                <p className="text-sm text-gray-600">
                  {idx === 0 && "Revisa los guías y sus especialidades"}
                  {idx === 1 && "Comunícate con el guía de tu elección"}
                  {idx === 2 && "Diseña la experiencia perfecta"}
                  {idx === 3 && "Vive una experiencia auténtica"}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="bg-emerald-600 text-white rounded-xl p-8 text-center">
          <h2 className="text-2xl font-bold mb-4">¿Eres Guía Local?</h2>
          <p className="mb-6 max-w-2xl mx-auto">
            Únete a nuestra red de guías certificados y conecta con viajeros que buscan experiencias auténticas
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-white text-emerald-600 px-6 py-3 rounded-md hover:opacity-90 transition-opacity font-medium">
              Registrarme como Guía
            </button>
            <button className="border-2 border-white px-6 py-3 rounded-md hover:bg-white hover:text-emerald-600 transition-colors font-medium">
              Más Información
            </button>
          </div>
        </div>
      </div>
      <Footer />
    </div>
    </TooltipProvider>
  );
};

export default Guias;

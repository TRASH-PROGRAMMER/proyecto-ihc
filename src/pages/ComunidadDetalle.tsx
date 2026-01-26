import { useNavigate, useLocation } from "react-router-dom";
import Footer from "@/components/Footer";
import { ArrowLeft, MapPin, Users, Mail, Calendar, Star } from "lucide-react";
import { Button } from "@/components/ui/button";

const ComunidadDetalle = () => {
  const navigate = useNavigate();
  const { state } = useLocation();
  const comunidad = state?.comunidad;

  // Si no hay datos (acceso directo por URL o refresh), redirigir al listado
  if (!comunidad) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-8">
        <p className="text-gray-600 mb-4 text-center">
          Para ver los detalles de la comunidad, navega desde el listado de comunidades.
        </p>
        <Button onClick={() => navigate("/comunidades")} className="bg-emerald-600 hover:bg-emerald-700">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Volver a Comunidades
        </Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 w-full">
      <div className="pt-12 pb-16 container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
        {/* Botón volver */}
        <button
          onClick={() => navigate("/comunidades")}
          className="flex items-center gap-2 text-emerald-600 hover:text-emerald-700 font-medium mb-6 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Volver a Comunidades
        </button>

        {/* Imagen principal */}
        <div className="rounded-xl overflow-hidden shadow-lg mb-8">
          <img
            src={comunidad.imagen}
            alt={comunidad.nombre}
            className="w-full h-64 sm:h-80 object-cover"
          />
        </div>

        {/* Título y datos básicos */}
        <div className="mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">{comunidad.nombre}</h1>
          <div className="flex flex-wrap gap-4 text-gray-600 mb-4">
            <span className="flex items-center gap-2">
              <MapPin className="w-5 h-5 text-emerald-600" />
              {comunidad.ubicacion}
            </span>
            <span className="flex items-center gap-2">
              <Users className="w-5 h-5 text-emerald-600" />
              {comunidad.habitantes}
            </span>
          </div>
          <span className="inline-flex items-center gap-1 bg-emerald-100 text-emerald-700 text-sm font-medium px-4 py-2 rounded-full">
            <Star className="w-4 h-4" />
            {comunidad.destacado}
          </span>
        </div>

        {/* Descripción */}
        <section className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-3">Sobre la comunidad</h2>
          <p className="text-gray-600 leading-relaxed">{comunidad.descripcion}</p>
        </section>

        {/* Actividades */}
        <section className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-3">Actividades que ofrece</h2>
          <div className="flex flex-wrap gap-2">
            {comunidad.actividades.map((actividad: string, idx: number) => (
              <span
                key={idx}
                className="bg-gray-100 text-gray-800 text-sm px-3 py-1.5 rounded-lg"
              >
                {actividad}
              </span>
            ))}
          </div>
        </section>

        {/* Opciones de contacto */}
        <section className="mb-10 p-6 bg-white rounded-xl border border-gray-200 shadow-sm">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Opciones de contacto</h2>
          <p className="text-gray-600 mb-6">
            Para coordinar tu visita, conocer disponibilidad o realizar consultas, puedes:
          </p>
          <div className="space-y-4">
            <div className="flex items-start gap-3 text-gray-700">
              <Mail className="w-5 h-5 text-emerald-600 mt-0.5 shrink-0" />
              <div>
                <p className="font-medium">Formulario de reserva</p>
                <p className="text-sm">Indica esta comunidad al completar tu reserva para que te contactemos.</p>
              </div>
            </div>
            <div className="flex items-start gap-3 text-gray-700">
              <Calendar className="w-5 h-5 text-emerald-600 mt-0.5 shrink-0" />
              <div>
                <p className="font-medium">Coordinar con la comunidad</p>
                <p className="text-sm">Los coordinadores comunitarios te atenderán para planificar fechas y actividades.</p>
              </div>
            </div>
          </div>
          <div className="mt-6 flex flex-col sm:flex-row gap-4">
            <Button
              onClick={() => navigate("/reservar")}
              className="bg-emerald-600 hover:bg-emerald-700 flex-1"
            >
              <Calendar className="w-4 h-4 mr-2" />
              Reservar experiencia
            </Button>
            <Button
              onClick={() => navigate("/comunidades")}
              variant="outline"
              className="flex-1"
            >
              Ver otras comunidades
            </Button>
          </div>
        </section>
      </div>
      <Footer />
    </div>
  );
};

export default ComunidadDetalle;

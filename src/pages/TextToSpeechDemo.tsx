import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAccessibility } from '@/context/AccessibilityContext';
import { Volume2, VolumeX, Info, CheckCircle } from 'lucide-react';

/**
 * Componente de demostración de Text-to-Speech
 * Muestra ejemplos de cómo la lectura en voz alta funciona con diferentes elementos
 */
const TextToSpeechDemo = () => {
  const { speechEnabled, toggleSpeech } = useAccessibility();

  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl">
      <div className="mb-8 text-center">
        <h1 className="text-4xl font-bold mb-4" data-speak="Demostración de lectura en voz alta">
          Demostración: Lectura en Voz Alta
        </h1>
        <p className="text-muted-foreground text-lg" data-speak="Pasa el cursor sobre cualquier elemento para escuchar su descripción">
          Pasa el cursor sobre cualquier elemento para escuchar su descripción
        </p>
      </div>

      {/* Control principal */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle data-speak="Control de lectura en voz alta">
            Control de Lectura
          </CardTitle>
          <CardDescription data-speak="Activa o desactiva la lectura automática">
            Activa o desactiva la lectura automática
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button
            onClick={toggleSpeech}
            variant={speechEnabled ? 'default' : 'outline'}
            size="lg"
            className="w-full"
            aria-label={speechEnabled ? 'Desactivar lectura en voz alta' : 'Activar lectura en voz alta'}
            data-speak={speechEnabled ? 'Desactivar lectura automática' : 'Activar lectura automática'}
          >
            {speechEnabled ? (
              <>
                <Volume2 className="mr-2" />
                Lectura Activada (Alt+V)
              </>
            ) : (
              <>
                <VolumeX className="mr-2" />
                Lectura Desactivada (Alt+V)
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {/* Ejemplos de elementos */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Botones */}
        <Card>
          <CardHeader>
            <CardTitle data-speak="Ejemplos de botones">Botones</CardTitle>
            <CardDescription data-speak="Diferentes tipos de botones con descripciones">
              Pasa el cursor sobre cada botón
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button 
              className="w-full" 
              aria-label="Guardar cambios"
              data-speak="Botón para guardar todos los cambios realizados"
            >
              Guardar
            </Button>
            <Button 
              variant="secondary" 
              className="w-full"
              aria-label="Cancelar operación"
              data-speak="Botón para cancelar la operación actual"
            >
              Cancelar
            </Button>
            <Button 
              variant="destructive" 
              className="w-full"
              aria-label="Eliminar elemento"
              data-speak="Botón para eliminar permanentemente. Esta acción no se puede deshacer"
            >
              Eliminar
            </Button>
          </CardContent>
        </Card>

        {/* Enlaces */}
        <Card>
          <CardHeader>
            <CardTitle data-speak="Ejemplos de enlaces">Enlaces</CardTitle>
            <CardDescription data-speak="Enlaces con descripciones informativas">
              Enlaces con descripciones
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <a 
              href="#" 
              className="block text-primary hover:underline"
              aria-label="Leer más sobre EcoRutas"
              data-speak="Enlace para leer más información sobre el proyecto EcoRutas"
            >
              Más información sobre EcoRutas
            </a>
            <a 
              href="#" 
              className="block text-primary hover:underline"
              aria-label="Ver términos y condiciones"
              data-speak="Enlace para revisar nuestros términos y condiciones de servicio"
            >
              Términos y condiciones
            </a>
            <a 
              href="#" 
              className="block text-primary hover:underline"
              aria-label="Contactar soporte"
              data-speak="Enlace para contactar con nuestro equipo de soporte técnico"
            >
              Contactar soporte
            </a>
          </CardContent>
        </Card>

        {/* Formulario */}
        <Card>
          <CardHeader>
            <CardTitle data-speak="Ejemplo de formulario">Formulario</CardTitle>
            <CardDescription data-speak="Campos de formulario accesibles">
              Campos con etiquetas claras
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label 
                htmlFor="nombre"
                data-speak="Campo de texto para ingresar tu nombre completo"
              >
                Nombre completo
              </Label>
              <Input 
                id="nombre" 
                placeholder="Juan Pérez"
                aria-label="Nombre completo"
                aria-description="Ingresa tu nombre y apellido"
              />
            </div>
            <div>
              <Label 
                htmlFor="email"
                data-speak="Campo para ingresar tu dirección de correo electrónico"
              >
                Correo electrónico
              </Label>
              <Input 
                id="email" 
                type="email"
                placeholder="ejemplo@correo.com"
                aria-label="Correo electrónico"
                aria-description="Ingresa un correo válido para recibir notificaciones"
              />
            </div>
          </CardContent>
        </Card>

        {/* Íconos */}
        <Card>
          <CardHeader>
            <CardTitle data-speak="Ejemplos de íconos">Íconos</CardTitle>
            <CardDescription data-speak="Íconos con descripciones claras">
              Íconos informativos
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-3">
              <div 
                className="p-2 rounded-full bg-primary/10"
                aria-label="Información"
                data-speak="Ícono de información. Haz clic para ver más detalles"
              >
                <Info className="h-5 w-5 text-primary" />
              </div>
              <span>Ícono de información</span>
            </div>
            <div className="flex items-center gap-3">
              <div 
                className="p-2 rounded-full bg-green-100 dark:bg-green-900"
                aria-label="Completado"
                data-speak="Ícono de verificación. Indica que la tarea está completada"
              >
                <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400" />
              </div>
              <span>Tarea completada</span>
            </div>
            <div className="flex items-center gap-3">
              <div 
                className="p-2 rounded-full bg-primary/10"
                aria-label="Audio"
                data-speak="Ícono de volumen. Controla las opciones de audio"
              >
                <Volume2 className="h-5 w-5 text-primary" />
              </div>
              <span>Control de audio</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Instrucciones */}
      <Card className="mt-8">
        <CardHeader>
          <CardTitle data-speak="Instrucciones de uso">
            💡 Instrucciones
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3 text-sm">
            <p data-speak="Primera instrucción: Activa la lectura en voz alta usando el botón arriba o presionando Alt más V">
              <strong>1.</strong> Activa la lectura usando el botón arriba o presionando <kbd className="px-2 py-1 bg-muted rounded">Alt+V</kbd>
            </p>
            <p data-speak="Segunda instrucción: Pasa el cursor sobre cualquier elemento para escuchar su descripción">
              <strong>2.</strong> Pasa el cursor sobre cualquier elemento para escucharlo
            </p>
            <p data-speak="Tercera instrucción: También puedes navegar con la tecla Tab para activar la lectura">
              <strong>3.</strong> Navega con <kbd className="px-2 py-1 bg-muted rounded">Tab</kbd> para usar el teclado
            </p>
            <p data-speak="Cuarta instrucción: La lectura se detiene automáticamente al mover el cursor a otro elemento">
              <strong>4.</strong> La lectura se detiene automáticamente al cambiar de elemento
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default TextToSpeechDemo;

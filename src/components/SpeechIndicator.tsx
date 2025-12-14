import { useAccessibility } from '@/context/AccessibilityContext';
import { Volume2, VolumeX } from 'lucide-react';
import { useEffect, useState } from 'react';

/**
 * Componente que muestra un indicador visual cuando la lectura en voz alta está activa
 */
const SpeechIndicator = () => {
  const { speechEnabled, isSpeaking } = useAccessibility();
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (speechEnabled) {
      // Mostrar el indicador cuando se activa por primera vez
      setShow(true);
      const timer = setTimeout(() => setShow(false), 3000);
      return () => clearTimeout(timer);
    }
  }, [speechEnabled]);

  useEffect(() => {
    if (isSpeaking) {
      setShow(true);
    } else {
      // Ocultar después de que termine de hablar
      const timer = setTimeout(() => setShow(false), 2000);
      return () => clearTimeout(timer);
    }
  }, [isSpeaking]);

  if (!speechEnabled && !show) return null;

  return (
    <div
      className={`fixed top-20 right-4 z-40 transition-all duration-300 ${
        show ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-2 pointer-events-none'
      }`}
      role="status"
      aria-live="polite"
      aria-atomic="true"
    >
      <div className="bg-primary text-primary-foreground px-4 py-2 rounded-lg shadow-lg flex items-center gap-2">
        {speechEnabled ? (
          <>
            <Volume2
              className={`h-4 w-4 ${isSpeaking ? 'animate-pulse' : ''}`}
              aria-hidden="true"
            />
            <span className="text-sm font-medium">
              {isSpeaking ? 'Leyendo...' : 'Lectura activada'}
            </span>
          </>
        ) : (
          <>
            <VolumeX className="h-4 w-4" aria-hidden="true" />
            <span className="text-sm font-medium">Lectura desactivada</span>
          </>
        )}
        {isSpeaking && (
          <div className="flex gap-0.5 ml-1">
            <div className="w-1 h-3 bg-white/70 rounded-full animate-pulse" style={{ animationDelay: '0ms' }} />
            <div className="w-1 h-3 bg-white/70 rounded-full animate-pulse" style={{ animationDelay: '150ms' }} />
            <div className="w-1 h-3 bg-white/70 rounded-full animate-pulse" style={{ animationDelay: '300ms' }} />
          </div>
        )}
      </div>
    </div>
  );
};

export default SpeechIndicator;

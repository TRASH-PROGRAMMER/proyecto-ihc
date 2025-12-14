import { useEffect } from 'react';
import { useAccessibility } from '@/context/AccessibilityContext';

/**
 * Hook que habilita la lectura en voz alta automática para todos los elementos
 * interactivos y de texto cuando el usuario pasa el cursor sobre ellos
 */
export const useGlobalTextToSpeech = () => {
  const { speechEnabled, speakText, stopSpeaking } = useAccessibility();

  useEffect(() => {
    if (!speechEnabled) return;

    /**
     * Extrae el texto legible de un elemento, priorizando atributos de accesibilidad
     */
    const getReadableText = (element: Element): string => {
      // Prioridad 1: data-speak (atributo personalizado más específico)
      const dataSpeak = element.getAttribute('data-speak');
      if (dataSpeak && dataSpeak.trim()) return dataSpeak.trim();

      // Prioridad 2: aria-label
      const ariaLabel = element.getAttribute('aria-label');
      if (ariaLabel && ariaLabel.trim()) return ariaLabel.trim();

      // Prioridad 3: aria-description
      const ariaDescription = element.getAttribute('aria-description');
      if (ariaDescription && ariaDescription.trim()) return ariaDescription.trim();

      // Prioridad 4: title
      const title = element.getAttribute('title');
      if (title && title.trim()) return title.trim();

      // Prioridad 5: alt (para imágenes)
      const alt = element.getAttribute('alt');
      if (alt && alt.trim()) return alt.trim();

      // Prioridad 6: placeholder (para inputs)
      const placeholder = element.getAttribute('placeholder');
      if (placeholder && placeholder.trim()) return placeholder.trim();

      // Prioridad 7: textContent para elementos de texto
      const tagName = element.tagName.toLowerCase();
      if (['button', 'a', 'label', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'p', 'span'].includes(tagName)) {
        const text = element.textContent?.trim();
        if (text && text.length > 0 && text.length < 200) {
          // Limpiar texto: remover saltos de línea múltiples y espacios extras
          return text.replace(/\s+/g, ' ').trim();
        }
      }

      // Para inputs, leer el label asociado o el tipo
      if (element instanceof HTMLInputElement) {
        const label = document.querySelector(`label[for="${element.id}"]`);
        if (label?.textContent) return label.textContent.trim();
        
        const type = element.type;
        const typeLabels: Record<string, string> = {
          text: 'Campo de texto',
          email: 'Campo de correo electrónico',
          password: 'Campo de contraseña',
          search: 'Campo de búsqueda',
          tel: 'Campo de teléfono',
          number: 'Campo numérico',
          checkbox: 'Casilla de verificación',
          radio: 'Botón de radio',
          submit: 'Botón enviar',
          button: 'Botón',
        };
        return typeLabels[type] || `Campo de ${type}`;
      }

      // Para select, leer el label o el primer option
      if (element instanceof HTMLSelectElement) {
        const label = document.querySelector(`label[for="${element.id}"]`);
        if (label?.textContent) return label.textContent.trim();
        return 'Menú de selección';
      }

      // Para textarea
      if (element instanceof HTMLTextAreaElement) {
        const label = document.querySelector(`label[for="${element.id}"]`);
        if (label?.textContent) return label.textContent.trim();
        return 'Área de texto';
      }

      return '';
    };

    /**
     * Determina si un elemento debe ser leído
     */
    const shouldReadElement = (element: Element): boolean => {
      const tagName = element.tagName.toLowerCase();
      
      // Elementos interactivos que siempre se leen
      const interactiveElements = [
        'button', 'a', 'input', 'select', 'textarea', 'label'
      ];
      
      // Elementos de contenido que se leen
      const contentElements = [
        'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'p', 'li', 'td', 'th'
      ];
      
      // Elementos con roles interactivos
      const role = element.getAttribute('role');
      const interactiveRoles = [
        'button', 'link', 'menuitem', 'tab', 'checkbox', 'radio', 
        'switch', 'option', 'navigation', 'banner'
      ];

      // Verificar si el elemento está visible
      if (element instanceof HTMLElement) {
        const style = window.getComputedStyle(element);
        if (style.display === 'none' || style.visibility === 'hidden' || style.opacity === '0') {
          return false;
        }
      }

      // No leer elementos con aria-hidden="true"
      if (element.getAttribute('aria-hidden') === 'true') {
        return false;
      }

      // No leer elementos con clase .sr-only (solo para lectores de pantalla)
      if (element.classList.contains('sr-only')) {
        return false;
      }

      return (
        interactiveElements.includes(tagName) ||
        contentElements.includes(tagName) ||
        (role !== null && interactiveRoles.includes(role)) ||
        element.hasAttribute('aria-label') ||
        element.hasAttribute('title') ||
        element.hasAttribute('data-speak') ||
        element.classList.contains('speak-on-hover')
      );
    };

    let hoverTimeout: NodeJS.Timeout | null = null;
    let currentElement: Element | null = null;
    let lastSpokenText: string = '';
    let lastSpokenTime: number = 0;

    /**
     * Maneja el evento mouseenter
     */
    const handleMouseEnter = (event: Event) => {
      const element = event.target as Element;
      
      // Limpiar timeout anterior
      if (hoverTimeout) {
        clearTimeout(hoverTimeout);
        hoverTimeout = null;
      }
      
      if (!shouldReadElement(element)) return;

      const text = getReadableText(element);
      if (!text) return;
      
      // Evitar leer el mismo texto repetidamente en poco tiempo
      const now = Date.now();
      if (text === lastSpokenText && (now - lastSpokenTime) < 2000) {
        return;
      }

      currentElement = element;

      // Reducir delay para respuesta más rápida
      hoverTimeout = setTimeout(() => {
        speakText(text);
        lastSpokenText = text;
        lastSpokenTime = Date.now();
      }, 300);
    };

    /**
     * Maneja el evento focus (para navegación por teclado)
     */
    const handleFocus = (event: Event) => {
      const element = event.target as Element;
      
      if (!shouldReadElement(element)) return;

      const text = getReadableText(element);
      if (!text) return;
      
      // Evitar leer si es el mismo texto reciente
      const now = Date.now();
      if (text === lastSpokenText && (now - lastSpokenTime) < 1000) {
        return;
      }

      // Sin delay para navegación por teclado
      speakText(text);
      lastSpokenText = text;
      lastSpokenTime = Date.now();
    };

    /**
     * Maneja cuando el cursor sale del elemento
     */
    const handleMouseLeave = (event: Event) => {
      const element = event.target as Element;
      
      // Limpiar timeout si existe
      if (hoverTimeout) {
        clearTimeout(hoverTimeout);
        hoverTimeout = null;
      }
      
      // Resetear elemento actual
      if (currentElement === element) {
        currentElement = null;
      }
    };

    // Agregar event listeners
    document.addEventListener('mouseenter', handleMouseEnter, true);
    document.addEventListener('focus', handleFocus, true);
    document.addEventListener('mouseleave', handleMouseLeave, true);

    // Cleanup
    return () => {
      if (hoverTimeout) {
        clearTimeout(hoverTimeout);
        hoverTimeout = null;
      }
      document.removeEventListener('mouseenter', handleMouseEnter, true);
      document.removeEventListener('focus', handleFocus, true);
      document.removeEventListener('mouseleave', handleMouseLeave, true);
      currentElement = null;
      lastSpokenText = '';
      stopSpeaking();
    };
  }, [speechEnabled, speakText, stopSpeaking]);
};

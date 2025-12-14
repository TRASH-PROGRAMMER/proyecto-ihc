import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useTranslation } from 'react-i18next';

// Tipos de daltonismo soportados
export type ColorBlindnessType = 'none' | 'protanopia' | 'deuteranopia' | 'tritanopia';

// Tamaños de fuente
export type FontSizeType = 'small' | 'normal' | 'large' | 'extra-large';

// Atajos de teclado
export const KEYBOARD_SHORTCUTS = {
  TOGGLE_MENU: 'Alt+A',
  TOGGLE_LANGUAGE: 'Alt+L',
  INCREASE_FONT: 'Alt++',
  DECREASE_FONT: 'Alt+-',
  TOGGLE_DARK_MODE: 'Alt+D',
  TOGGLE_SPEECH: 'Alt+V',
  RESET_ALL: 'Alt+R',
} as const;

interface AccessibilityContextType {
  // Idioma
  language: string;
  toggleLanguage: () => void;
  
  // Tamaño de fuente
  fontSize: FontSizeType;
  increaseFontSize: () => void;
  decreaseFontSize: () => void;
  resetFontSize: () => void;
  
  // Daltonismo
  colorBlindnessMode: ColorBlindnessType;
  setColorBlindnessMode: (mode: ColorBlindnessType) => void;
  
  // Modo oscuro
  darkMode: boolean;
  toggleDarkMode: () => void;
  
  // Lectura por voz
  speechEnabled: boolean;
  toggleSpeech: () => void;
  speakText: (text: string) => void;
  stopSpeaking: () => void;
  isSpeaking: boolean;
  
  // Restablecer todo
  resetAllSettings: () => void;
  
  // Atajos de teclado
  shortcuts: typeof KEYBOARD_SHORTCUTS;
}

const AccessibilityContext = createContext<AccessibilityContextType | undefined>(undefined);

const FONT_SIZE_MAP: Record<FontSizeType, number> = {
  'small': 87.5,
  'normal': 100,
  'large': 112.5,
  'extra-large': 125,
};

export const AccessibilityProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { i18n } = useTranslation();
  
  // Estados persistentes en localStorage
  const [language, setLanguage] = useState<string>(() => 
    localStorage.getItem('eco-language') || 'es'
  );
  
  const [fontSize, setFontSize] = useState<FontSizeType>(() => 
    (localStorage.getItem('eco-font-size') as FontSizeType) || 'normal'
  );
  
  const [colorBlindnessMode, setColorBlindnessModeState] = useState<ColorBlindnessType>(() => 
    (localStorage.getItem('eco-color-blindness') as ColorBlindnessType) || 'none'
  );
  
  const [darkMode, setDarkMode] = useState<boolean>(() => 
    localStorage.getItem('eco-dark-mode') === 'true'
  );
  
  const [speechEnabled, setSpeechEnabled] = useState<boolean>(() => 
    localStorage.getItem('eco-speech-enabled') === 'true'
  );
  
  const [isSpeaking, setIsSpeaking] = useState(false);

  // Aplicar idioma
  useEffect(() => {
    i18n.changeLanguage(language);
    localStorage.setItem('eco-language', language);
    document.documentElement.lang = language;
  }, [language, i18n]);

  // Aplicar tamaño de fuente
  useEffect(() => {
    document.documentElement.style.fontSize = `${FONT_SIZE_MAP[fontSize]}%`;
    localStorage.setItem('eco-font-size', fontSize);
  }, [fontSize]);

  // Aplicar modo de daltonismo
  useEffect(() => {
    const root = document.documentElement;
    root.classList.remove('protanopia', 'deuteranopia', 'tritanopia');
    
    if (colorBlindnessMode !== 'none') {
      root.classList.add(colorBlindnessMode);
    }
    
    localStorage.setItem('eco-color-blindness', colorBlindnessMode);
  }, [colorBlindnessMode]);

  // Aplicar modo oscuro
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('eco-dark-mode', darkMode.toString());
  }, [darkMode]);

  // Guardar preferencia de voz y detener si se desactiva
  useEffect(() => {
    localStorage.setItem('eco-speech-enabled', speechEnabled.toString());
    if (!speechEnabled) {
      stopSpeaking();
    }
  }, [speechEnabled]);

  // Funciones
  const toggleLanguage = () => {
    setLanguage(prev => prev === 'es' ? 'en' : 'es');
  };

  const increaseFontSize = () => {
    const sizes: FontSizeType[] = ['small', 'normal', 'large', 'extra-large'];
    const currentIndex = sizes.indexOf(fontSize);
    if (currentIndex < sizes.length - 1) {
      setFontSize(sizes[currentIndex + 1]);
    }
  };

  const decreaseFontSize = () => {
    const sizes: FontSizeType[] = ['small', 'normal', 'large', 'extra-large'];
    const currentIndex = sizes.indexOf(fontSize);
    if (currentIndex > 0) {
      setFontSize(sizes[currentIndex - 1]);
    }
  };

  const resetFontSize = () => {
    setFontSize('normal');
  };

  const setColorBlindnessMode = (mode: ColorBlindnessType) => {
    setColorBlindnessModeState(mode);
  };

  const toggleDarkMode = () => {
    setDarkMode(prev => !prev);
  };

  const toggleSpeech = () => {
    setSpeechEnabled(prev => !prev);
    if (speechEnabled) {
      stopSpeaking();
    }
  };

  const speakText = (text: string) => {
    if (!speechEnabled) return;
    
    // Verificar soporte del navegador
    if (!('speechSynthesis' in window)) {
      console.warn('La síntesis de voz no está soportada en este navegador');
      return;
    }
    
    // Limpiar el texto: remover espacios múltiples, saltos de línea, etc.
    const cleanText = text
      .replace(/\n+/g, ' ')  // Reemplazar saltos de línea por espacios
      .replace(/\s+/g, ' ')  // Reemplazar múltiples espacios por uno solo
      .replace(/[\u200B-\u200D\uFEFF]/g, '')  // Remover caracteres invisibles
      .replace(/[\u{1F600}-\u{1F64F}]/gu, '') // Remover emojis
      .trim();
    
    if (!cleanText || cleanText.length === 0) return;
    
    // Cancelar cualquier lectura en curso y esperar
    if (window.speechSynthesis.speaking) {
      window.speechSynthesis.cancel();
    }
    
    const utterance = new SpeechSynthesisUtterance(cleanText);
    
    // Configuración optimizada para mejor audibilidad
    utterance.lang = language === 'es' ? 'es-ES' : 'en-US';
    utterance.rate = 1.0; // Velocidad normal
    utterance.pitch = 1.0; // Tono natural
    utterance.volume = 1.0; // Volumen máximo
    
    utterance.onstart = () => {
      setIsSpeaking(true);
    };
    
    utterance.onend = () => {
      setIsSpeaking(false);
    };
    
    utterance.onerror = (event) => {
      setIsSpeaking(false);
      if (event.error !== 'canceled' && event.error !== 'interrupted') {
        console.warn('Error en síntesis de voz:', event.error);
      }
    };
    
    // Función para hablar cuando las voces estén listas
    const speak = () => {
      try {
        // Obtener las voces disponibles
        const voices = window.speechSynthesis.getVoices();
        
        // Intentar encontrar una voz en el idioma deseado
        const desiredLang = language === 'es' ? 'es' : 'en';
        const voice = voices.find(v => v.lang.startsWith(desiredLang));
        
        if (voice) {
          utterance.voice = voice;
        }
        
        window.speechSynthesis.speak(utterance);
      } catch (error) {
        setIsSpeaking(false);
      }
    };
    
    // Las voces pueden no estar disponibles inmediatamente
    if (window.speechSynthesis.getVoices().length === 0) {
      window.speechSynthesis.addEventListener('voiceschanged', speak, { once: true });
      // Timeout de seguridad
      setTimeout(speak, 100);
    } else {
      // Pequeño delay para asegurar que la cancelación se completó
      setTimeout(speak, 50);
    }
  };

  const stopSpeaking = () => {
    if ('speechSynthesis' in window) {
      try {
        window.speechSynthesis.cancel();
        setIsSpeaking(false);
      } catch (error) {
        console.warn('Error al detener la síntesis de voz:', error);
        setIsSpeaking(false);
      }
    }
  };

  const resetAllSettings = () => {
    setLanguage('es');
    setFontSize('normal');
    setColorBlindnessModeState('none');
    setDarkMode(false);
    setSpeechEnabled(false);
    stopSpeaking();
  };

  // Manejo de atajos de teclado globales
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Alt + L: Cambiar idioma
      if (e.altKey && e.key.toLowerCase() === 'l') {
        e.preventDefault();
        toggleLanguage();
        speakText(language === 'es' ? 'Cambiado a inglés' : 'Changed to Spanish');
      }
      
      // Alt + =: Aumentar fuente (+ requiere Shift en muchos teclados)
      if (e.altKey && (e.key === '=' || e.key === '+')) {
        e.preventDefault();
        increaseFontSize();
        speakText('Fuente más grande');
      }
      
      // Alt + -: Disminuir fuente
      if (e.altKey && e.key === '-') {
        e.preventDefault();
        decreaseFontSize();
        speakText('Fuente más pequeña');
      }
      
      // Alt + D: Toggle modo oscuro
      if (e.altKey && e.key.toLowerCase() === 'd') {
        e.preventDefault();
        toggleDarkMode();
        speakText(darkMode ? 'Modo claro activado' : 'Modo oscuro activado');
      }
      
      // Alt + V: Toggle lectura por voz
      if (e.altKey && e.key.toLowerCase() === 'v') {
        e.preventDefault();
        toggleSpeech();
        if (!speechEnabled) {
          setTimeout(() => speakText('Lectura por voz activada'), 100);
        }
      }
      
      // Alt + R: Restablecer configuración
      if (e.altKey && e.key.toLowerCase() === 'r') {
        e.preventDefault();
        resetAllSettings();
        setTimeout(() => speakText('Configuración restablecida'), 100);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [language, darkMode, speechEnabled, fontSize]);

  return (
    <AccessibilityContext.Provider
      value={{
        language,
        toggleLanguage,
        fontSize,
        increaseFontSize,
        decreaseFontSize,
        resetFontSize,
        colorBlindnessMode,
        setColorBlindnessMode,
        darkMode,
        toggleDarkMode,
        speechEnabled,
        toggleSpeech,
        speakText,
        stopSpeaking,
        isSpeaking,
        resetAllSettings,
        shortcuts: KEYBOARD_SHORTCUTS,
      }}
    >
      {children}
    </AccessibilityContext.Provider>
  );
};

export const useAccessibility = () => {
  const context = useContext(AccessibilityContext);
  if (!context) {
    throw new Error('useAccessibility debe usarse dentro de AccessibilityProvider');
  }
  return context;
};

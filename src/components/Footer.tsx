import { Link } from "react-router-dom";
import { Leaf, Facebook, Instagram, Twitter, Mail } from "lucide-react";
import { useTranslation } from "react-i18next";

const Footer = () => {
  const { t } = useTranslation();
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-foreground/5 border-t border-border">
      <div className="container px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Leaf className="h-7 w-7 text-primary" aria-hidden="true" />
              <span className="font-bold text-xl text-foreground">EcoRutas</span>
            </div>
            <p className="text-sm text-muted-foreground">
              {t('Connecting travelers with rural communities')}
            </p>
            <div className="flex gap-3">
              <a 
                href="https://facebook.com" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="text-muted-foreground hover:text-primary transition-colors" 
                aria-label="Visitar Facebook de EcoRutas"
                data-speak="Enlace a nuestra página de Facebook"
              >
                <Facebook className="h-5 w-5" />
              </a>
              <a 
                href="https://instagram.com" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="text-muted-foreground hover:text-primary transition-colors" 
                aria-label="Visitar Instagram de EcoRutas"
                data-speak="Enlace a nuestra cuenta de Instagram"
              >
                <Instagram className="h-5 w-5" />
              </a>
              <a 
                href="https://twitter.com" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="text-muted-foreground hover:text-primary transition-colors" 
                aria-label="Visitar Twitter de EcoRutas"
                data-speak="Enlace a nuestra cuenta de Twitter"
              >
                <Twitter className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Explorar */}
          <div>
            <h3 className="font-bold text-foreground mb-4">{t('Explore')}</h3>
            <ul className="space-y-2">
              <li>
                <Link 
                  to="/rutas" 
                  className="text-sm text-muted-foreground hover:text-primary transition-colors"
                  data-speak="Explorar rutas de ecoturismo disponibles"
                >
                  {t('Eco-tourism Routes')}
                </Link>
              </li>
              <li>
                <Link 
                  to="/guias" 
                  className="text-sm text-muted-foreground hover:text-primary transition-colors"
                  data-speak="Ver guías locales certificados"
                >
                  {t('Local Guides')}
                </Link>
              </li>
              <li>
                <Link 
                  to="/comunidades" 
                  className="text-sm text-muted-foreground hover:text-primary transition-colors"
                  data-speak="Conocer las comunidades participantes"
                >
                  {t('Communities')}
                </Link>
              </li>
            </ul>
          </div>

          {/* Información */}
          <div>
            <h3 className="font-bold text-foreground mb-4">{t('Information')}</h3>
            <ul className="space-y-2">
              <li>
                <Link 
                  to="/nosotros" 
                  className="text-sm text-muted-foreground hover:text-primary transition-colors"
                  data-speak="Información sobre EcoRutas y nuestra misión"
                >
                  {t('About Us')}
                </Link>
              </li>
              <li>
                <Link 
                  to="/politicas-uso" 
                  className="text-sm text-muted-foreground hover:text-primary transition-colors"
                  data-speak="Leer términos y condiciones de uso"
                >
                  {t('Terms of Use')}
                </Link>
              </li>
              <li>
                <Link 
                  to="/sostenibilidad" 
                  className="text-sm text-muted-foreground hover:text-primary transition-colors"
                  data-speak="Conocer nuestro compromiso con la sostenibilidad"
                >
                  {t('Sustainability')}
                </Link>
              </li>
              <li>
                <Link 
                  to="/faq" 
                  className="text-sm text-muted-foreground hover:text-primary transition-colors"
                  data-speak="Ver preguntas frecuentes"
                >
                  {t('Frequently Asked Questions')}
                </Link>
              </li>
            </ul>
          </div>

          {/* Contacto */}
          <div>
            <h3 className="font-bold text-foreground mb-4">{t('Contact')}</h3>
            <ul className="space-y-2">
              <li className="flex items-center gap-2 text-sm text-muted-foreground">
                <Mail className="h-4 w-4" aria-hidden="true" />
                <a href="mailto:contacto@ecorutas.com" className="hover:text-primary transition-colors">
                  contacto@ecorutas.com
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-border text-center text-sm text-muted-foreground">
          <p>&copy; {currentYear} EcoRutas. {t('All rights reserved')}.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

import { useTranslation } from "react-i18next";
import Footer from "@/components/Footer";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Shield, FileText, Users, AlertCircle, Lock, Scale } from "lucide-react";

const PoliticasUso = () => {
  const { t } = useTranslation();

  return (
    <div className="min-h-screen bg-background w-full">
      <div className="pt-12 pb-16 container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Encabezado */}
        <div className="mb-12 text-center">
          <div className="flex justify-center mb-4">
            <Shield className="h-16 w-16 text-primary" aria-hidden="true" />
          </div>
          <h1 className="text-4xl font-bold text-foreground mb-4">
            Políticas de Uso
          </h1>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            Términos y condiciones para el uso de la plataforma EcoRutas
          </p>
          <p className="text-sm text-muted-foreground mt-2">
            Última actualización: Diciembre 2025
          </p>
        </div>

        {/* Contenido Principal */}
        <div className="max-w-4xl mx-auto">
          <div className="bg-card rounded-lg shadow-sm border border-border p-8">
            <ScrollArea className="h-[600px] pr-4">
              {/* 1. Aceptación de Términos */}
              <section className="mb-8">
                <div className="flex items-center gap-3 mb-4">
                  <FileText className="h-6 w-6 text-primary" aria-hidden="true" />
                  <h2 className="text-2xl font-bold text-foreground">
                    1. Aceptación de Términos
                  </h2>
                </div>
                <p className="text-muted-foreground leading-relaxed mb-3">
                  Al acceder y utilizar la plataforma EcoRutas, usted acepta estar sujeto a estos términos 
                  y condiciones de uso. Si no está de acuerdo con alguna parte de estos términos, 
                  no debe utilizar nuestros servicios.
                </p>
                <p className="text-muted-foreground leading-relaxed">
                  Nos reservamos el derecho de modificar estos términos en cualquier momento. 
                  Es su responsabilidad revisar periódicamente estas políticas para estar al tanto 
                  de cualquier cambio.
                </p>
              </section>

              <Separator className="my-6" />

              {/* 2. Uso de la Plataforma */}
              <section className="mb-8">
                <div className="flex items-center gap-3 mb-4">
                  <Users className="h-6 w-6 text-primary" aria-hidden="true" />
                  <h2 className="text-2xl font-bold text-foreground">
                    2. Uso de la Plataforma
                  </h2>
                </div>
                <p className="text-muted-foreground leading-relaxed mb-3">
                  EcoRutas es una plataforma diseñada para conectar turistas con comunidades rurales 
                  y guías locales, promoviendo el turismo sostenible y responsable.
                </p>
                <div className="bg-muted/50 p-4 rounded-md mb-3">
                  <h3 className="font-semibold text-foreground mb-2">Usted se compromete a:</h3>
                  <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                    <li>Proporcionar información veraz y actualizada</li>
                    <li>Mantener la confidencialidad de sus credenciales de acceso</li>
                    <li>No utilizar la plataforma para fines ilícitos o no autorizados</li>
                    <li>Respetar los derechos de propiedad intelectual</li>
                    <li>No realizar actividades que puedan dañar o interrumpir los servicios</li>
                    <li>Respetar las normas de las comunidades locales</li>
                  </ul>
                </div>
              </section>

              <Separator className="my-6" />

              {/* 3. Registro y Cuentas de Usuario */}
              <section className="mb-8">
                <div className="flex items-center gap-3 mb-4">
                  <Lock className="h-6 w-6 text-primary" aria-hidden="true" />
                  <h2 className="text-2xl font-bold text-foreground">
                    3. Registro y Cuentas de Usuario
                  </h2>
                </div>
                <p className="text-muted-foreground leading-relaxed mb-3">
                  Para acceder a ciertas funcionalidades de la plataforma, es necesario crear una cuenta. 
                  Al registrarse, usted garantiza que la información proporcionada es precisa y completa.
                </p>
                <div className="bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800 p-4 rounded-md">
                  <div className="flex gap-2">
                    <AlertCircle className="h-5 w-5 text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="font-semibold text-amber-900 dark:text-amber-200 mb-1">
                        Importante
                      </p>
                      <p className="text-sm text-amber-800 dark:text-amber-300">
                        Es su responsabilidad mantener la seguridad de su cuenta. 
                        Notifíquenos inmediatamente si sospecha de cualquier uso no autorizado.
                      </p>
                    </div>
                  </div>
                </div>
              </section>

              <Separator className="my-6" />

              {/* 4. Privacidad y Protección de Datos */}
              <section className="mb-8">
                <div className="flex items-center gap-3 mb-4">
                  <Shield className="h-6 w-6 text-primary" aria-hidden="true" />
                  <h2 className="text-2xl font-bold text-foreground">
                    4. Privacidad y Protección de Datos
                  </h2>
                </div>
                <p className="text-muted-foreground leading-relaxed mb-3">
                  La protección de sus datos personales es fundamental para nosotros. 
                  Recopilamos, almacenamos y procesamos su información de acuerdo con las leyes 
                  de protección de datos aplicables.
                </p>
                <div className="space-y-2 text-muted-foreground">
                  <p><strong className="text-foreground">Información recopilada:</strong> Datos de registro, información de perfil, historial de navegación y reservas.</p>
                  <p><strong className="text-foreground">Uso de datos:</strong> Mejorar nuestros servicios, procesar reservas, comunicarnos con usted y cumplir con obligaciones legales.</p>
                  <p><strong className="text-foreground">Compartir datos:</strong> Solo compartimos información con terceros cuando es necesario para proporcionar los servicios solicitados o cuando lo requiera la ley.</p>
                </div>
              </section>

              <Separator className="my-6" />

              {/* 5. Reservas y Cancelaciones */}
              <section className="mb-8">
                <div className="flex items-center gap-3 mb-4">
                  <FileText className="h-6 w-6 text-primary" aria-hidden="true" />
                  <h2 className="text-2xl font-bold text-foreground">
                    5. Reservas y Cancelaciones
                  </h2>
                </div>
                <p className="text-muted-foreground leading-relaxed mb-3">
                  Al realizar una reserva a través de EcoRutas, usted acepta las condiciones específicas 
                  de cada servicio, incluyendo políticas de cancelación establecidas por los proveedores locales.
                </p>
                <div className="bg-muted/50 p-4 rounded-md">
                  <h3 className="font-semibold text-foreground mb-2">Política General de Cancelación:</h3>
                  <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                    <li>Cancelación con más de 7 días de anticipación: Reembolso del 100%</li>
                    <li>Cancelación entre 3-7 días: Reembolso del 50%</li>
                    <li>Cancelación con menos de 3 días: Sin reembolso</li>
                    <li>Condiciones específicas pueden variar según el proveedor</li>
                  </ul>
                </div>
              </section>

              <Separator className="my-6" />

              {/* 6. Responsabilidades y Limitaciones */}
              <section className="mb-8">
                <div className="flex items-center gap-3 mb-4">
                  <Scale className="h-6 w-6 text-primary" aria-hidden="true" />
                  <h2 className="text-2xl font-bold text-foreground">
                    6. Responsabilidades y Limitaciones
                  </h2>
                </div>
                <p className="text-muted-foreground leading-relaxed mb-3">
                  EcoRutas actúa como intermediario entre turistas y proveedores de servicios locales. 
                  No somos responsables de la calidad, seguridad o legalidad de los servicios ofrecidos 
                  por terceros.
                </p>
                <div className="bg-muted/50 p-4 rounded-md">
                  <h3 className="font-semibold text-foreground mb-2">Limitaciones de Responsabilidad:</h3>
                  <ul className="space-y-2 text-muted-foreground text-sm">
                    <li>• No garantizamos la disponibilidad ininterrumpida de la plataforma</li>
                    <li>• No somos responsables por daños indirectos o consecuentes</li>
                    <li>• Los usuarios son responsables de verificar la información antes de reservar</li>
                    <li>• Se recomienda contratar seguro de viaje apropiado</li>
                  </ul>
                </div>
              </section>

              <Separator className="my-6" />

              {/* 7. Propiedad Intelectual */}
              <section className="mb-8">
                <div className="flex items-center gap-3 mb-4">
                  <FileText className="h-6 w-6 text-primary" aria-hidden="true" />
                  <h2 className="text-2xl font-bold text-foreground">
                    7. Propiedad Intelectual
                  </h2>
                </div>
                <p className="text-muted-foreground leading-relaxed mb-3">
                  Todo el contenido de la plataforma EcoRutas, incluyendo textos, gráficos, logotipos, 
                  imágenes y software, está protegido por derechos de autor y otras leyes de propiedad intelectual.
                </p>
                <p className="text-muted-foreground leading-relaxed">
                  No está permitido copiar, modificar, distribuir o utilizar nuestro contenido sin 
                  autorización expresa por escrito.
                </p>
              </section>

              <Separator className="my-6" />

              {/* 8. Conducta del Usuario */}
              <section className="mb-8">
                <div className="flex items-center gap-3 mb-4">
                  <Users className="h-6 w-6 text-primary" aria-hidden="true" />
                  <h2 className="text-2xl font-bold text-foreground">
                    8. Conducta del Usuario
                  </h2>
                </div>
                <p className="text-muted-foreground leading-relaxed mb-3">
                  Se espera que todos los usuarios mantengan un comportamiento respetuoso y ético 
                  al interactuar con la plataforma, comunidades locales y otros usuarios.
                </p>
                <div className="bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-800 p-4 rounded-md">
                  <div className="flex gap-2">
                    <AlertCircle className="h-5 w-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="font-semibold text-red-900 dark:text-red-200 mb-1">
                        Conductas Prohibidas
                      </p>
                      <ul className="text-sm text-red-800 dark:text-red-300 space-y-1">
                        <li>• Acoso, intimidación o discriminación</li>
                        <li>• Contenido ofensivo, difamatorio o ilegal</li>
                        <li>• Suplantación de identidad</li>
                        <li>• Spam o publicidad no autorizada</li>
                        <li>• Intentos de fraude o estafa</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </section>

              <Separator className="my-6" />

              {/* 9. Modificación y Terminación */}
              <section className="mb-8">
                <div className="flex items-center gap-3 mb-4">
                  <Scale className="h-6 w-6 text-primary" aria-hidden="true" />
                  <h2 className="text-2xl font-bold text-foreground">
                    9. Modificación y Terminación
                  </h2>
                </div>
                <p className="text-muted-foreground leading-relaxed mb-3">
                  Nos reservamos el derecho de modificar o descontinuar la plataforma en cualquier momento, 
                  con o sin previo aviso. También podemos suspender o terminar su acceso si consideramos 
                  que ha violado estos términos.
                </p>
                <p className="text-muted-foreground leading-relaxed">
                  Usted puede cancelar su cuenta en cualquier momento desde la configuración de su perfil.
                </p>
              </section>

              <Separator className="my-6" />

              {/* 10. Contacto */}
              <section className="mb-8">
                <div className="flex items-center gap-3 mb-4">
                  <FileText className="h-6 w-6 text-primary" aria-hidden="true" />
                  <h2 className="text-2xl font-bold text-foreground">
                    10. Contacto
                  </h2>
                </div>
                <p className="text-muted-foreground leading-relaxed mb-3">
                  Si tiene preguntas sobre estas Políticas de Uso, puede contactarnos:
                </p>
                <div className="bg-muted/50 p-4 rounded-md space-y-2">
                  <p className="text-muted-foreground">
                    <strong className="text-foreground">Email:</strong> legal@ecorutas.com
                  </p>
                  <p className="text-muted-foreground">
                    <strong className="text-foreground">Email general:</strong> contacto@ecorutas.com
                  </p>
                  <p className="text-muted-foreground">
                    <strong className="text-foreground">Horario de atención:</strong> Lunes a Viernes, 9:00 - 18:00
                  </p>
                </div>
              </section>

              <Separator className="my-6" />

              {/* Nota Final */}
              <div className="bg-primary/10 p-6 rounded-md">
                <p className="text-sm text-foreground/80 text-center">
                  Al utilizar EcoRutas, usted reconoce haber leído, comprendido y aceptado 
                  estos términos y condiciones en su totalidad.
                </p>
              </div>
            </ScrollArea>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default PoliticasUso;

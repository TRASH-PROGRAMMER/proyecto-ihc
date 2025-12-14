import { Leaf, Users, Calendar, Heart } from "lucide-react";
import { useTranslation } from "react-i18next";

const Features = () => {
  const { t } = useTranslation();
  
  const features = [
    {
      icon: Leaf,
      title: t('100% Sustainable'),
      description: t('Responsible tourism'),
    },
    {
      icon: Users,
      title: t('Local Guides'),
      description: t('Authentic experiences'),
    },
    {
      icon: Calendar,
      title: t('Easy Booking'),
      description: t('Intuitive calendar system'),
    },
    {
      icon: Heart,
      title: t('Positive Impact'),
      description: t('Your visit generates income'),
    },
  ];
  return (
    <section className="py-20 bg-muted/30">
      <div className="container px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mb-4">
            {t('Why EcoRutas?')}
          </h2>
          <p className="text-lg text-muted-foreground">
            {t('We connect conscious travelers')}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div
                key={index}
                className="text-center group hover:scale-105 transition-transform duration-300"
              >
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4 group-hover:bg-primary/20 transition-colors">
                  <Icon className="h-8 w-8 text-primary" aria-hidden="true" />
                </div>
                <h3 className="text-xl font-bold text-foreground mb-2">
                  {feature.title}
                </h3>
                <p className="text-muted-foreground">
                  {feature.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Features;

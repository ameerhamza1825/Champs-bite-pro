import React from 'react';
import { Flame, ShieldCheck, HeartHandshake, Truck } from 'lucide-react';

export const FeaturePillars: React.FC = () => {
  const features = [
    {
      icon: Flame,
      title: 'Stone-Fired Crust',
      description: 'Slow-fermented artisan dough baked at scorching 450°C stone heat for an airy rim & crispy bottom.',
    },
    {
      icon: ShieldCheck,
      title: '100% Real Mozzarella',
      description: 'Generously loaded with authentic whole milk mozzarella for rich taste & unmatched stretchy pull.',
    },
    {
      icon: HeartHandshake,
      title: 'Authentic Local Recipes',
      description: 'Handcrafted marinades, freshly roasted spices, and succulent chargrilled Malai and Tikka chunks.',
    },
    {
      icon: Truck,
      title: 'Thermal Hot Delivery',
      description: 'Specialized thermal insulation bags ensure your pizza, burgers, and wings arrive bubbling hot in Gujranwala.',
    },
  ];

  return (
    <section className="bg-zinc-900/50 border-b border-zinc-800/80 py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feat, index) => {
            const Icon = feat.icon;
            return (
              <div
                key={index}
                className="flex items-start gap-4 p-4 rounded-2xl bg-zinc-950/40 border border-zinc-800/60 hover:border-amber-500/30 transition-colors"
              >
                <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center shrink-0">
                  <Icon className="w-5 h-5 text-amber-400" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white mb-1">{feat.title}</h3>
                  <p className="text-xs text-zinc-400 leading-relaxed">{feat.description}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

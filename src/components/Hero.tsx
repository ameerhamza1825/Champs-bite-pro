import React from 'react';
import { ArrowRight, Sparkles, Flame, ShieldCheck, Clock, MessageCircle, Pizza } from 'lucide-react';
import { RESTAURANT_INFO, IMAGES } from '../data/menuData';

interface HeroProps {
  onExploreMenu: () => void;
  onExploreDeals: () => void;
  onOpenCustomizer: () => void;
  badge?: string;
  titleLine1?: string;
  titleHighlight?: string;
  description?: string;
  btnPrimary?: string;
  btnSecondary?: string;
  isVisualEditMode?: boolean;
  onEditClick?: (field: string) => void;
}

export const Hero: React.FC<HeroProps> = ({
  onExploreMenu,
  onExploreDeals,
  onOpenCustomizer,
  badge = "Artisanal Pizzeria · Gujranwala's No. 1 Crust",
  titleLine1 = 'Magic In Every',
  titleHighlight = 'First Bite.',
  description = 'Stone-hearth baked pizzas loaded with 100% whole milk mozzarella, mouth-watering seekh kabab stuffed crusts, juicy zinger burgers, and smoky BBQ wings. Baked hot & delivered fresh across Gujranwala.',
  btnPrimary = 'Explore Full Menu',
  btnSecondary = 'Special Deals & Combos',
  isVisualEditMode,
  onEditClick,
}) => {
  const openWhatsApp = () => {
    const text = encodeURIComponent(
      `Hello ${RESTAURANT_INFO.name}! I would like to check current deals and place an order.`
    );
    window.open(`https://wa.me/${RESTAURANT_INFO.whatsappRaw}?text=${text}`, '_blank');
  };

  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-zinc-950 via-zinc-900/60 to-zinc-950 pt-8 pb-16 md:pt-14 md:pb-24 border-b border-zinc-800/80">
      {/* Ambient background glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-amber-500/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute top-1/3 right-10 w-[300px] h-[300px] bg-red-600/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Column: Editorial Messaging */}
          <div
            onClick={() => isVisualEditMode && onEditClick?.('hero')}
            className={`lg:col-span-7 space-y-6 text-center lg:text-left relative rounded-3xl transition-all ${
              isVisualEditMode
                ? 'cursor-pointer p-4 -m-4 border-2 border-dashed border-amber-400/80 bg-amber-500/5 hover:bg-amber-500/10'
                : ''
            }`}
          >
            {isVisualEditMode && (
              <span className="absolute top-2 right-2 bg-amber-500 text-zinc-950 text-[10px] font-black uppercase px-2 py-0.5 rounded shadow">
                ✎ Click to Edit Hero Content
              </span>
            )}

            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-semibold">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>{badge}</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight leading-[1.1] text-balance">
              {titleLine1} <br className="hidden sm:inline" />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-amber-300 to-yellow-500">
                {titleHighlight}
              </span>
            </h1>

            <p className="text-base sm:text-lg text-zinc-300 max-w-2xl mx-auto lg:mx-0 font-normal leading-relaxed">
              {description}
            </p>

            {/* CTAs */}
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-3.5 pt-2">
              <button
                onClick={onExploreMenu}
                className="px-6 py-3.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-zinc-950 font-extrabold text-sm transition-all shadow-lg shadow-amber-500/20 flex items-center gap-2 group cursor-pointer active:scale-95"
              >
                <span>{btnPrimary}</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>

              <button
                onClick={onExploreDeals}
                className="px-6 py-3.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 text-zinc-100 font-bold text-sm transition-all flex items-center gap-2 cursor-pointer active:scale-95"
              >
                <Flame className="w-4 h-4 text-amber-400" />
                <span>{btnSecondary}</span>
              </button>

              <button
                onClick={openWhatsApp}
                className="px-5 py-3.5 rounded-xl bg-emerald-600/20 hover:bg-emerald-600/30 border border-emerald-500/30 text-emerald-400 hover:text-white font-bold text-sm transition-all flex items-center gap-2 cursor-pointer active:scale-95"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Instant WhatsApp</span>
              </button>
            </div>

            {/* Quality Proof Points */}
            <div className="pt-6 border-t border-zinc-800/80 grid grid-cols-2 sm:grid-cols-4 gap-4 text-left">
              <div className="space-y-1">
                <div className="text-xl font-black text-amber-400">450°C</div>
                <div className="text-xs text-zinc-400 leading-snug">Stone Hearth Fire</div>
              </div>
              <div className="space-y-1">
                <div className="text-xl font-black text-amber-400">100%</div>
                <div className="text-xs text-zinc-400 leading-snug">Real Mozzarella</div>
              </div>
              <div className="space-y-1">
                <div className="text-xl font-black text-amber-400">30-40m</div>
                <div className="text-xs text-zinc-400 leading-snug">Thermal Delivery</div>
              </div>
              <div className="space-y-1">
                <div className="text-xl font-black text-amber-400">4.9 ★</div>
                <div className="text-xs text-zinc-400 leading-snug">Gujranwala Rated</div>
              </div>
            </div>
          </div>

          {/* Right Column: Visual Anchor */}
          <div className="lg:col-span-5 relative">
            <div className="relative mx-auto max-w-md lg:max-w-none">
              <div className="relative rounded-3xl overflow-hidden border border-zinc-700/60 shadow-2xl shadow-black/80 bg-zinc-900 group">
                <img
                  src={IMAGES.heroPizza}
                  alt="Champs Bites Artisanal Stone-Baked Pizza"
                  className="w-full aspect-[4/3] object-cover group-hover:scale-105 transition-transform duration-700"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/20 to-transparent" />

                {/* Floating pill overlays on image */}
                <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between gap-3 bg-zinc-950/80 backdrop-blur-md border border-zinc-800 p-3.5 rounded-2xl">
                  <div>
                    <div className="text-xs font-bold text-amber-400 uppercase tracking-wider">
                      Signature Pizza
                    </div>
                    <div className="text-sm font-black text-white">
                      Malai Boti Stone-Baked Crust
                    </div>
                    <div className="text-xs text-zinc-400">
                      Stuffed Kabab & Mozzarella Crust available
                    </div>
                  </div>
                  <button
                    onClick={onOpenCustomizer}
                    className="shrink-0 bg-amber-500 hover:bg-amber-400 text-zinc-950 text-xs font-black px-3.5 py-2 rounded-xl transition-all flex items-center gap-1 cursor-pointer"
                  >
                    <Pizza className="w-3.5 h-3.5" />
                    <span>Customize</span>
                  </button>
                </div>
              </div>

              {/* Decorative floating badge */}
              <div className="absolute -top-4 -right-3 sm:-right-4 bg-zinc-900/95 border border-amber-500/40 text-white p-3 rounded-2xl shadow-xl flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center font-black text-xs">
                  🔥
                </div>
                <div>
                  <div className="text-[11px] font-bold text-white leading-tight">Freshly Baked</div>
                  <div className="text-[10px] text-amber-400 font-medium">To Order Every Time</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

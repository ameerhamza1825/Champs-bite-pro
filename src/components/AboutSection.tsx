import React from 'react';
import { MapPin, Clock, Phone, MessageCircle, Star, ShieldCheck, Heart } from 'lucide-react';
import { RESTAURANT_INFO } from '../data/menuData';

interface AboutSectionProps {
  title?: string;
  subtitle?: string;
  text1?: string;
  text2?: string;
  isVisualEditMode?: boolean;
  onEditClick?: (field: string) => void;
}

export const AboutSection: React.FC<AboutSectionProps> = ({
  title = 'The Champs Bites Story —',
  subtitle = 'Proudly Born in Gujranwala',
  text1 = 'At Champs Bites, we believe great pizza begins with uncompromising passion. We set out to redefine pizza culture in Gujranwala by replacing mass-produced frozen bases with genuine slow-fermented, stone-baked artisan dough.',
  text2 = 'Every single pizza is hand-stretched, topped with 100% whole milk mozzarella, and baked inside high-heat stone hearth ovens. Combined with our legendary local flavor profiles like creamy Malai Boti, smoky Behari Kabab, and our signature Crown Crust, we guarantee magic in your very first bite.',
  isVisualEditMode,
  onEditClick,
}) => {
  const reviews = [
    {
      name: 'Hamza Tariq',
      location: 'Model Town, Gujranwala',
      rating: 5,
      comment:
        'Hands down the best crust in Gujranwala! The Malai Boti Crown Crust with kabab stuffing was loaded with genuine mozzarella. Delivered steaming hot within 35 minutes.',
    },
    {
      name: 'Ayesha Malik',
      location: 'DC Colony, Gujranwala',
      rating: 5,
      comment:
        'Ordered the Mega Deal 3 for our family weekend. Both medium pizzas were delicious and the dough was so light and crispy. WhatsApp ordering was effortless!',
    },
    {
      name: 'Usman Ali',
      location: 'Wapda Town, Gujranwala',
      rating: 5,
      comment:
        'The Crispy Zinger Burger and Loaded Cheese Fries are elite. Super fresh oil, crunchy fillet, and generous cheese sauce. Champs Bites is our go-to spot now.',
    },
  ];

  return (
    <section id="aboutSection" className="py-16 bg-zinc-950 scroll-mt-20 border-b border-zinc-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Story Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center mb-16">
          <div
            onClick={() => isVisualEditMode && onEditClick?.('about')}
            className={`lg:col-span-7 space-y-6 relative rounded-3xl transition-all ${
              isVisualEditMode
                ? 'cursor-pointer p-4 -m-4 border-2 border-dashed border-amber-400/80 bg-amber-500/5 hover:bg-amber-500/10'
                : ''
            }`}
          >
            {isVisualEditMode && (
              <span className="absolute top-2 right-2 bg-amber-500 text-zinc-950 text-[10px] font-black uppercase px-2 py-0.5 rounded shadow">
                ✎ Click to Edit Story & Location
              </span>
            )}

            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-bold uppercase tracking-wider">
              <Heart className="w-3.5 h-3.5 fill-current" />
              Our Culinary Heritage
            </div>

            <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight leading-tight">
              {title} <br />
              <span className="text-amber-400">{subtitle}</span>
            </h2>

            <p className="text-sm sm:text-base text-zinc-300 leading-relaxed">
              {text1}
            </p>

            <p className="text-sm text-zinc-400 leading-relaxed">
              {text2}
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
              <div className="p-4 rounded-2xl bg-zinc-900 border border-zinc-800">
                <div className="text-amber-400 font-black text-lg">Daily Fresh</div>
                <div className="text-xs text-zinc-400">Hand-kneaded dough every morning</div>
              </div>
              <div className="p-4 rounded-2xl bg-zinc-900 border border-zinc-800">
                <div className="text-amber-400 font-black text-lg">Pure Mozzarella</div>
                <div className="text-xs text-zinc-400">Zero vegetable oil or cheese analogs</div>
              </div>
              <div className="p-4 rounded-2xl bg-zinc-900 border border-zinc-800">
                <div className="text-amber-400 font-black text-lg">450°C Stone Heat</div>
                <div className="text-xs text-zinc-400">Authentic blistered artisanal crust</div>
              </div>
            </div>
          </div>

          {/* Location & Hours Card */}
          <div className="lg:col-span-5">
            <div className="bg-zinc-900/80 rounded-3xl border border-zinc-800 p-6 sm:p-8 space-y-6 shadow-xl">
              <h3 className="text-lg font-black text-white flex items-center gap-2">
                <MapPin className="w-5 h-5 text-amber-400" />
                <span>Visit & Delivery Info</span>
              </h3>

              <div className="space-y-4 text-xs text-zinc-300">
                <div className="flex items-start gap-3">
                  <MapPin className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold text-white block">Pizzeria Address</span>
                    <span className="text-zinc-400">{RESTAURANT_INFO.address}</span>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Clock className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold text-white block">Opening Timings</span>
                    <span className="text-zinc-400">{RESTAURANT_INFO.openingHours}</span>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Phone className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold text-white block">Order Hotline</span>
                    <a href={`tel:${RESTAURANT_INFO.phone}`} className="text-amber-400 hover:underline">
                      {RESTAURANT_INFO.phone} / {RESTAURANT_INFO.hotline}
                    </a>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-zinc-800/80 flex flex-col gap-2.5">
                <a
                  href={`https://wa.me/${RESTAURANT_INFO.whatsappRaw}?text=${encodeURIComponent(
                    `Hello Champs Bites Gujranwala! I want to inquire about menu and delivery.`
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-2 transition-all"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>Chat with Kitchen on WhatsApp</span>
                </a>
                <a
                  href={`tel:${RESTAURANT_INFO.phone}`}
                  className="w-full py-3 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 font-bold text-xs rounded-xl flex items-center justify-center gap-2 transition-all border border-zinc-700"
                >
                  <Phone className="w-4 h-4" />
                  <span>Call Hotline: {RESTAURANT_INFO.phone}</span>
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Testimonials */}
        <div>
          <div className="text-center max-w-xl mx-auto mb-8 space-y-1">
            <div className="text-xs font-bold uppercase tracking-wider text-amber-400">
              Customer Love
            </div>
            <h3 className="text-2xl font-black text-white">
              What Gujranwala Foodies Say
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {reviews.map((rev, idx) => (
              <div
                key={idx}
                className="bg-zinc-900/50 rounded-2xl border border-zinc-800/80 p-5 space-y-3"
              >
                <div className="flex items-center gap-1 text-amber-400">
                  {Array.from({ length: rev.rating }).map((_, i) => (
                    <Star key={i} className="w-3.5 h-3.5 fill-current" />
                  ))}
                </div>
                <p className="text-xs text-zinc-300 leading-relaxed italic">
                  "{rev.comment}"
                </p>
                <div className="pt-2 border-t border-zinc-800/80 flex items-center justify-between text-[11px]">
                  <span className="font-bold text-white">{rev.name}</span>
                  <span className="text-zinc-500">{rev.location}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

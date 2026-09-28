import React from 'react';
import { Pizza, Phone, MessageCircle, MapPin, Clock, Heart, Lock } from 'lucide-react';
import { RESTAURANT_INFO } from '../data/menuData';

interface FooterProps {
  onNavigate: (sectionId: string) => void;
  onOpenCustomizer: () => void;
  onOpenAdmin?: () => void;
  restaurantName?: string;
  phone?: string;
  whatsapp?: string;
  hours?: string;
  city?: string;
  isVisualEditMode?: boolean;
  onEditClick?: (field: string) => void;
}

export const Footer: React.FC<FooterProps> = ({
  onNavigate,
  onOpenCustomizer,
  onOpenAdmin,
  restaurantName = RESTAURANT_INFO.name,
  phone = RESTAURANT_INFO.phone,
  whatsapp = RESTAURANT_INFO.whatsappRaw,
  hours = RESTAURANT_INFO.openingHours,
  city = RESTAURANT_INFO.city,
  isVisualEditMode,
  onEditClick,
}) => {
  return (
    <footer
      onClick={() => isVisualEditMode && onEditClick?.('footer')}
      className={`bg-zinc-950 border-t border-zinc-800 text-zinc-400 text-xs pt-12 pb-24 sm:pb-12 relative transition-all ${
        isVisualEditMode
          ? 'cursor-pointer hover:ring-2 hover:ring-amber-400 hover:ring-inset'
          : ''
      }`}
    >
      {isVisualEditMode && (
        <span className="absolute left-4 top-3 bg-amber-500 text-zinc-950 text-[10px] font-black uppercase px-2 py-0.5 rounded shadow z-20">
          ✎ Edit Footer Details
        </span>
      )}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {/* Brand Info */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-500 flex items-center justify-center text-zinc-950 font-black">
                <Pizza className="w-5 h-5 stroke-[2.5]" />
              </div>
              <div>
                <div className="text-xl font-black text-white tracking-tight">{restaurantName}</div>
                <div className="text-[10px] uppercase font-bold text-amber-500 tracking-wider">
                  Artisanal Pizzeria
                </div>
              </div>
            </div>

            <p className="text-zinc-400 text-xs leading-relaxed">
              Crafting {city}'s premier stone-baked artisanal pizzas with pure whole milk mozzarella, juicy stuffed crusts, and signature local flavors.
            </p>

            <div className="text-[11px] text-zinc-500">
              Stone Hearth Baked · 100% Halal Ingredients
            </div>
          </div>

          {/* Quick Menu Links */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold text-white uppercase tracking-wider">
              Quick Navigation
            </h4>
            <ul className="space-y-2">
              <li>
                <button
                  onClick={() => onNavigate('dealsSection')}
                  className="hover:text-amber-400 transition-colors cursor-pointer"
                >
                  Special Deals & Combos
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('crownSection')}
                  className="hover:text-amber-400 transition-colors cursor-pointer"
                >
                  Signature Crown Crust
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('menuSection')}
                  className="hover:text-amber-400 transition-colors cursor-pointer"
                >
                  Full Food Menu
                </button>
              </li>
              <li>
                <button
                  onClick={onOpenCustomizer}
                  className="hover:text-amber-400 transition-colors cursor-pointer text-amber-400"
                >
                  Pizza Customizer & Crust Builder
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('aboutSection')}
                  className="hover:text-amber-400 transition-colors cursor-pointer"
                >
                  Our Story & Location
                </button>
              </li>
            </ul>
          </div>

          {/* Contact & Hotline */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold text-white uppercase tracking-wider">
              Hotline & Support
            </h4>
            <ul className="space-y-2.5">
              <li className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-amber-400 shrink-0" />
                <a href={`tel:${phone}`} className="text-white hover:text-amber-400 font-bold">
                  {phone}
                </a>
              </li>
              <li className="flex items-center gap-2">
                <MessageCircle className="w-4 h-4 text-emerald-400 shrink-0" />
                <a
                  href={`https://wa.me/${whatsapp}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-emerald-400 hover:underline font-bold"
                >
                  WhatsApp: +{whatsapp}
                </a>
              </li>
              <li className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-amber-400 shrink-0" />
                <span>{hours}</span>
              </li>
            </ul>
          </div>

          {/* Delivery & City */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold text-white uppercase tracking-wider">
              Delivery City
            </h4>
            <div className="flex items-start gap-2 text-zinc-300">
              <MapPin className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
              <div>
                <strong className="text-white block">{city}, Punjab</strong>
                <p className="text-zinc-500 text-[11px] mt-0.5">
                  Thermal delivery across Model Town, DC Colony, Wapda Town, Civil Lines, Satellite Town, and all major areas.
                </p>
              </div>
            </div>
            <div className="p-3 rounded-xl bg-zinc-900 border border-zinc-800 text-[11px] text-amber-400 font-semibold">
              🚚 Free Delivery on orders over Rs. {RESTAURANT_INFO.freeDeliveryThreshold.toLocaleString()}
            </div>
          </div>
        </div>

        {/* Bottom copyright */}
        <div className="pt-8 border-t border-zinc-900 flex flex-col sm:flex-row items-center justify-between gap-4 text-zinc-500 text-[11px]">
          <div className="flex items-center gap-3">
            <span>© {new Date().getFullYear()} {restaurantName}. All rights reserved.</span>
            {onOpenAdmin && (
              <button
                onClick={onOpenAdmin}
                className="opacity-20 hover:opacity-100 text-zinc-500 hover:text-amber-400 transition-opacity p-1 cursor-pointer flex items-center gap-1 text-[10px]"
                title="Management Access"
              >
                <Lock className="w-2.5 h-2.5" />
                <span className="hidden group-hover:inline">Staff</span>
              </button>
            )}
          </div>
          <div className="flex items-center gap-1">
            <span>Crafted with</span>
            <Heart className="w-3 h-3 text-red-500 fill-current" />
            <span>for pizza connoisseurs in {RESTAURANT_INFO.city}</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

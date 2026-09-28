import React, { useState } from 'react';
import { ShoppingBag, MessageCircle, Menu as MenuIcon, X, Pizza, ShieldCheck } from 'lucide-react';
import { RESTAURANT_INFO } from '../data/menuData';

interface NavbarProps {
  cartCount: number;
  cartTotal: number;
  onOpenCart: () => void;
  onOpenCustomizer: () => void;
  onOpenAdmin?: () => void;
  restaurantName?: string;
  tagline?: string;
  isVisualEditMode?: boolean;
  onEditClick?: (field: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  cartCount,
  cartTotal,
  onOpenCart,
  onOpenCustomizer,
  onOpenAdmin,
  restaurantName = RESTAURANT_INFO.name,
  tagline = 'Artisanal Pizzeria',
  isVisualEditMode,
  onEditClick,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const scrollTo = (id: string) => {
    setMobileMenuOpen(false);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const openWhatsApp = () => {
    const text = encodeURIComponent(
      `Hello ${RESTAURANT_INFO.name} (${RESTAURANT_INFO.city})! I want to view the menu and place an order.`
    );
    window.open(`https://wa.me/${RESTAURANT_INFO.whatsappRaw}?text=${text}`, '_blank');
  };

  return (
    <header className="sticky top-0 z-40 bg-zinc-950/90 backdrop-blur-md border-b border-zinc-800 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-4">
        {/* Zone 1: Wordmark */}
        <div className="flex items-center gap-2">
          <a
            href="#"
            onClick={(e) => {
              e.preventDefault();
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="flex items-center gap-3 group focus-visible:outline-none"
          >
            <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-amber-500 to-amber-600 flex items-center justify-center shadow-lg shadow-amber-500/20 group-hover:scale-105 transition-transform">
              <Pizza className="w-6 h-6 text-zinc-950 stroke-[2.5]" />
            </div>
            <div>
              <div className="text-xl sm:text-2xl font-black tracking-tight text-white group-hover:text-amber-400 transition-colors">
                {restaurantName}
              </div>
              <div className="text-[10px] uppercase tracking-widest text-amber-500 font-bold -mt-1">
                {tagline}
              </div>
            </div>
          </a>

          {isVisualEditMode && (
            <button
              onClick={() => onEditClick?.('navbar')}
              className="ml-2 px-2 py-0.5 rounded bg-amber-500 text-zinc-950 text-[10px] font-black uppercase hover:bg-amber-400 shadow cursor-pointer"
            >
              ✎ Edit Name
            </button>
          )}
        </div>

        {/* Zone 2: Navigation Links */}
        <nav className="hidden lg:flex items-center gap-8 text-sm font-medium text-zinc-300">
          <button
            onClick={() => scrollTo('dealsSection')}
            className="hover:text-amber-400 transition-colors cursor-pointer"
          >
            Special Deals
          </button>
          <button
            onClick={() => scrollTo('crownSection')}
            className="hover:text-amber-400 transition-colors cursor-pointer"
          >
            Crown Crust
          </button>
          <button
            onClick={() => scrollTo('menuSection')}
            className="hover:text-amber-400 transition-colors cursor-pointer"
          >
            Full Menu
          </button>
          <button
            onClick={onOpenCustomizer}
            className="hover:text-amber-400 transition-colors cursor-pointer text-amber-400 font-semibold flex items-center gap-1.5"
          >
            <Pizza className="w-4 h-4 text-amber-400" />
            Build Pizza
          </button>
          <button
            onClick={() => scrollTo('aboutSection')}
            className="hover:text-amber-400 transition-colors cursor-pointer"
          >
            Our Story & Gujranwala
          </button>
        </nav>

        {/* Zone 3: Primary Actions */}
        <div className="flex items-center gap-3">
          {/* WhatsApp Direct Hotline */}
          <button
            onClick={openWhatsApp}
            className="hidden sm:flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold px-3.5 py-2.5 rounded-xl transition-all shadow-md shadow-emerald-950 active:scale-95 cursor-pointer whitespace-nowrap"
            title="Chat on WhatsApp"
          >
            <MessageCircle className="w-4 h-4 fill-current" />
            <span>WhatsApp Order</span>
          </button>

          {/* Cart Trigger */}
          <button
            onClick={onOpenCart}
            className="relative flex items-center gap-2.5 bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 hover:border-amber-500/50 text-white px-3.5 py-2.5 rounded-xl transition-all active:scale-95 cursor-pointer"
            aria-label="View Shopping Cart"
          >
            <div className="relative">
              <ShoppingBag className="w-5 h-5 text-amber-400" />
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-600 text-white font-black text-[11px] min-w-[20px] h-[20px] px-1 rounded-full flex items-center justify-center shadow-md animate-pulse">
                  {cartCount}
                </span>
              )}
            </div>
            <div className="text-left hidden sm:block">
              <div className="text-[10px] text-zinc-400 leading-tight uppercase font-semibold">Your Bag</div>
              <div className="text-xs font-bold text-amber-400 tabular-nums">
                Rs. {cartTotal.toLocaleString()}
              </div>
            </div>
          </button>

          {/* Mobile hamburger */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 text-zinc-400 hover:text-white rounded-lg hover:bg-zinc-900 transition-colors"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <MenuIcon className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-zinc-950/95 border-b border-zinc-800 px-4 pt-3 pb-6 space-y-3">
          <button
            onClick={() => scrollTo('dealsSection')}
            className="block w-full text-left py-2 text-sm font-semibold text-zinc-200 hover:text-amber-400"
          >
            🔥 Special Deals & Combos
          </button>
          <button
            onClick={() => scrollTo('crownSection')}
            className="block w-full text-left py-2 text-sm font-semibold text-zinc-200 hover:text-amber-400"
          >
            👑 Crown Crust Pizza
          </button>
          <button
            onClick={() => scrollTo('menuSection')}
            className="block w-full text-left py-2 text-sm font-semibold text-zinc-200 hover:text-amber-400"
          >
            📋 Full Artisanal Menu
          </button>
          <button
            onClick={() => {
              setMobileMenuOpen(false);
              onOpenCustomizer();
            }}
            className="block w-full text-left py-2 text-sm font-semibold text-amber-400 flex items-center gap-2"
          >
            <Pizza className="w-4 h-4" />
            🍕 Build Your Custom Pizza
          </button>
          <button
            onClick={() => scrollTo('aboutSection')}
            className="block w-full text-left py-2 text-sm font-semibold text-zinc-200 hover:text-amber-400"
          >
            📍 Story, Timings & Gujranwala Location
          </button>

          <div className="pt-2 border-t border-zinc-800 flex gap-2">
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                openWhatsApp();
              }}
              className="flex-1 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs py-2.5 rounded-xl flex items-center justify-center gap-2"
            >
              <MessageCircle className="w-4 h-4" />
              WhatsApp Hotline
            </button>
            <a
              href={`tel:${RESTAURANT_INFO.phone}`}
              className="flex-1 bg-zinc-900 border border-zinc-800 text-zinc-200 font-bold text-xs py-2.5 rounded-xl flex items-center justify-center"
            >
              Call {RESTAURANT_INFO.phone}
            </a>
          </div>
        </div>
      )}
    </header>
  );
};

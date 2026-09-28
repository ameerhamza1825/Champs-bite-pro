import React from 'react';
import { ShoppingBag, MessageCircle, ListOrdered, ArrowRight } from 'lucide-react';
import { CartItem } from '../types';
import { RESTAURANT_INFO } from '../data/menuData';

interface FloatingBottomBarProps {
  cart: CartItem[];
  onOpenCart: () => void;
  onQuickWhatsApp: () => void;
}

export const FloatingBottomBar: React.FC<FloatingBottomBarProps> = ({
  cart,
  onOpenCart,
  onQuickWhatsApp,
}) => {
  const totalCount = cart.reduce((acc, item) => acc + item.quantity, 0);
  const subtotal = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);

  if (totalCount === 0) {
    return (
      <div className="fixed bottom-5 right-5 z-30 pointer-events-none">
        <a
          href={`https://wa.me/${RESTAURANT_INFO.whatsappRaw}?text=${encodeURIComponent(
            `Hi ${RESTAURANT_INFO.name} (${RESTAURANT_INFO.city})! I want to check the menu and order.`
          )}`}
          target="_blank"
          rel="noopener noreferrer"
          className="pointer-events-auto bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-500 hover:to-emerald-400 text-white px-4 py-2.5 rounded-full shadow-2xl shadow-emerald-950/70 flex items-center gap-2 text-xs font-black transition-all transform hover:-translate-y-0.5 active:scale-95 border border-emerald-400/30 group cursor-pointer"
        >
          <MessageCircle className="w-4 h-4 fill-current group-hover:scale-110 transition-transform" />
          <span>WhatsApp Order</span>
        </a>
      </div>
    );
  }

  return (
    <div className="fixed bottom-3 inset-x-3 sm:inset-x-auto sm:right-6 sm:bottom-6 z-30 sm:max-w-md pointer-events-none">
      <div className="pointer-events-auto bg-zinc-950/95 backdrop-blur-md border border-amber-500/40 rounded-2xl shadow-2xl p-2.5 sm:p-3 flex items-center justify-between gap-3 text-white">
        {/* Left summary click */}
        <div
          onClick={onOpenCart}
          className="flex items-center gap-2.5 cursor-pointer pl-1 group"
        >
          <div className="relative w-9 h-9 rounded-xl bg-amber-500 text-zinc-950 flex items-center justify-center font-bold">
            <ShoppingBag className="w-4 h-4" />
            <span className="absolute -top-1.5 -right-1.5 bg-red-600 text-white font-black text-[10px] w-4 h-4 rounded-full flex items-center justify-center">
              {totalCount}
            </span>
          </div>

          <div>
            <div className="text-[10px] text-zinc-400 uppercase font-bold tracking-wider leading-none">
              Bag Total
            </div>
            <div className="text-sm font-black text-amber-400 tabular-nums font-heading">
              Rs. {subtotal.toLocaleString()}
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-1.5">
          <button
            onClick={onOpenCart}
            className="hidden sm:flex items-center gap-1 bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-300 px-3 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer"
          >
            <ListOrdered className="w-3.5 h-3.5" />
            <span>View Bag</span>
          </button>

          <button
            onClick={onQuickWhatsApp}
            className="bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-black px-3.5 py-2 rounded-xl transition-all shadow-md shadow-emerald-950 flex items-center gap-1.5 active:scale-95 cursor-pointer whitespace-nowrap"
          >
            <span>BUY NOW</span>
            <MessageCircle className="w-3.5 h-3.5 fill-current" />
          </button>
        </div>
      </div>
    </div>
  );
};

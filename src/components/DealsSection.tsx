import React, { useState } from 'react';
import { Flame, Check, Plus, MessageCircle, Sparkles } from 'lucide-react';
import { DEALS, RESTAURANT_INFO } from '../data/menuData';
import { DealItem, CartItem } from '../types';

interface DealsSectionProps {
  onAddDealToCart: (deal: DealItem) => void;
}

export const DealsSection: React.FC<DealsSectionProps> = ({ onAddDealToCart }) => {
  const [activeTab, setActiveTab] = useState<'all' | 'mega' | 'burger' | 'starter'>('all');
  const [addedDealId, setAddedDealId] = useState<string | null>(null);

  const filteredDeals =
    activeTab === 'all' ? DEALS : DEALS.filter((d) => d.type === activeTab);

  const handleAddDeal = (deal: DealItem) => {
    onAddDealToCart(deal);
    setAddedDealId(deal.id);
    setTimeout(() => {
      setAddedDealId(null);
    }, 1500);
  };

  const handleWhatsAppOrderDeal = (deal: DealItem) => {
    const text = encodeURIComponent(
      `Hello ${RESTAURANT_INFO.name}! I would like to order this deal:\n\n*${deal.name}*\n• Includes: ${deal.items.join(', ')}\n• Price: *Rs. ${deal.price.toLocaleString()}*\n\nPlease confirm delivery in ${RESTAURANT_INFO.city}.`
    );
    window.open(`https://wa.me/${RESTAURANT_INFO.whatsappRaw}?text=${text}`, '_blank');
  };

  return (
    <section id="dealsSection" className="py-16 bg-zinc-950 scroll-mt-20 border-b border-zinc-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-10 space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-600/10 border border-red-500/20 text-red-400 text-xs font-bold uppercase tracking-wider">
            <Flame className="w-3.5 h-3.5 text-red-500 animate-pulse" />
            Special Deals & Combos
          </div>
          <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
            Unbeatable Value Combos
          </h2>
          <p className="text-sm sm:text-base text-zinc-400">
            Handpicked family feasts, burger boxes, and appetizer platters at massive savings
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center justify-center gap-2 mb-10 overflow-x-auto pb-2">
          <div className="inline-flex p-1 bg-zinc-900 border border-zinc-800 rounded-2xl">
            <button
              onClick={() => setActiveTab('all')}
              className={`px-4 py-2 text-xs sm:text-sm font-bold rounded-xl transition-all whitespace-nowrap cursor-pointer ${
                activeTab === 'all'
                  ? 'bg-amber-500 text-zinc-950 shadow-md shadow-amber-500/20'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              All Combos ({DEALS.length})
            </button>
            <button
              onClick={() => setActiveTab('mega')}
              className={`px-4 py-2 text-xs sm:text-sm font-bold rounded-xl transition-all whitespace-nowrap cursor-pointer ${
                activeTab === 'mega'
                  ? 'bg-amber-500 text-zinc-950 shadow-md shadow-amber-500/20'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              🍕 Mega Pizza Feasts
            </button>
            <button
              onClick={() => setActiveTab('burger')}
              className={`px-4 py-2 text-xs sm:text-sm font-bold rounded-xl transition-all whitespace-nowrap cursor-pointer ${
                activeTab === 'burger'
                  ? 'bg-amber-500 text-zinc-950 shadow-md shadow-amber-500/20'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              🍔 Value Burger Deals
            </button>
            <button
              onClick={() => setActiveTab('starter')}
              className={`px-4 py-2 text-xs sm:text-sm font-bold rounded-xl transition-all whitespace-nowrap cursor-pointer ${
                activeTab === 'starter'
                  ? 'bg-amber-500 text-zinc-950 shadow-md shadow-amber-500/20'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              🍟 Starters & Snacks
            </button>
          </div>
        </div>

        {/* Deals Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredDeals.map((deal) => {
            const isAdded = addedDealId === deal.id;

            return (
              <div
                key={deal.id}
                className="group relative bg-zinc-900/60 rounded-3xl border border-zinc-800 hover:border-amber-500/40 p-6 flex flex-col justify-between transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-black/50"
              >
                <div>
                  {/* Top Tag */}
                  <div className="flex items-center justify-between gap-2 mb-4">
                    {deal.tag && (
                      <span className="text-[11px] font-black uppercase tracking-wider px-2.5 py-1 rounded-lg bg-red-600/20 border border-red-500/30 text-red-400">
                        {deal.tag}
                      </span>
                    )}
                    {deal.saveAmount && (
                      <span className="text-xs font-bold text-emerald-400">
                        Save Rs. {deal.saveAmount}
                      </span>
                    )}
                  </div>

                  {/* Title */}
                  <h3 className="text-lg font-black text-white group-hover:text-amber-400 transition-colors mb-3">
                    {deal.name}
                  </h3>

                  {/* Included Items */}
                  <div className="space-y-2 mb-6">
                    <div className="text-[11px] uppercase tracking-wider text-zinc-500 font-bold">
                      What's Included:
                    </div>
                    <ul className="space-y-1.5">
                      {deal.items.map((item, idx) => (
                        <li key={idx} className="text-xs text-zinc-300 flex items-start gap-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-amber-400 mt-1.5 shrink-0" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Bottom Pricing & CTAs */}
                <div className="pt-4 border-t border-zinc-800/80">
                  <div className="flex items-baseline justify-between mb-4">
                    <div>
                      <div className="text-[11px] text-zinc-400">Deal Price</div>
                      <div className="flex items-baseline gap-2">
                        <span className="text-2xl font-black text-amber-400 tabular-nums font-heading">
                          Rs. {deal.price.toLocaleString()}
                        </span>
                        {deal.oldPrice && (
                          <span className="text-xs text-zinc-500 line-through tabular-nums">
                            Rs. {deal.oldPrice.toLocaleString()}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={() => handleAddDeal(deal)}
                      className={`w-full py-2.5 px-3 rounded-xl text-xs font-black transition-all flex items-center justify-center gap-1.5 cursor-pointer active:scale-95 ${
                        isAdded
                          ? 'bg-emerald-600 text-white'
                          : 'bg-amber-500 hover:bg-amber-400 text-zinc-950'
                      }`}
                    >
                      {isAdded ? (
                        <>
                          <Check className="w-4 h-4 stroke-[3]" />
                          <span>Added!</span>
                        </>
                      ) : (
                        <>
                          <Plus className="w-4 h-4 stroke-[3]" />
                          <span>Add to Bag</span>
                        </>
                      )}
                    </button>

                    <button
                      onClick={() => handleWhatsAppOrderDeal(deal)}
                      className="w-full py-2.5 px-3 rounded-xl text-xs font-bold bg-zinc-800 hover:bg-emerald-600/30 border border-zinc-700 hover:border-emerald-500/40 text-zinc-200 hover:text-emerald-400 transition-all flex items-center justify-center gap-1.5 cursor-pointer active:scale-95"
                      title="Direct order this deal on WhatsApp"
                    >
                      <MessageCircle className="w-3.5 h-3.5" />
                      <span>WhatsApp</span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

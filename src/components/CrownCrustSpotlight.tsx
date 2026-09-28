import React, { useState } from 'react';
import { Crown, Check, Plus, Sparkles, MessageCircle } from 'lucide-react';
import { IMAGES, RESTAURANT_INFO } from '../data/menuData';
import { CartItem } from '../types';

interface CrownCrustSpotlightProps {
  onAddToCart: (item: CartItem) => void;
}

export const CrownCrustSpotlight: React.FC<CrownCrustSpotlightProps> = ({ onAddToCart }) => {
  const [selectedSize, setSelectedSize] = useState<'Medium (9")' | 'Large (12")' | 'X-Large (15")'>('Large (12")');
  const [selectedPocket, setSelectedPocket] = useState<'Kabab Pockets' | 'Cheese Pockets'>('Kabab Pockets');
  const [selectedFlavor, setSelectedFlavor] = useState('Malai Boti');
  const [isAdded, setIsAdded] = useState(false);

  const priceMap: Record<string, number> = {
    'Medium (9")': 1150,
    'Large (12")': 1550,
    'X-Large (15")': 2450,
  };

  const currentPrice = priceMap[selectedSize];

  const handleAddCrown = () => {
    const item: CartItem = {
      cartItemId: `crown-${Date.now()}`,
      name: 'Crown Crust Special Pizza',
      details: `${selectedSize} • ${selectedPocket} • Topping: ${selectedFlavor}`,
      price: currentPrice,
      quantity: 1,
      image: IMAGES.crownCrust,
      selectedSize,
      selectedCrust: selectedPocket,
    };
    onAddToCart(item);
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 1500);
  };

  const handleDirectWhatsApp = () => {
    const text = encodeURIComponent(
      `Hello ${RESTAURANT_INFO.name}! I would like to order the Signature Crown Crust Pizza:\n\n*Crown Crust Special Pizza*\n• Size: ${selectedSize}\n• Stuffing: ${selectedPocket}\n• Flavor: ${selectedFlavor}\n• Total: *Rs. ${currentPrice.toLocaleString()}*\n\nPlease confirm my order for Gujranwala.`
    );
    window.open(`https://wa.me/${RESTAURANT_INFO.whatsappRaw}?text=${text}`, '_blank');
  };

  return (
    <section id="crownSection" className="py-16 bg-gradient-to-b from-zinc-950 via-zinc-900 to-zinc-950 border-b border-zinc-800/80 scroll-mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-zinc-950/80 rounded-3xl border border-amber-500/30 overflow-hidden shadow-2xl p-6 sm:p-10 lg:p-12 relative">
          {/* Background aura */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            {/* Left: Visual Image */}
            <div className="lg:col-span-5 order-2 lg:order-1">
              <div className="relative rounded-2xl overflow-hidden border border-zinc-800 shadow-xl group">
                <img
                  src={IMAGES.crownCrust}
                  alt="Crown Crust Special Pizza with stuffed kabab pockets"
                  className="w-full aspect-[4/3] object-cover group-hover:scale-105 transition-transform duration-500"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute top-3 left-3 bg-amber-500 text-zinc-950 text-xs font-black px-3 py-1 rounded-full flex items-center gap-1 shadow-lg">
                  <Crown className="w-3.5 h-3.5 fill-current" />
                  <span>Signature Creation</span>
                </div>
              </div>
            </div>

            {/* Right: Customization Controls */}
            <div className="lg:col-span-7 order-1 lg:order-2 space-y-6">
              <div>
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-bold uppercase tracking-wider mb-2">
                  <Crown className="w-3.5 h-3.5 text-amber-400" />
                  The Legendary Crown Crust
                </div>
                <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
                  Crown Crust Special Pizza
                </h2>
                <p className="text-sm text-zinc-400 mt-2 leading-relaxed">
                  Our iconic royal crust featuring golden petal pockets generously stuffed with either tender seekh kabab chunks or molten whole milk mozzarella cheese.
                </p>
              </div>

              {/* Size Selector */}
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-zinc-400">
                  Select Size
                </label>
                <div className="grid grid-cols-3 gap-2.5">
                  {(['Medium (9")', 'Large (12")', 'X-Large (15")'] as const).map((size) => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                        selectedSize === size
                          ? 'bg-amber-500/10 border-amber-500 text-white'
                          : 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:border-zinc-700'
                      }`}
                    >
                      <div className="text-xs font-bold text-white">{size}</div>
                      <div className="text-xs font-black text-amber-400 tabular-nums">
                        Rs. {priceMap[size].toLocaleString()}
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Stuffing Option */}
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-zinc-400">
                  Choose Crown Pocket Stuffing
                </label>
                <div className="grid grid-cols-2 gap-2.5">
                  {(['Kabab Pockets', 'Cheese Pockets'] as const).map((pocket) => (
                    <button
                      key={pocket}
                      onClick={() => setSelectedPocket(pocket)}
                      className={`p-3 rounded-xl border text-center transition-all cursor-pointer ${
                        selectedPocket === pocket
                          ? 'bg-amber-500 text-zinc-950 font-black border-amber-500'
                          : 'bg-zinc-900 border-zinc-800 text-zinc-300 font-bold hover:border-zinc-700'
                      }`}
                    >
                      <span className="text-xs">{pocket === 'Kabab Pockets' ? '🍢 Seekh Kabab Pockets' : '🧀 Molten Cheese Pockets'}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Flavor Topping */}
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-zinc-400">
                  Center Pizza Flavor
                </label>
                <div className="flex flex-wrap gap-2">
                  {['Malai Boti', 'Chicken Tikka', 'Chicken Fajita', 'Afghani Feast'].map((flv) => (
                    <button
                      key={flv}
                      onClick={() => setSelectedFlavor(flv)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                        selectedFlavor === flv
                          ? 'bg-zinc-100 text-zinc-950'
                          : 'bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white'
                      }`}
                    >
                      {flv}
                    </button>
                  ))}
                </div>
              </div>

              {/* Price and CTA */}
              <div className="pt-4 border-t border-zinc-800 flex flex-wrap items-center justify-between gap-4">
                <div>
                  <div className="text-xs text-zinc-400">Crown Pizza Price</div>
                  <div className="text-2xl font-black text-amber-400 tabular-nums font-heading">
                    Rs. {currentPrice.toLocaleString()}
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <button
                    onClick={handleAddCrown}
                    className={`py-3 px-5 rounded-xl text-xs font-black transition-all flex items-center gap-2 cursor-pointer active:scale-95 ${
                      isAdded
                        ? 'bg-emerald-600 text-white'
                        : 'bg-amber-500 hover:bg-amber-400 text-zinc-950 shadow-lg shadow-amber-500/20'
                    }`}
                  >
                    {isAdded ? (
                      <>
                        <Check className="w-4 h-4 stroke-[3]" />
                        <span>Added to Bag!</span>
                      </>
                    ) : (
                      <>
                        <Plus className="w-4 h-4 stroke-[3]" />
                        <span>Add Crown Pizza to Bag</span>
                      </>
                    )}
                  </button>

                  <button
                    onClick={handleDirectWhatsApp}
                    className="p-3 bg-zinc-900 hover:bg-emerald-600/30 border border-zinc-700 hover:border-emerald-500/40 text-emerald-400 rounded-xl transition-all"
                    title="Order Crown Pizza on WhatsApp"
                  >
                    <MessageCircle className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

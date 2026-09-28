import React, { useState } from 'react';
import { Plus, Check, Flame, Pizza, Sparkles, SlidersHorizontal, Leaf } from 'lucide-react';
import { MenuItem, CartItem, PizzaSizeKey } from '../types';
import { PIZZA_SIZES } from '../data/menuData';

interface ProductCardProps {
  item: MenuItem;
  onAddToCart: (item: CartItem) => void;
  onOpenCustomizer: (item: MenuItem, size?: PizzaSizeKey) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  item,
  onAddToCart,
  onOpenCustomizer,
}) => {
  const [selectedSize, setSelectedSize] = useState<PizzaSizeKey>('medium');
  const [isAdded, setIsAdded] = useState(false);
  const [imgError, setImgError] = useState(false);

  const isPizza = item.isPizza && item.prices;
  const currentPrice = isPizza
    ? item.prices![selectedSize]
    : item.price || (item.variants ? item.variants[0].price : 0);

  const handleQuickAdd = () => {
    let details = '';
    if (isPizza) {
      details = `Size: ${PIZZA_SIZES[selectedSize].name} (${PIZZA_SIZES[selectedSize].inches}) • Classic Pan Crust`;
    }

    const cartItem: CartItem = {
      cartItemId: `${item.id}-${isPizza ? selectedSize : 'std'}-${Date.now()}`,
      menuItemId: item.id,
      name: item.name,
      details,
      price: currentPrice,
      quantity: 1,
      image: item.image,
      selectedSize: isPizza ? selectedSize : undefined,
    };

    onAddToCart(cartItem);
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 1200);
  };

  return (
    <div className="group bg-zinc-900/60 rounded-3xl border border-zinc-800/80 hover:border-amber-500/40 overflow-hidden flex flex-col justify-between transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-black/40">
      <div>
        {/* Card Image */}
        <div className="relative aspect-[4/3] bg-zinc-950 overflow-hidden">
          {!imgError ? (
            <img
              src={item.image}
              alt={item.name}
              onError={() => setImgError(true)}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              referrerPolicy="no-referrer"
            />
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-zinc-900 to-zinc-950 p-4 text-center">
              <Pizza className="w-10 h-10 text-amber-500/40 mb-2" />
              <span className="text-xs font-bold text-zinc-400">{item.name}</span>
            </div>
          )}

          {/* Scrim */}
          <div className="absolute inset-0 bg-gradient-to-t from-zinc-950/80 via-transparent to-transparent" />

          {/* Badges */}
          <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
            {item.badge && (
              <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-md bg-amber-500 text-zinc-950 shadow-md">
                {item.badge}
              </span>
            )}
            {item.isSpicy && (
              <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-md bg-red-600/80 text-white flex items-center gap-0.5">
                <Flame className="w-3 h-3 text-yellow-300 fill-current" />
                Spicy
              </span>
            )}
            {item.isVegetarian && (
              <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-md bg-emerald-700/80 text-white flex items-center gap-0.5">
                <Leaf className="w-3 h-3" />
                Veg
              </span>
            )}
          </div>
        </div>

        {/* Card Content */}
        <div className="p-5 space-y-3">
          <div className="flex items-start justify-between gap-2">
            <h3 className="text-base font-bold text-white group-hover:text-amber-400 transition-colors">
              {item.name}
            </h3>
          </div>

          <p className="text-xs text-zinc-400 leading-relaxed line-clamp-2">
            {item.description}
          </p>

          {/* Size Selector for Pizzas */}
          {isPizza && (
            <div className="pt-2">
              <div className="text-[11px] uppercase tracking-wider text-zinc-500 font-semibold mb-1.5">
                Select Size:
              </div>
              <div className="grid grid-cols-4 gap-1 p-1 bg-zinc-950/80 rounded-xl border border-zinc-800">
                {(['small', 'medium', 'large', 'xl'] as PizzaSizeKey[]).map((sz) => (
                  <button
                    key={sz}
                    onClick={() => setSelectedSize(sz)}
                    className={`py-1 text-[11px] font-bold rounded-lg transition-all cursor-pointer ${
                      selectedSize === sz
                        ? 'bg-amber-500 text-zinc-950 shadow-sm'
                        : 'text-zinc-400 hover:text-white'
                    }`}
                  >
                    {sz === 'small' ? 'S 6"' : sz === 'medium' ? 'M 9"' : sz === 'large' ? 'L 12"' : 'XL 15"'}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Footer / Price & Action */}
      <div className="p-5 pt-0">
        <div className="pt-3 border-t border-zinc-800/80 flex items-center justify-between gap-2">
          <div>
            <div className="text-[10px] text-zinc-500 uppercase font-medium">Price</div>
            <div className="text-lg font-black text-amber-400 tabular-nums font-heading">
              Rs. {currentPrice.toLocaleString()}
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            {isPizza && (
              <button
                onClick={() => onOpenCustomizer(item, selectedSize)}
                className="p-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-300 hover:text-white border border-zinc-700 transition-colors cursor-pointer"
                title="Customize crust & toppings"
              >
                <SlidersHorizontal className="w-4 h-4" />
              </button>
            )}

            <button
              onClick={handleQuickAdd}
              className={`py-2 px-3.5 rounded-xl text-xs font-black transition-all flex items-center gap-1.5 cursor-pointer active:scale-95 ${
                isAdded
                  ? 'bg-emerald-600 text-white'
                  : 'bg-amber-500 hover:bg-amber-400 text-zinc-950 shadow-md shadow-amber-500/10'
              }`}
            >
              {isAdded ? (
                <>
                  <Check className="w-3.5 h-3.5 stroke-[3]" />
                  <span>Added</span>
                </>
              ) : (
                <>
                  <Plus className="w-3.5 h-3.5 stroke-[3]" />
                  <span>Add</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

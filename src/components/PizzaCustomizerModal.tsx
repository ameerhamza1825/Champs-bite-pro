import React, { useState, useEffect } from 'react';
import { X, Pizza, Check, Plus, Minus, Sparkles, Flame } from 'lucide-react';
import { PIZZA_SIZES, CRUST_OPTIONS, MENU_ITEMS } from '../data/menuData';
import { MenuItem, CartItem, PizzaSizeKey } from '../types';
import { parseSecureAiResponse, AiUpsellResponse } from '../utils/aiParser';
import { getStoredMenuItems } from '../utils/menuStorage';

const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

interface PizzaCustomizerModalProps {
  initialItem?: MenuItem | null;
  initialSize?: PizzaSizeKey;
  isOpen: boolean;
  onClose: () => void;
  onAddToCart: (item: CartItem) => void;
}

export const PizzaCustomizerModal: React.FC<PizzaCustomizerModalProps> = ({
  initialItem,
  initialSize = 'medium',
  isOpen,
  onClose,
  onAddToCart,
}) => {
  if (!isOpen) return null;

  const allItems = getStoredMenuItems();
  const pizzaItems = allItems.filter((item) => item.isPizza && item.prices);
  const [selectedItemId, setSelectedItemId] = useState<string>(
    initialItem && initialItem.isPizza ? initialItem.id : (pizzaItems[0]?.id || 'ult-1')
  );
  const [selectedSize, setSelectedSize] = useState<PizzaSizeKey>(initialSize);
  const [selectedCrustId, setSelectedCrustId] = useState<string>('classic');
  const [extraCheese, setExtraCheese] = useState<boolean>(false);
  const [extraToppings, setExtraToppings] = useState<boolean>(false);
  const [extraDip, setExtraDip] = useState<boolean>(false);
  const [quantity, setQuantity] = useState<number>(1);
  const [smartPairing, setSmartPairing] = useState<AiUpsellResponse | null>(null);

  const currentItem = pizzaItems.find((p) => p.id === selectedItemId) || pizzaItems[0];
  const sizeConfig = PIZZA_SIZES[selectedSize];
  const crustConfig = CRUST_OPTIONS.find((c) => c.id === selectedCrustId) || CRUST_OPTIONS[0];

  // Evaluate smart pairing on flavor / size / crust change
  useEffect(() => {
    if (!currentItem) return;

    // Simulate backend response payload that might come truncated or complete
    let mockResponse = '';
    const isMeatHeavy =
      /tikka|fajita|boti|kabab|supreme|flame/i.test(currentItem.name) ||
      /chicken|beef|meat/i.test(currentItem.description);

    if (isMeatHeavy) {
      mockResponse = `{"status": "success", "suggested_addon": "Signature Garlic Mayo Dip", "response_message": "Pair the bold, smoky spices of ${currentItem.name} with our whipped garlic mayo dip to perfectly balance the charred stone-hearth flavor.", "data_payload": { "price_impact_rs": 80 } }`;
    } else if (selectedSize === 'small' || selectedSize === 'medium') {
      mockResponse = `{"status": "success", "suggested_addon": "Upgrade to Large 12\\" Pizza", "response_message": "Foodie Tip: Upgrading to Large doubles your pizza slice surface area for maximum melted cheese pull and sharing joy!", "data_payload": { "price_impact_rs": 450 } }`;
    } else {
      mockResponse = `{"status": "success", "suggested_addon": "Signature Garlic Mayo Dip", "response_message": "Pair that blistered, oven-charred crust with our handcrafted chilled garlic dip for ultimate flavor!", "data_payload": { "price_impact_rs": 80 } }`;
    }

    const parsed = parseSecureAiResponse(mockResponse);
    setSmartPairing(parsed);
  }, [currentItem, selectedSize, selectedCrustId]);

  // Calculate price
  const basePrice = (currentItem?.prices && currentItem.prices[selectedSize]) || 850;
  const crustPrice = crustConfig.priceModifier[selectedSize] || 0;
  const cheesePrice = extraCheese ? 150 : 0;
  const toppingsPrice = extraToppings ? 100 : 0;
  const dipPrice = extraDip ? 80 : 0;

  const unitPrice = basePrice + crustPrice + cheesePrice + toppingsPrice + dipPrice;
  const totalPrice = unitPrice * quantity;

  const handleAdd = () => {
    const addonsList: string[] = [];
    if (extraCheese) addonsList.push('Extra Mozzarella (+Rs. 150)');
    if (extraToppings) addonsList.push('Extra Toppings (+Rs. 100)');
    if (extraDip) addonsList.push('Garlic Mayo Dip (+Rs. 80)');

    const detailsArr = [
      `Size: ${sizeConfig.name} (${sizeConfig.inches})`,
      `Crust: ${crustConfig.name}`,
    ];
    if (addonsList.length > 0) {
      detailsArr.push(addonsList.join(', '));
    }

    const item: CartItem = {
      cartItemId: `custom-pizza-${Date.now()}`,
      menuItemId: currentItem.id,
      name: `${currentItem.name} (Customized)`,
      details: detailsArr.join(' • '),
      price: unitPrice,
      quantity,
      image: currentItem.image,
      selectedSize: sizeConfig.name,
      selectedCrust: crustConfig.name,
      selectedAddons: addonsList,
    };

    onAddToCart(item);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-zinc-900 border border-zinc-700/80 rounded-3xl shadow-2xl overflow-hidden my-8 max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="p-5 border-b border-zinc-800 flex items-center justify-between bg-zinc-950">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center">
              <Pizza className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-black text-white">Artisanal Pizza Builder</h3>
              <p className="text-xs text-zinc-400">Craft your custom stone-baked pizza</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-zinc-400 hover:text-white rounded-xl hover:bg-zinc-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Body */}
        <div className="p-6 overflow-y-auto space-y-6">
          {/* Step 1: Select Flavor */}
          <div className="space-y-2.5">
            <label className="text-xs font-bold uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
              <span>1. Choose Pizza Flavor</span>
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {pizzaItems.map((pizza) => (
                <button
                  key={pizza.id}
                  onClick={() => setSelectedItemId(pizza.id)}
                  className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                    selectedItemId === pizza.id
                      ? 'bg-amber-500/10 border-amber-500 text-white shadow-sm'
                      : 'bg-zinc-950 border-zinc-800 text-zinc-400 hover:border-zinc-700'
                  }`}
                >
                  <div className="text-xs font-bold text-white truncate">{pizza.name}</div>
                  <div className="text-[10px] text-zinc-400 capitalize">{pizza.category}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Step 2: Select Size */}
          <div className="space-y-2.5">
            <label className="text-xs font-bold uppercase tracking-wider text-amber-400">
              2. Choose Size
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              {(Object.keys(PIZZA_SIZES) as PizzaSizeKey[]).map((key) => {
                const sz = PIZZA_SIZES[key];
                const baseP = currentItem?.prices ? currentItem.prices[key] : 800;
                return (
                  <button
                    key={key}
                    onClick={() => setSelectedSize(key)}
                    className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                      selectedSize === key
                        ? 'bg-amber-500 text-zinc-950 font-black border-amber-500 shadow-lg shadow-amber-500/10'
                        : 'bg-zinc-950 border-zinc-800 text-zinc-400 hover:border-zinc-700'
                    }`}
                  >
                    <div className="text-xs font-bold">{sz.name}</div>
                    <div className="text-[10px] opacity-80">{sz.inches} · {sz.slices} sl</div>
                    <div className="text-xs font-black mt-1 tabular-nums">
                      Rs. {baseP.toLocaleString()}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Step 3: Choose Crust */}
          <div className="space-y-2.5">
            <label className="text-xs font-bold uppercase tracking-wider text-amber-400">
              3. Choose Crust Style
            </label>
            <div className="space-y-2">
              {CRUST_OPTIONS.map((crust) => {
                const addFee = crust.priceModifier[selectedSize];
                const isSelected = selectedCrustId === crust.id;
                return (
                  <button
                    key={crust.id}
                    onClick={() => setSelectedCrustId(crust.id)}
                    className={`w-full p-3 rounded-xl border text-left flex items-center justify-between transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-amber-500/10 border-amber-500 text-white'
                        : 'bg-zinc-950 border-zinc-800 text-zinc-400 hover:border-zinc-700'
                    }`}
                  >
                    <div>
                      <div className="text-xs font-bold text-white flex items-center gap-1.5">
                        {crust.name}
                        {addFee === 0 && <span className="text-[10px] text-emerald-400 font-semibold">(Standard)</span>}
                      </div>
                      <div className="text-[11px] text-zinc-400">{crust.description}</div>
                    </div>
                    <div className="text-xs font-black text-amber-400 shrink-0 tabular-nums">
                      {addFee === 0 ? 'Free' : `+ Rs. ${addFee}`}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Step 4: Add-ons */}
          <div className="space-y-2.5">
            <label className="text-xs font-bold uppercase tracking-wider text-amber-400">
              4. Gourmet Add-ons & Dips
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
              <button
                onClick={() => setExtraCheese(!extraCheese)}
                className={`p-3 rounded-xl border text-left flex items-center justify-between transition-all cursor-pointer ${
                  extraCheese
                    ? 'bg-amber-500/15 border-amber-500 text-white'
                    : 'bg-zinc-950 border-zinc-800 text-zinc-400'
                }`}
              >
                <div>
                  <div className="text-xs font-bold text-white">Extra Mozzarella</div>
                  <div className="text-[10px] text-zinc-400">+ Rs. 150</div>
                </div>
                {extraCheese && <Check className="w-4 h-4 text-amber-400" />}
              </button>

              <button
                onClick={() => setExtraToppings(!extraToppings)}
                className={`p-3 rounded-xl border text-left flex items-center justify-between transition-all cursor-pointer ${
                  extraToppings
                    ? 'bg-amber-500/15 border-amber-500 text-white'
                    : 'bg-zinc-950 border-zinc-800 text-zinc-400'
                }`}
              >
                <div>
                  <div className="text-xs font-bold text-white">Olives & Jalapenos</div>
                  <div className="text-[10px] text-zinc-400">+ Rs. 100</div>
                </div>
                {extraToppings && <Check className="w-4 h-4 text-amber-400" />}
              </button>

              <button
                onClick={() => setExtraDip(!extraDip)}
                className={`p-3 rounded-xl border text-left flex items-center justify-between transition-all cursor-pointer ${
                  extraDip
                    ? 'bg-amber-500/15 border-amber-500 text-white'
                    : 'bg-zinc-950 border-zinc-800 text-zinc-400'
                }`}
              >
                <div>
                  <div className="text-xs font-bold text-white">Garlic Mayo Dip</div>
                  <div className="text-[10px] text-zinc-400">+ Rs. 80</div>
                </div>
                {extraDip && <Check className="w-4 h-4 text-amber-400" />}
              </button>
            </div>
          </div>

          {/* AI Chef's Smart Pairing Recommendation */}
          {smartPairing && (
            <div className="p-4 rounded-2xl bg-gradient-to-r from-amber-500/10 via-amber-500/5 to-transparent border border-amber-500/30 space-y-2">
              <div className="flex items-center justify-between gap-2">
                <span className="flex items-center gap-1.5 text-xs font-black text-amber-400 uppercase tracking-wider">
                  <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                  Chef's Smart Pairing Recommendation
                </span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300">
                  + Rs. {smartPairing.data_payload?.price_impact_rs || 80}
                </span>
              </div>
              <p className="text-xs text-zinc-300 leading-relaxed italic">
                "{smartPairing.response_message}"
              </p>
              <div className="pt-1 flex items-center justify-between">
                <span className="text-xs font-bold text-white">
                  Suggested: {smartPairing.suggested_addon}
                </span>
                {!extraDip && smartPairing.suggested_addon.includes('Garlic') ? (
                  <button
                    onClick={() => setExtraDip(true)}
                    className="px-3 py-1 bg-amber-500 hover:bg-amber-400 text-zinc-950 font-black text-[11px] rounded-lg transition-colors cursor-pointer"
                  >
                    + Add to Pizza
                  </button>
                ) : extraDip && smartPairing.suggested_addon.includes('Garlic') ? (
                  <span className="text-[11px] font-bold text-emerald-400 flex items-center gap-1">
                    <Check className="w-3.5 h-3.5 stroke-[3]" /> Added
                  </span>
                ) : selectedSize !== 'large' && smartPairing.suggested_addon.includes('Large') ? (
                  <button
                    onClick={() => setSelectedSize('large')}
                    className="px-3 py-1 bg-amber-500 hover:bg-amber-400 text-zinc-950 font-black text-[11px] rounded-lg transition-colors cursor-pointer"
                  >
                    Upgrade Size
                  </button>
                ) : null}
              </div>
            </div>
          )}
        </div>

        {/* Footer / Total & Add to Bag */}
        <div className="p-5 border-t border-zinc-800 bg-zinc-950 flex flex-wrap items-center justify-between gap-4">
          {/* Quantity Stepper */}
          <div className="flex items-center gap-2">
            <span className="text-xs text-zinc-400">Qty:</span>
            <div className="flex items-center bg-zinc-900 border border-zinc-800 rounded-xl p-1">
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-zinc-800 text-zinc-400 hover:text-white"
              >
                <Minus className="w-3.5 h-3.5" />
              </button>
              <span className="w-8 text-center text-xs font-bold text-white tabular-nums">
                {quantity}
              </span>
              <button
                onClick={() => setQuantity(quantity + 1)}
                className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-zinc-800 text-zinc-400 hover:text-white"
              >
                <Plus className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Price & Action */}
          <div className="flex items-center gap-4">
            <div className="text-right">
              <div className="text-[11px] text-zinc-400">Calculated Total</div>
              <div className="text-xl font-black text-amber-400 tabular-nums font-heading">
                Rs. {totalPrice.toLocaleString()}
              </div>
            </div>

            <button
              onClick={handleAdd}
              className="py-3 px-6 rounded-xl bg-amber-500 hover:bg-amber-400 text-zinc-950 font-black text-xs transition-all shadow-lg shadow-amber-500/20 active:scale-95 cursor-pointer"
            >
              Add Pizza to Bag
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

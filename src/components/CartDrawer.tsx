import React, { useState } from 'react';
import { X, Trash2, Plus, Minus, MessageCircle, Truck, CheckCircle2, ShoppingBag, ArrowRight } from 'lucide-react';
import { CartItem } from '../types';
import { RESTAURANT_INFO } from '../data/menuData';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  cart: CartItem[];
  onUpdateQty: (index: number, delta: number) => void;
  onRemoveItem: (index: number) => void;
  onClearCart: () => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  cart,
  onUpdateQty,
  onRemoveItem,
  onClearCart,
}) => {
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [customerAddress, setCustomerAddress] = useState('');
  const [orderInstructions, setOrderInstructions] = useState('');
  const [orderConfirmed, setOrderConfirmed] = useState<boolean>(false);
  const [confirmedOrderNumber, setConfirmedOrderNumber] = useState<string>('');

  if (!isOpen) return null;

  const totalItems = cart.reduce((acc, item) => acc + item.quantity, 0);
  const subtotal = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const isFreeDelivery = subtotal >= RESTAURANT_INFO.freeDeliveryThreshold;
  const deliveryFee = subtotal === 0 ? 0 : isFreeDelivery ? 0 : RESTAURANT_INFO.standardDeliveryFee;
  const grandTotal = subtotal + deliveryFee;

  const freeDeliveryRemaining = Math.max(0, RESTAURANT_INFO.freeDeliveryThreshold - subtotal);
  const progressPercent = Math.min(100, Math.round((subtotal / RESTAURANT_INFO.freeDeliveryThreshold) * 100));

  const generateWhatsAppMessage = () => {
    let msg = `*🍕 NEW ORDER — ${RESTAURANT_INFO.name.toUpperCase()} (GUJRANWALA)*\n`;
    msg += `==============================\n`;
    if (customerName.trim()) msg += `*Customer:* ${customerName.trim()}\n`;
    if (customerPhone.trim()) msg += `*Phone:* ${customerPhone.trim()}\n`;
    if (customerAddress.trim()) msg += `*Address:* ${customerAddress.trim()}\n`;
    msg += `*City:* ${RESTAURANT_INFO.city}\n`;
    if (orderInstructions.trim()) msg += `*Notes:* ${orderInstructions.trim()}\n`;
    msg += `==============================\n`;
    msg += `*ORDER ITEMS:*\n`;

    cart.forEach((item, index) => {
      const itemTotal = item.price * item.quantity;
      msg += `${index + 1}. *${item.name}*\n`;
      if (item.details) msg += `   ▫ _${item.details}_\n`;
      msg += `   ▫ Price: Rs. ${item.price.toLocaleString()} x ${item.quantity} = *Rs. ${itemTotal.toLocaleString()}*\n`;
    });

    msg += `==============================\n`;
    msg += `*Subtotal:* Rs. ${subtotal.toLocaleString()}\n`;
    msg += `*Delivery Fee:* ${isFreeDelivery ? 'FREE (Gujranwala)' : `Rs. ${deliveryFee}`}\n`;
    msg += `*GRAND TOTAL:* *Rs. ${grandTotal.toLocaleString()}*\n`;
    msg += `==============================\n`;
    msg += `Please confirm my order and send estimated delivery time!`;

    return encodeURIComponent(msg);
  };

  const handleWhatsAppCheckout = () => {
    if (cart.length === 0) return;
    const msg = generateWhatsAppMessage();
    window.open(`https://wa.me/${RESTAURANT_INFO.whatsappRaw}?text=${msg}`, '_blank');
  };

  const handleCODCheckout = (e: React.FormEvent) => {
    e.preventDefault();
    if (cart.length === 0) return;
    if (!customerName.trim() || !customerPhone.trim() || !customerAddress.trim()) {
      alert('Please fill in your name, contact phone number, and delivery address in Gujranwala.');
      return;
    }

    const orderNum = `CB-${Math.floor(100000 + Math.random() * 900000)}`;
    setConfirmedOrderNumber(orderNum);
    setOrderConfirmed(true);
    onClearCart();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="absolute inset-0 bg-black/80 backdrop-blur-sm transition-opacity"
      />

      {/* Drawer */}
      <div className="absolute inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-zinc-950 border-l border-zinc-800 text-white flex flex-col shadow-2xl">
          {/* Header */}
          <div className="p-5 border-b border-zinc-800 flex items-center justify-between bg-zinc-900/60">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center">
                <ShoppingBag className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm font-black text-white">Your Order Bag</h3>
                <p className="text-[11px] text-zinc-400">
                  {totalItems} {totalItems === 1 ? 'item' : 'items'} selected
                </p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-2 text-zinc-400 hover:text-white rounded-xl hover:bg-zinc-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Delivery Progress Bar */}
          <div className="px-5 py-3 bg-zinc-900/40 border-b border-zinc-800">
            <div className="flex items-center justify-between text-[11px] mb-1.5">
              <span className="text-zinc-400 flex items-center gap-1">
                <Truck className="w-3.5 h-3.5 text-amber-400" />
                {isFreeDelivery ? (
                  <span className="text-emerald-400 font-bold">🎉 Free Delivery in Gujranwala!</span>
                ) : (
                  <span>
                    Add <strong className="text-amber-400">Rs. {freeDeliveryRemaining.toLocaleString()}</strong> for Free Delivery
                  </span>
                )}
              </span>
              <span className="text-zinc-500 font-mono text-[10px]">{progressPercent}%</span>
            </div>
            <div className="w-full bg-zinc-800 h-1.5 rounded-full overflow-hidden">
              <div
                className="bg-gradient-to-r from-amber-500 to-emerald-400 h-full transition-all duration-300"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>

          {/* Content Area */}
          <div className="flex-1 overflow-y-auto p-5 space-y-6">
            {orderConfirmed ? (
              <div className="text-center py-12 space-y-4">
                <div className="w-16 h-16 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <div className="space-y-1">
                  <h4 className="text-lg font-black text-white">Order Confirmed!</h4>
                  <p className="text-xs text-zinc-400">
                    Order token: <strong className="text-amber-400">{confirmedOrderNumber}</strong>
                  </p>
                </div>
                <div className="bg-zinc-900 p-4 rounded-2xl border border-zinc-800 text-xs text-zinc-300 text-left space-y-1.5">
                  <p className="font-semibold text-white">Deliver to: {customerName}</p>
                  <p className="text-zinc-400">Address: {customerAddress}</p>
                  <p className="text-zinc-400">Contact: {customerPhone}</p>
                  <p className="text-emerald-400 font-bold pt-1">
                    ⏱️ Estimated Arrival: 35 – 45 Minutes (Thermal Hot)
                  </p>
                </div>
                <button
                  onClick={() => {
                    setOrderConfirmed(false);
                    onClose();
                  }}
                  className="w-full py-3 bg-amber-500 text-zinc-950 font-bold text-xs rounded-xl hover:bg-amber-400 transition-colors"
                >
                  Back to Menu
                </button>
              </div>
            ) : cart.length === 0 ? (
              <div className="text-center py-16 space-y-3">
                <div className="w-12 h-12 rounded-2xl bg-zinc-900 flex items-center justify-center mx-auto text-zinc-600">
                  <ShoppingBag className="w-6 h-6" />
                </div>
                <p className="text-sm font-bold text-zinc-300">Your bag is empty</p>
                <p className="text-xs text-zinc-500">
                  Add mouth-watering pizzas, crispy burgers, or deals to get started.
                </p>
              </div>
            ) : (
              <>
                {/* Cart Items List */}
                <div className="space-y-3">
                  {cart.map((item, index) => {
                    const itemTotal = item.price * item.quantity;
                    return (
                      <div
                        key={item.cartItemId || index}
                        className="bg-zinc-900/60 rounded-2xl border border-zinc-800/80 p-3.5 flex flex-col gap-2.5"
                      >
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <h4 className="text-xs font-bold text-white">{item.name}</h4>
                            {item.details && (
                              <p className="text-[11px] text-zinc-400 mt-0.5 line-clamp-2">
                                {item.details}
                              </p>
                            )}
                          </div>
                          <button
                            onClick={() => onRemoveItem(index)}
                            className="text-zinc-500 hover:text-red-400 p-1 transition-colors"
                            title="Remove item"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>

                        <div className="flex items-center justify-between pt-1 border-t border-zinc-800/50">
                          <div className="flex items-center bg-zinc-950 border border-zinc-800 rounded-xl p-0.5">
                            <button
                              onClick={() => onUpdateQty(index, -1)}
                              className="w-6 h-6 flex items-center justify-center rounded-lg hover:bg-zinc-800 text-zinc-400 hover:text-white"
                            >
                              <Minus className="w-3 h-3" />
                            </button>
                            <span className="w-7 text-center text-xs font-bold text-white tabular-nums">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() => onUpdateQty(index, 1)}
                              className="w-6 h-6 flex items-center justify-center rounded-lg hover:bg-zinc-800 text-zinc-400 hover:text-white"
                            >
                              <Plus className="w-3 h-3" />
                            </button>
                          </div>

                          <div className="text-xs font-black text-amber-400 tabular-nums font-heading">
                            Rs. {itemTotal.toLocaleString()}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Delivery & Contact Details Form */}
                <div className="bg-zinc-900/40 rounded-2xl border border-zinc-800/80 p-4 space-y-3">
                  <div className="text-xs font-bold uppercase tracking-wider text-amber-400">
                    Delivery Information (Gujranwala)
                  </div>

                  <div className="space-y-2">
                    <input
                      type="text"
                      placeholder="Your Full Name *"
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      className="w-full bg-zinc-950 border border-zinc-800 focus:border-amber-500 rounded-xl px-3 py-2 text-xs text-white placeholder-zinc-500 outline-none"
                    />
                    <input
                      type="tel"
                      placeholder="Phone / Mobile (03xx-xxxxxxx) *"
                      value={customerPhone}
                      onChange={(e) => setCustomerPhone(e.target.value)}
                      className="w-full bg-zinc-950 border border-zinc-800 focus:border-amber-500 rounded-xl px-3 py-2 text-xs text-white placeholder-zinc-500 outline-none"
                    />
                    <textarea
                      rows={2}
                      placeholder="Street Address, Area / Colony in Gujranwala *"
                      value={customerAddress}
                      onChange={(e) => setCustomerAddress(e.target.value)}
                      className="w-full bg-zinc-950 border border-zinc-800 focus:border-amber-500 rounded-xl px-3 py-2 text-xs text-white placeholder-zinc-500 outline-none resize-none"
                    />
                    <input
                      type="text"
                      placeholder="Notes (e.g. Ring bell, extra ketchup)"
                      value={orderInstructions}
                      onChange={(e) => setOrderInstructions(e.target.value)}
                      className="w-full bg-zinc-950 border border-zinc-800 focus:border-amber-500 rounded-xl px-3 py-2 text-xs text-white placeholder-zinc-500 outline-none"
                    />
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Footer Totals & Checkout Buttons */}
          {!orderConfirmed && cart.length > 0 && (
            <div className="p-5 border-t border-zinc-800 bg-zinc-900/80 space-y-3">
              <div className="space-y-1.5 text-xs text-zinc-300">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="font-bold tabular-nums">Rs. {subtotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span>Delivery Charge</span>
                  <span className={`font-bold tabular-nums ${isFreeDelivery ? 'text-emerald-400' : ''}`}>
                    {isFreeDelivery ? 'FREE' : `Rs. ${deliveryFee}`}
                  </span>
                </div>
                <div className="flex justify-between text-sm font-black text-white pt-2 border-t border-zinc-800">
                  <span>Grand Total</span>
                  <span className="text-amber-400 tabular-nums font-heading text-base">
                    Rs. {grandTotal.toLocaleString()}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                {/* Instant WhatsApp Order */}
                <button
                  type="button"
                  onClick={handleWhatsAppCheckout}
                  className="w-full py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs rounded-xl flex items-center justify-center gap-1.5 transition-all shadow-lg shadow-emerald-950 cursor-pointer active:scale-95"
                >
                  <MessageCircle className="w-4 h-4 fill-current" />
                  <span>WhatsApp Order</span>
                </button>

                {/* Cash on Delivery */}
                <button
                  type="button"
                  onClick={handleCODCheckout}
                  className="w-full py-3 bg-amber-500 hover:bg-amber-400 text-zinc-950 font-black text-xs rounded-xl flex items-center justify-center gap-1.5 transition-all shadow-lg shadow-amber-500/20 cursor-pointer active:scale-95"
                >
                  <span>Cash on Delivery</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>

              <div className="text-[10px] text-center text-zinc-500">
                Piping hot delivery within 35-45 minutes across Gujranwala city
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

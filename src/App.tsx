import React, { useState, useEffect } from 'react';
import { AnnouncementBar } from './components/AnnouncementBar';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { FeaturePillars } from './components/FeaturePillars';
import { DealsSection } from './components/DealsSection';
import { CrownCrustSpotlight } from './components/CrownCrustSpotlight';
import { MenuSection } from './components/MenuSection';
import { AboutSection } from './components/AboutSection';
import { Footer } from './components/Footer';
import { PizzaCustomizerModal } from './components/PizzaCustomizerModal';
import { CartDrawer } from './components/CartDrawer';
import { FloatingBottomBar } from './components/FloatingBottomBar';
import { AdminPanelModal } from './components/AdminPanelModal';
import { CartItem, DealItem, MenuItem, PizzaSizeKey } from './types';
import { RESTAURANT_INFO } from './data/menuData';
import {
  SiteSectionsConfig,
  SiteContentConfig,
  getStoredSections,
  getStoredSiteContent,
} from './utils/siteContentStorage';

export default function App() {
  const [cart, setCart] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem('champs_bites_cart');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [adminActiveTab, setAdminActiveTab] = useState<'menu' | 'sections' | 'texts'>('menu');
  const [isVisualEditMode, setIsVisualEditMode] = useState(false);

  const [sectionsConfig, setSectionsConfig] = useState<SiteSectionsConfig>(() =>
    getStoredSections()
  );
  const [siteContent, setSiteContent] = useState<SiteContentConfig>(() =>
    getStoredSiteContent()
  );

  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCustomizerOpen, setIsCustomizerOpen] = useState(false);
  const [customizerItem, setCustomizerItem] = useState<MenuItem | null>(null);
  const [customizerSize, setCustomizerSize] = useState<PizzaSizeKey | undefined>('medium');
  const [menuVersion, setMenuVersion] = useState(0);

  // Listen to content and section updates
  useEffect(() => {
    const handleUpdate = () => {
      setSectionsConfig(getStoredSections());
      setSiteContent(getStoredSiteContent());
    };
    window.addEventListener('champs_content_updated', handleUpdate);
    return () => window.removeEventListener('champs_content_updated', handleUpdate);
  }, []);

  // Sync cart to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('champs_bites_cart', JSON.stringify(cart));
    } catch {
      // Ignore localStorage write error if sandboxed
    }
  }, [cart]);

  // Secret shortcut: Press Ctrl + Shift + A (or Cmd + Shift + A) to open Admin
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && (e.key === 'A' || e.key === 'a')) {
        e.preventDefault();
        setIsAdminOpen(true);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Handler for Elementor-style direct click on page elements
  const handleQuickEdit = (sectionField: string) => {
    setAdminActiveTab('texts');
    setIsAdminOpen(true);
  };

  // Derived totals
  const cartCount = cart.reduce((acc, item) => acc + item.quantity, 0);
  const cartTotal = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);

  // Cart operations
  const handleAddToCart = (item: CartItem) => {
    setCart((prev) => {
      const existingIdx = prev.findIndex(
        (i) => i.name === item.name && (i.details || '') === (item.details || '')
      );
      if (existingIdx !== -1) {
        const next = [...prev];
        next[existingIdx].quantity += item.quantity;
        return next;
      }
      return [...prev, item];
    });
  };

  const handleAddDealToCart = (deal: DealItem) => {
    const item: CartItem = {
      cartItemId: `deal-${deal.id}-${Date.now()}`,
      name: deal.name,
      details: deal.items.join(' • '),
      price: deal.price,
      quantity: 1,
      image: deal.image,
    };
    handleAddToCart(item);
  };

  const handleUpdateQty = (index: number, delta: number) => {
    setCart((prev) => {
      const next = [...prev];
      const newQty = next[index].quantity + delta;
      if (newQty <= 0) {
        return next.filter((_, idx) => idx !== index);
      }
      next[index] = { ...next[index], quantity: newQty };
      return next;
    });
  };

  const handleRemoveItem = (index: number) => {
    setCart((prev) => prev.filter((_, idx) => idx !== index));
  };

  const handleClearCart = () => {
    setCart([]);
  };

  const handleOpenCustomizer = (item?: MenuItem, size?: PizzaSizeKey) => {
    setCustomizerItem(item || null);
    setCustomizerSize(size || 'medium');
    setIsCustomizerOpen(true);
  };

  const handleQuickWhatsAppOrder = () => {
    if (cart.length === 0) return;
    const isFree = cartTotal >= RESTAURANT_INFO.freeDeliveryThreshold;
    const fee = isFree ? 0 : RESTAURANT_INFO.standardDeliveryFee;
    const grand = cartTotal + fee;

    let msg = `*🍕 QUICK ORDER — ${siteContent.restaurantName.toUpperCase()} (${siteContent.city.toUpperCase()})*\n\n`;
    cart.forEach((item, idx) => {
      msg += `${idx + 1}. *${item.name}* (x${item.quantity}) - Rs. ${(item.price * item.quantity).toLocaleString()}\n`;
      if (item.details) msg += `   _${item.details}_\n`;
    });
    msg += `\n*Subtotal:* Rs. ${cartTotal.toLocaleString()}\n`;
    msg += `*Delivery Fee:* ${isFree ? 'FREE' : `Rs. ${fee}`}\n`;
    msg += `*Grand Total:* *Rs. ${grand.toLocaleString()}*\n\n`;
    msg += `Please confirm my order for ${siteContent.city}!`;

    window.open(`https://wa.me/${siteContent.whatsapp}?text=${encodeURIComponent(msg)}`, '_blank');
  };

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col font-sans selection:bg-amber-500 selection:text-zinc-950">
      {/* Floating Visual Edit Banner if Mode is Active */}
      {isVisualEditMode && (
        <div className="bg-emerald-600 text-white text-xs font-bold py-2 px-4 sticky top-0 z-50 shadow-lg flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-white animate-ping" />
            <span>✨ Visual Elementor Edit Mode Active: Click any header, announcement, or story on page to edit!</span>
          </div>
          <button
            onClick={() => setIsVisualEditMode(false)}
            className="px-2.5 py-1 bg-black/30 hover:bg-black/50 text-white rounded-lg text-[11px] cursor-pointer"
          >
            Exit Visual Mode
          </button>
        </div>
      )}

      {/* Top Announcement */}
      {sectionsConfig.announcementBar && (
        <AnnouncementBar
          customTag={siteContent.announcementTag}
          customText={siteContent.announcementText}
          customPhone={siteContent.phone}
          customHours={siteContent.openingHours}
          isVisualEditMode={isVisualEditMode}
          onEditClick={handleQuickEdit}
        />
      )}

      {/* Main Navigation */}
      <Navbar
        cartCount={cartCount}
        cartTotal={cartTotal}
        onOpenCart={() => setIsCartOpen(true)}
        onOpenCustomizer={() => handleOpenCustomizer()}
        onOpenAdmin={() => {
          setAdminActiveTab('menu');
          setIsAdminOpen(true);
        }}
        restaurantName={siteContent.restaurantName}
        tagline={siteContent.tagline}
        isVisualEditMode={isVisualEditMode}
        onEditClick={handleQuickEdit}
      />

      {/* Main Content */}
      <main className="flex-1">
        {/* Hero Section */}
        {sectionsConfig.hero && (
          <Hero
            onExploreMenu={() => scrollToSection('menuSection')}
            onExploreDeals={() => scrollToSection('dealsSection')}
            onOpenCustomizer={() => handleOpenCustomizer()}
            badge={siteContent.heroBadge}
            titleLine1={siteContent.heroTitleLine1}
            titleHighlight={siteContent.heroTitleHighlight}
            description={siteContent.heroDescription}
            btnPrimary={siteContent.heroButtonPrimary}
            btnSecondary={siteContent.heroButtonSecondary}
            isVisualEditMode={isVisualEditMode}
            onEditClick={handleQuickEdit}
          />
        )}

        {/* Feature Pillars */}
        {sectionsConfig.featurePillars && <FeaturePillars />}

        {/* Special Deals & Combos */}
        {sectionsConfig.dealsSection && (
          <DealsSection onAddDealToCart={handleAddDealToCart} />
        )}

        {/* Signature Crown Crust Spotlight */}
        {sectionsConfig.crownSpotlight && (
          <CrownCrustSpotlight onAddToCart={handleAddToCart} />
        )}

        {/* Full Food Menu & Search */}
        {sectionsConfig.menuSection && (
          <MenuSection
            key={`menu-sec-${menuVersion}`}
            onAddToCart={handleAddToCart}
            onOpenCustomizer={(item, size) => handleOpenCustomizer(item, size)}
            onOpenAdmin={() => {
              setAdminActiveTab('menu');
              setIsAdminOpen(true);
            }}
          />
        )}

        {/* About & Gujranwala Story */}
        {sectionsConfig.aboutSection && (
          <AboutSection
            title={siteContent.aboutTitle}
            subtitle={siteContent.aboutSubtitle}
            text1={siteContent.aboutText1}
            text2={siteContent.aboutText2}
            isVisualEditMode={isVisualEditMode}
            onEditClick={handleQuickEdit}
          />
        )}
      </main>

      {/* Footer */}
      {sectionsConfig.footer && (
        <Footer
          onNavigate={scrollToSection}
          onOpenCustomizer={() => handleOpenCustomizer()}
          onOpenAdmin={() => {
            setAdminActiveTab('sections');
            setIsAdminOpen(true);
          }}
          restaurantName={siteContent.restaurantName}
          phone={siteContent.phone}
          whatsapp={siteContent.whatsapp}
          hours={siteContent.openingHours}
          city={siteContent.city}
          isVisualEditMode={isVisualEditMode}
          onEditClick={handleQuickEdit}
        />
      )}

      {/* Modals & Floating Components */}
      <AdminPanelModal
        isOpen={isAdminOpen}
        onClose={() => setIsAdminOpen(false)}
        onMenuUpdated={() => setMenuVersion((v) => v + 1)}
        isVisualEditMode={isVisualEditMode}
        onToggleVisualEditMode={() => setIsVisualEditMode((prev) => !prev)}
        activeTabInitial={adminActiveTab}
      />

      <PizzaCustomizerModal
        key={`cust-${menuVersion}`}
        isOpen={isCustomizerOpen}
        initialItem={customizerItem}
        initialSize={customizerSize}
        onClose={() => setIsCustomizerOpen(false)}
        onAddToCart={handleAddToCart}
      />

      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cart={cart}
        onUpdateQty={handleUpdateQty}
        onRemoveItem={handleRemoveItem}
        onClearCart={handleClearCart}
      />

      <FloatingBottomBar
        cart={cart}
        onOpenCart={() => setIsCartOpen(true)}
        onQuickWhatsApp={handleQuickWhatsAppOrder}
      />
    </div>
  );
}

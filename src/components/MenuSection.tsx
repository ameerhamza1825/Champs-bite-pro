import React, { useState, useMemo, useEffect } from 'react';
import { Search, X, Sparkles, Flame, Award, Crown, Utensils, Soup, Scroll, Zap, Wine, Cake, Settings } from 'lucide-react';
import { CATEGORIES } from '../data/menuData';
import { ProductCard } from './ProductCard';
import { MenuItem, CartItem, PizzaSizeKey } from '../types';
import { getStoredMenuItems } from '../utils/menuStorage';

interface MenuSectionProps {
  onAddToCart: (item: CartItem) => void;
  onOpenCustomizer: (item: MenuItem, size?: PizzaSizeKey) => void;
  onOpenAdmin?: () => void;
}

export const MenuSection: React.FC<MenuSectionProps> = ({
  onAddToCart,
  onOpenCustomizer,
  onOpenAdmin,
}) => {
  const [menuItems, setMenuItems] = useState<MenuItem[]>(() => getStoredMenuItems());
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Re-read menu items when storage changes or admin updates
  useEffect(() => {
    const handleUpdate = () => {
      setMenuItems(getStoredMenuItems());
    };
    window.addEventListener('champs_menu_updated', handleUpdate);
    return () => window.removeEventListener('champs_menu_updated', handleUpdate);
  }, []);

  const filteredItems = useMemo(() => {
    return menuItems.filter((item) => {
      const matchesCategory =
        selectedCategory === 'all' || item.category === selectedCategory;
      const matchesSearch =
        searchQuery.trim() === '' ||
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.description.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [menuItems, selectedCategory, searchQuery]);

  // Icon mapping
  const renderCategoryIcon = (iconName: string) => {
    switch (iconName) {
      case 'Flame':
        return <Flame className="w-3.5 h-3.5" />;
      case 'Award':
        return <Award className="w-3.5 h-3.5" />;
      case 'Crown':
        return <Crown className="w-3.5 h-3.5" />;
      case 'Utensils':
        return <Utensils className="w-3.5 h-3.5" />;
      case 'Soup':
        return <Soup className="w-3.5 h-3.5" />;
      case 'Scroll':
        return <Scroll className="w-3.5 h-3.5" />;
      case 'Zap':
        return <Zap className="w-3.5 h-3.5" />;
      case 'Wine':
        return <Wine className="w-3.5 h-3.5" />;
      case 'Cake':
        return <Cake className="w-3.5 h-3.5" />;
      default:
        return <Sparkles className="w-3.5 h-3.5" />;
    }
  };

  return (
    <section id="menuSection" className="py-16 bg-zinc-950 scroll-mt-20 border-b border-zinc-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-8 space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-bold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5" />
            Full Artisanal Menu
          </div>
          <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
            Crafted for True Food Lovers
          </h2>
          <p className="text-sm text-zinc-400">
            Freshly prepared on every order — delivered piping hot across Gujranwala
          </p>
        </div>

        {/* Search Bar */}
        <div className="relative max-w-md mx-auto mb-8">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500 pointer-events-none" />
          <input
            type="text"
            placeholder="Search pizzas, burgers, pastas, wings..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-zinc-900/80 border border-zinc-800 focus:border-amber-500 rounded-2xl pl-11 pr-10 py-3 text-sm text-white placeholder-zinc-500 outline-none transition-all shadow-inner"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Category Filters */}
        <div className="flex gap-2 overflow-x-auto pb-4 mb-10 justify-start sm:justify-center scrollbar-none">
          {CATEGORIES.map((cat) => {
            const isSelected = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all flex items-center gap-2 cursor-pointer ${
                  isSelected
                    ? 'bg-amber-500 text-zinc-950 shadow-md shadow-amber-500/20 font-black'
                    : 'bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white hover:border-zinc-700'
                }`}
              >
                {renderCategoryIcon(cat.icon)}
                <span>{cat.name}</span>
              </button>
            );
          })}
        </div>

        {/* Product Grid */}
        {filteredItems.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredItems.map((item) => (
              <ProductCard
                key={item.id}
                item={item}
                onAddToCart={onAddToCart}
                onOpenCustomizer={onOpenCustomizer}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-zinc-900/30 rounded-3xl border border-zinc-800/60 max-w-md mx-auto space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-zinc-800 flex items-center justify-center mx-auto text-zinc-500">
              <Search className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">No items found</h3>
              <p className="text-xs text-zinc-400 mt-1">
                No menu items match your search "{searchQuery}"
              </p>
            </div>
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('all');
              }}
              className="px-4 py-2 bg-amber-500 text-zinc-950 font-bold text-xs rounded-xl hover:bg-amber-400 transition-colors cursor-pointer"
            >
              Reset Filters
            </button>
          </div>
        )}
      </div>
    </section>
  );
};

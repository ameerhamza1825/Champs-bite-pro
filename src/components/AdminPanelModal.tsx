import React, { useState, useRef, useEffect } from 'react';
import {
  X,
  Plus,
  Edit2,
  Trash2,
  Image as ImageIcon,
  DollarSign,
  RotateCcw,
  Check,
  Search,
  Pizza,
  Sparkles,
  ShieldCheck,
  Layers,
  Tag,
  AlertCircle,
  Lock,
  KeyRound,
  LogOut,
  Upload,
  Camera,
  LayoutTemplate,
  Type,
  Eye,
  EyeOff,
  MousePointerClick,
} from 'lucide-react';
import { MenuItem, PizzaSizeKey } from '../types';
import { CATEGORIES } from '../data/menuData';
import {
  getStoredMenuItems,
  saveStoredMenuItems,
  resetMenuToDefaults,
} from '../utils/menuStorage';
import {
  SiteSectionsConfig,
  SiteContentConfig,
  getStoredSections,
  saveStoredSections,
  getStoredSiteContent,
  saveStoredSiteContent,
  resetSiteContentAndSections,
} from '../utils/siteContentStorage';

interface AdminPanelModalProps {
  isOpen: boolean;
  onClose: () => void;
  onMenuUpdated: () => void;
  isVisualEditMode: boolean;
  onToggleVisualEditMode: () => void;
  activeTabInitial?: 'menu' | 'sections' | 'texts';
}

const ADMIN_PASSWORD = 'Champs';

export const AdminPanelModal: React.FC<AdminPanelModalProps> = ({
  isOpen,
  onClose,
  onMenuUpdated,
  isVisualEditMode,
  onToggleVisualEditMode,
  activeTabInitial = 'menu',
}) => {
  const [activeTab, setActiveTab] = useState<'menu' | 'sections' | 'texts'>(activeTabInitial);

  // Sync tab if passed
  useEffect(() => {
    if (activeTabInitial) {
      setActiveTab(activeTabInitial);
    }
  }, [activeTabInitial, isOpen]);

  const [sectionsConfig, setSectionsConfig] = useState<SiteSectionsConfig>(() =>
    getStoredSections()
  );
  const [siteContent, setSiteContent] = useState<SiteContentConfig>(() =>
    getStoredSiteContent()
  );
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return sessionStorage.getItem('champs_admin_auth') === 'true';
  });
  const [pinInput, setPinInput] = useState('');
  const [pinError, setPinError] = useState(false);

  const [menuItems, setMenuItems] = useState<MenuItem[]>(() => getStoredMenuItems());
  const [search, setSearch] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null);
  const [isCreatingNew, setIsCreatingNew] = useState(false);
  const [notification, setNotification] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Check size limit: max 4MB for high quality pictures
    if (file.size > 4 * 1024 * 1024) {
      alert('Selected image size is too large (max 4MB). Please choose a smaller image.');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const base64 = event.target?.result as string;
      if (base64 && editingItem) {
        setEditingItem({
          ...editingItem,
          image: base64,
        });
        showToast('Image uploaded directly from your device!');
      }
    };
    reader.readAsDataURL(file);
  };

  // Drag and Drop Handler for files from desktop or images/links dragged from Google Images / websites
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    if (!editingItem) return;

    // 1. Check if an image file was dropped from PC
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const file = e.dataTransfer.files[0];
      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = (event) => {
          const base64 = event.target?.result as string;
          if (base64) {
            setEditingItem({ ...editingItem, image: base64 });
            showToast('Dropped image loaded successfully!');
          }
        };
        reader.readAsDataURL(file);
        return;
      }
    }

    // 2. Check if an image was dragged directly from Google Images or a website (HTML / URI-list)
    const htmlData = e.dataTransfer.getData('text/html');
    if (htmlData) {
      const parser = new DOMParser();
      const doc = parser.parseFromString(htmlData, 'text/html');
      const img = doc.querySelector('img');
      if (img && img.src) {
        setEditingItem({ ...editingItem, image: img.src });
        showToast('Image from Google / web loaded!');
        return;
      }
    }

    // 3. Fallback: check plain text or URL link dropped
    const urlData = e.dataTransfer.getData('text/uri-list') || e.dataTransfer.getData('text/plain');
    if (urlData && (urlData.startsWith('http://') || urlData.startsWith('https://') || urlData.startsWith('data:image'))) {
      setEditingItem({ ...editingItem, image: urlData.trim() });
      showToast('Image URL applied from drop!');
      return;
    }

    showToast('Could not read image from drop. Please try pasting the link or uploading file.');
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (pinInput.trim() === ADMIN_PASSWORD || pinInput.trim().toLowerCase() === ADMIN_PASSWORD.toLowerCase()) {
      setIsAuthenticated(true);
      sessionStorage.setItem('champs_admin_auth', 'true');
      setPinError(false);
      setPinInput('');
    } else {
      setPinError(true);
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    sessionStorage.removeItem('champs_admin_auth');
    setEditingItem(null);
  };

  if (!isOpen) return null;

  // If not authenticated, show secure PIN entrance
  if (!isAuthenticated) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fadeIn">
        <div className="relative w-full max-w-md bg-zinc-950 border border-zinc-800 rounded-3xl shadow-2xl overflow-hidden p-6 sm:p-8 space-y-6">
          <button
            onClick={onClose}
            className="absolute top-5 right-5 p-2 text-zinc-500 hover:text-white rounded-xl hover:bg-zinc-900 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="text-center space-y-2">
            <div className="w-14 h-14 mx-auto rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-400 flex items-center justify-center">
              <Lock className="w-7 h-7" />
            </div>
            <h3 className="text-xl font-black text-white">Champs Bites Manager</h3>
            <p className="text-xs text-zinc-400">
              Restricted management area. Please enter your manager password to edit prices and photos.
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider block mb-1.5 text-center">
                Enter Manager Password
              </label>
              <div className="relative">
                <KeyRound className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-500" />
                <input
                  type="password"
                  autoFocus
                  placeholder="Enter Password"
                  value={pinInput}
                  onChange={(e) => {
                    setPinInput(e.target.value);
                    if (pinError) setPinError(false);
                  }}
                  className={`w-full pl-10 pr-4 py-3 rounded-2xl bg-zinc-900 border text-white text-center text-lg font-black tracking-widest outline-none transition-all ${
                    pinError
                      ? 'border-red-500 text-red-400 shadow-md shadow-red-500/10'
                      : 'border-zinc-800 focus:border-amber-500'
                  }`}
                />
              </div>
              {pinError && (
                <p className="text-xs text-red-400 text-center mt-2 font-semibold flex items-center justify-center gap-1">
                  <AlertCircle className="w-3.5 h-3.5" /> Incorrect Password. Please try again.
                </p>
              )}
            </div>

            <button
              type="submit"
              className="w-full py-3 rounded-2xl bg-amber-500 hover:bg-amber-400 text-zinc-950 font-black text-xs transition-all shadow-lg shadow-amber-500/20 active:scale-95 cursor-pointer"
            >
              Verify & Unlock Management Access
            </button>
          </form>

          <div className="text-center pt-2">
            <span className="text-[11px] text-zinc-500">
              Only authorized branch management can modify pricing.
            </span>
          </div>
        </div>
      </div>
    );
  }

  const showToast = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 3000);
  };

  const handleEditClick = (item: MenuItem) => {
    // Deep clone to prevent direct mutating
    setEditingItem(JSON.parse(JSON.stringify(item)));
    setIsCreatingNew(false);
  };

  const handleAddNewClick = () => {
    const newItem: MenuItem = {
      id: `item-custom-${Date.now()}`,
      name: '',
      category: 'ultimate',
      description: '',
      image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=800&q=80',
      isPizza: true,
      prices: {
        small: 550,
        medium: 850,
        large: 1300,
        xl: 2250,
      },
      badge: 'New Item',
    };
    setEditingItem(newItem);
    setIsCreatingNew(true);
  };

  const handleSaveItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingItem) return;
    if (!editingItem.name.trim()) {
      showToast('Please enter an item name');
      return;
    }

    let updatedList: MenuItem[];
    if (isCreatingNew) {
      updatedList = [editingItem, ...menuItems];
      showToast(`Added new item "${editingItem.name}" successfully!`);
    } else {
      updatedList = menuItems.map((item) =>
        item.id === editingItem.id ? editingItem : item
      );
      showToast(`Updated "${editingItem.name}" rates & details!`);
    }

    setMenuItems(updatedList);
    saveStoredMenuItems(updatedList);
    onMenuUpdated();
    setEditingItem(null);
    setIsCreatingNew(false);
  };

  const handleDeleteItem = (id: string, name: string) => {
    if (!window.confirm(`Are you sure you want to delete "${name}" from the menu?`)) {
      return;
    }
    const updated = menuItems.filter((i) => i.id !== id);
    setMenuItems(updated);
    saveStoredMenuItems(updated);
    onMenuUpdated();
    showToast(`Deleted "${name}" from menu.`);
    if (editingItem?.id === id) {
      setEditingItem(null);
    }
  };

  const handleResetDefaults = () => {
    if (
      window.confirm(
        'Warning: Reset all rates, pictures, and items back to factory defaults?'
      )
    ) {
      const defaults = resetMenuToDefaults();
      setMenuItems(defaults);
      onMenuUpdated();
      setEditingItem(null);
      showToast('All menu rates & images reset to defaults.');
    }
  };

  const filteredItems = menuItems.filter((item) => {
    const matchesCategory =
      filterCategory === 'all' || item.category === filterCategory;
    const matchesSearch =
      item.name.toLowerCase().includes(search.toLowerCase()) ||
      item.description.toLowerCase().includes(search.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md animate-fadeIn overflow-y-auto">
      <div className="relative w-full max-w-6xl bg-zinc-950 border border-zinc-800 rounded-3xl shadow-2xl overflow-hidden my-4 max-h-[92vh] flex flex-col">
        {/* Header Bar */}
        <div className="p-5 border-b border-zinc-800 flex items-center justify-between bg-zinc-900/90 sticky top-0 z-10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-400 flex items-center justify-center">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-black text-white tracking-wide">
                  Champs Bites Admin Portal
                </h2>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 font-bold border border-emerald-500/30">
                  Live Rates & Media Manager
                </span>
              </div>
              <p className="text-xs text-zinc-400">
                Update item rates (Rs.), upload/link images, and add new pizzas or items in real-time.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleResetDefaults}
              className="hidden sm:flex items-center gap-1.5 px-3 py-2 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-red-400 hover:border-red-500/30 text-xs font-bold transition-colors cursor-pointer"
              title="Reset all prices and images to original defaults"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Reset Defaults
            </button>
            <button
              onClick={handleLogout}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white text-xs font-bold transition-colors cursor-pointer"
              title="Lock Admin Portal"
            >
              <LogOut className="w-3.5 h-3.5 text-amber-400" />
              <span className="hidden sm:inline">Lock / Logout</span>
            </button>
            <button
              onClick={onClose}
              className="p-2 text-zinc-400 hover:text-white rounded-xl hover:bg-zinc-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Tab Switcher & Visual Edit Toggle (Elementor style) */}
        <div className="px-5 py-2.5 bg-zinc-900 border-b border-zinc-800 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-1.5 bg-zinc-950 p-1 rounded-2xl border border-zinc-800 text-xs">
            <button
              onClick={() => setActiveTab('menu')}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-xl font-bold transition-all cursor-pointer ${
                activeTab === 'menu'
                  ? 'bg-amber-500 text-zinc-950 shadow-md shadow-amber-500/20'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              <Pizza className="w-3.5 h-3.5" />
              <span>Menu Items & Rates</span>
            </button>

            <button
              onClick={() => setActiveTab('sections')}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-xl font-bold transition-all cursor-pointer ${
                activeTab === 'sections'
                  ? 'bg-amber-500 text-zinc-950 shadow-md shadow-amber-500/20'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              <LayoutTemplate className="w-3.5 h-3.5" />
              <span>Sections Builder (Add/Remove)</span>
            </button>

            <button
              onClick={() => setActiveTab('texts')}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-xl font-bold transition-all cursor-pointer ${
                activeTab === 'texts'
                  ? 'bg-amber-500 text-zinc-950 shadow-md shadow-amber-500/20'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              <Type className="w-3.5 h-3.5" />
              <span>Text & Content Editor</span>
            </button>
          </div>

          {/* Visual Click-to-Edit Mode Toggle */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                onToggleVisualEditMode();
                showToast(
                  !isVisualEditMode
                    ? 'Visual Edit Mode ENABLED! Click any text/header directly on page to edit.'
                    : 'Visual Edit Mode Disabled.'
                );
              }}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-bold transition-all border cursor-pointer ${
                isVisualEditMode
                  ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/50 ring-2 ring-emerald-500/20'
                  : 'bg-zinc-800 text-zinc-300 border-zinc-700 hover:border-amber-500/50'
              }`}
              title="Click directly on text elements on the live page to edit them"
            >
              <MousePointerClick className="w-3.5 h-3.5 text-amber-400" />
              <span>
                Visual Click-To-Edit:{' '}
                <strong className={isVisualEditMode ? 'text-emerald-400' : 'text-zinc-500'}>
                  {isVisualEditMode ? 'ON' : 'OFF'}
                </strong>
              </span>
            </button>
          </div>
        </div>

        {/* Notification Toast */}
        {notification && (
          <div className="bg-amber-500 text-zinc-950 text-xs font-black px-4 py-2 text-center animate-fadeIn">
            {notification}
          </div>
        )}

        {/* TAB 1: MENU ITEMS & RATES */}
        {activeTab === 'menu' && (
          <div className="flex-1 overflow-y-auto p-4 sm:p-6 grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Column: Items List & Filters (7 cols on lg) */}
          <div className="lg:col-span-7 flex flex-col space-y-4">
            {/* Search & Actions Bar */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
              <div className="relative flex-1">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" />
                <input
                  type="text"
                  placeholder="Search item by name..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 rounded-xl bg-zinc-900 border border-zinc-800 text-white text-xs placeholder-zinc-500 focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="flex items-center gap-2">
                <select
                  value={filterCategory}
                  onChange={(e) => setFilterCategory(e.target.value)}
                  className="px-3 py-2 rounded-xl bg-zinc-900 border border-zinc-800 text-xs text-zinc-300 focus:outline-none focus:border-amber-500 cursor-pointer"
                >
                  <option value="all">All Categories ({menuItems.length})</option>
                  {CATEGORIES.filter((c) => c.id !== 'all').map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>

                <button
                  onClick={handleAddNewClick}
                  className="flex items-center gap-1.5 px-3 py-2 bg-amber-500 hover:bg-amber-400 text-zinc-950 font-black text-xs rounded-xl transition-all shadow-md shadow-amber-500/10 active:scale-95 cursor-pointer whitespace-nowrap"
                >
                  <Plus className="w-4 h-4 stroke-[3]" />
                  Add New Item
                </button>
              </div>
            </div>

            {/* Items Table / Cards */}
            <div className="space-y-2 max-h-[580px] overflow-y-auto pr-1">
              {filteredItems.length === 0 ? (
                <div className="p-8 text-center bg-zinc-900/40 rounded-2xl border border-zinc-800/80 text-zinc-400 text-xs">
                  No menu items found matching "{search}".
                </div>
              ) : (
                filteredItems.map((item) => {
                  const isPizza = !!(item.isPizza && item.prices);
                  const isSelectedForEdit = editingItem?.id === item.id;

                  return (
                    <div
                      key={item.id}
                      className={`p-3 rounded-2xl border transition-all flex items-center justify-between gap-3 ${
                        isSelectedForEdit
                          ? 'bg-amber-500/10 border-amber-500 shadow-lg shadow-amber-500/5'
                          : 'bg-zinc-900/60 border-zinc-800/80 hover:border-zinc-700'
                      }`}
                    >
                      {/* Image Thumbnail */}
                      <div className="w-14 h-14 rounded-xl overflow-hidden bg-zinc-950 shrink-0 border border-zinc-800">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            (e.currentTarget as HTMLImageElement).src =
                              'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=400&q=80';
                          }}
                        />
                      </div>

                      {/* Info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <h4 className="text-xs font-black text-white truncate">
                            {item.name}
                          </h4>
                          {item.badge && (
                            <span className="text-[9px] px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-300 font-bold">
                              {item.badge}
                            </span>
                          )}
                          <span className="text-[10px] text-zinc-500 uppercase">
                            {item.category}
                          </span>
                        </div>

                        {/* Rates Display */}
                        {isPizza && item.prices ? (
                          <div className="flex items-center gap-2 mt-1 text-[11px] text-zinc-400">
                            <span className="text-amber-400 font-black">
                              S: Rs. {item.prices.small}
                            </span>
                            <span>•</span>
                            <span className="text-amber-400 font-black">
                              M: Rs. {item.prices.medium}
                            </span>
                            <span>•</span>
                            <span className="text-amber-400 font-black">
                              L: Rs. {item.prices.large}
                            </span>
                            <span>•</span>
                            <span className="text-amber-400 font-black">
                              XL: Rs. {item.prices.xl}
                            </span>
                          </div>
                        ) : (
                          <div className="text-[11px] text-amber-400 font-black mt-1">
                            Rate: Rs. {item.price || (item.variants ? item.variants[0]?.price : 0)}
                          </div>
                        )}
                      </div>

                      {/* Actions */}
                      <div className="flex items-center gap-1.5 shrink-0">
                        <button
                          onClick={() => handleEditClick(item)}
                          className={`p-2 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
                            isSelectedForEdit
                              ? 'bg-amber-500 text-zinc-950 border-amber-500'
                              : 'bg-zinc-800 text-zinc-300 border-zinc-700 hover:text-white hover:bg-zinc-700'
                          }`}
                          title="Edit Rate & Details"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDeleteItem(item.id, item.name)}
                          className="p-2 rounded-xl bg-zinc-800/80 border border-zinc-700/80 text-zinc-400 hover:text-red-400 hover:border-red-500/40 transition-colors cursor-pointer"
                          title="Delete Item"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>

          {/* Right Column: Edit / Add Form (5 cols on lg) */}
          <div className="lg:col-span-5 bg-zinc-900/50 border border-zinc-800 rounded-2xl p-5 flex flex-col">
            {editingItem ? (
              <form onSubmit={handleSaveItem} className="space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-zinc-800">
                  <div>
                    <h3 className="text-sm font-black text-white flex items-center gap-1.5">
                      {isCreatingNew ? <Plus className="w-4 h-4 text-amber-400" /> : <Edit2 className="w-4 h-4 text-amber-400" />}
                      {isCreatingNew ? 'Create New Menu Item' : `Edit "${editingItem.name}"`}
                    </h3>
                    <p className="text-[11px] text-zinc-400">
                      Changes update the live website immediately.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setEditingItem(null)}
                    className="text-zinc-500 hover:text-zinc-300 text-xs"
                  >
                    Cancel
                  </button>
                </div>

                {/* Item Name */}
                <div>
                  <label className="text-[11px] font-bold text-zinc-300 uppercase tracking-wider block mb-1">
                    Item Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={editingItem.name}
                    onChange={(e) =>
                      setEditingItem({ ...editingItem, name: e.target.value })
                    }
                    placeholder="e.g. Malai Boti Pizza / Zinger Burger"
                    className="w-full px-3 py-2 rounded-xl bg-zinc-950 border border-zinc-800 text-white text-xs focus:outline-none focus:border-amber-500"
                  />
                </div>

                {/* Category & Badge */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-[11px] font-bold text-zinc-300 uppercase tracking-wider block mb-1">
                      Category
                    </label>
                    <select
                      value={editingItem.category}
                      onChange={(e) =>
                        setEditingItem({ ...editingItem, category: e.target.value })
                      }
                      className="w-full px-3 py-2 rounded-xl bg-zinc-950 border border-zinc-800 text-white text-xs focus:outline-none focus:border-amber-500"
                    >
                      {CATEGORIES.filter((c) => c.id !== 'all').map((c) => (
                        <option key={c.id} value={c.id}>
                          {c.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="text-[11px] font-bold text-zinc-300 uppercase tracking-wider block mb-1">
                      Badge (Optional)
                    </label>
                    <input
                      type="text"
                      value={editingItem.badge || ''}
                      onChange={(e) =>
                        setEditingItem({ ...editingItem, badge: e.target.value })
                      }
                      placeholder="Best Seller / Special"
                      className="w-full px-3 py-2 rounded-xl bg-zinc-950 border border-zinc-800 text-white text-xs focus:outline-none focus:border-amber-500"
                    />
                  </div>
                </div>

                {/* Pizza toggle */}
                <div className="p-3 rounded-xl bg-zinc-950 border border-zinc-800 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Pizza className="w-4 h-4 text-amber-400" />
                    <div>
                      <div className="text-xs font-bold text-white">Is this a Pizza?</div>
                      <div className="text-[10px] text-zinc-400">
                        Enables 4 sizes (Small, Medium, Large, XL) & Crust selection
                      </div>
                    </div>
                  </div>
                  <input
                    type="checkbox"
                    checked={!!editingItem.isPizza}
                    onChange={(e) => {
                      const checked = e.target.checked;
                      setEditingItem({
                        ...editingItem,
                        isPizza: checked,
                        prices: checked
                          ? editingItem.prices || { small: 550, medium: 850, large: 1300, xl: 2250 }
                          : undefined,
                        price: !checked ? editingItem.price || 450 : undefined,
                      });
                    }}
                    className="w-4 h-4 accent-amber-500 cursor-pointer"
                  />
                </div>

                {/* RATES SECTION */}
                <div className="space-y-2">
                  <label className="text-[11px] font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
                    <DollarSign className="w-3.5 h-3.5" />
                    Rates Configuration (PKR Rs.)
                  </label>

                  {editingItem.isPizza && editingItem.prices ? (
                    <div className="grid grid-cols-2 gap-2 bg-zinc-950 p-3 rounded-xl border border-zinc-800">
                      <div>
                        <span className="text-[10px] text-zinc-400 block font-semibold">Small (6")</span>
                        <input
                          type="number"
                          min="0"
                          value={editingItem.prices.small}
                          onChange={(e) =>
                            setEditingItem({
                              ...editingItem,
                              prices: {
                                ...editingItem.prices!,
                                small: Number(e.target.value) || 0,
                              },
                            })
                          }
                          className="w-full px-2.5 py-1.5 rounded-lg bg-zinc-900 border border-zinc-700 text-white text-xs font-black tabular-nums"
                        />
                      </div>
                      <div>
                        <span className="text-[10px] text-zinc-400 block font-semibold">Medium (9")</span>
                        <input
                          type="number"
                          min="0"
                          value={editingItem.prices.medium}
                          onChange={(e) =>
                            setEditingItem({
                              ...editingItem,
                              prices: {
                                ...editingItem.prices!,
                                medium: Number(e.target.value) || 0,
                              },
                            })
                          }
                          className="w-full px-2.5 py-1.5 rounded-lg bg-zinc-900 border border-zinc-700 text-white text-xs font-black tabular-nums"
                        />
                      </div>
                      <div>
                        <span className="text-[10px] text-zinc-400 block font-semibold">Large (12")</span>
                        <input
                          type="number"
                          min="0"
                          value={editingItem.prices.large}
                          onChange={(e) =>
                            setEditingItem({
                              ...editingItem,
                              prices: {
                                ...editingItem.prices!,
                                large: Number(e.target.value) || 0,
                              },
                            })
                          }
                          className="w-full px-2.5 py-1.5 rounded-lg bg-zinc-900 border border-zinc-700 text-white text-xs font-black tabular-nums"
                        />
                      </div>
                      <div>
                        <span className="text-[10px] text-zinc-400 block font-semibold">X-Large (15")</span>
                        <input
                          type="number"
                          min="0"
                          value={editingItem.prices.xl}
                          onChange={(e) =>
                            setEditingItem({
                              ...editingItem,
                              prices: {
                                ...editingItem.prices!,
                                xl: Number(e.target.value) || 0,
                              },
                            })
                          }
                          className="w-full px-2.5 py-1.5 rounded-lg bg-zinc-900 border border-zinc-700 text-white text-xs font-black tabular-nums"
                        />
                      </div>
                    </div>
                  ) : (
                    <div>
                      <span className="text-[10px] text-zinc-400 block font-semibold mb-1">
                        Standard Price (Rs.)
                      </span>
                      <input
                        type="number"
                        min="0"
                        value={editingItem.price || 0}
                        onChange={(e) =>
                          setEditingItem({
                            ...editingItem,
                            price: Number(e.target.value) || 0,
                          })
                        }
                        className="w-full px-3 py-2 rounded-xl bg-zinc-950 border border-zinc-800 text-white text-sm font-black tabular-nums focus:outline-none focus:border-amber-500"
                      />
                    </div>
                  )}
                </div>

                {/* IMAGE CONFIGURATION (UPLOAD FROM DEVICE OR LINK URL) */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="text-[11px] font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
                      <ImageIcon className="w-3.5 h-3.5" />
                      Product Picture / Image
                    </label>
                    <button
                      type="button"
                      onClick={() =>
                        setEditingItem({
                          ...editingItem,
                          image:
                            'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=800&q=80',
                        })
                      }
                      className="text-[10px] text-zinc-400 hover:text-red-400 transition-colors"
                      title="Reset / Remove custom image to default placeholder"
                    >
                      Clear / Reset Image
                    </button>
                  </div>

                  {/* Hidden file input for uploading from Phone Gallery or PC */}
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileUpload}
                    accept="image/*"
                    className="hidden"
                  />

                  {/* Dual Action: Upload File from Phone/PC OR Enter Web Link */}
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="flex-1 py-2 px-3 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/40 text-amber-400 text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer shadow-sm"
                    >
                      <Upload className="w-3.5 h-3.5" />
                      <span>Upload from Device / Gallery</span>
                    </button>
                  </div>

                  <div>
                    <span className="text-[10px] text-zinc-500 block mb-1">
                      Or paste an Image Link / URL:
                    </span>
                    <input
                      type="text"
                      required
                      value={editingItem.image}
                      onChange={(e) =>
                        setEditingItem({ ...editingItem, image: e.target.value })
                      }
                      placeholder="https://... direct image link"
                      className="w-full px-3 py-2 rounded-xl bg-zinc-950 border border-zinc-800 text-white text-xs focus:outline-none focus:border-amber-500"
                    />
                  </div>

                  {/* Interactive Drag & Drop Box with Live Preview */}
                  <div
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                    onClick={() => fileInputRef.current?.click()}
                    className={`relative h-36 w-full rounded-2xl overflow-hidden border-2 border-dashed transition-all cursor-pointer flex flex-col items-center justify-center group ${
                      isDragging
                        ? 'border-amber-400 bg-amber-500/20 scale-[1.01] shadow-lg shadow-amber-500/30'
                        : 'border-zinc-700 hover:border-amber-500/60 bg-zinc-950'
                    }`}
                  >
                    <img
                      src={editingItem.image}
                      alt="Preview"
                      className={`w-full h-full object-cover transition-opacity duration-300 ${
                        isDragging ? 'opacity-30 blur-xs' : 'opacity-85 group-hover:opacity-70'
                      }`}
                      onError={(e) => {
                        (e.currentTarget as HTMLImageElement).src =
                          'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=400&q=80';
                      }}
                    />

                    {/* Drag & Drop Prompt Overlay */}
                    <div className="absolute inset-0 flex flex-col items-center justify-center p-3 text-center pointer-events-none">
                      {isDragging ? (
                        <div className="bg-amber-500 text-zinc-950 font-black px-4 py-2 rounded-xl text-xs shadow-xl animate-bounce flex items-center gap-1.5">
                          <Upload className="w-4 h-4 stroke-[2.5]" />
                          Drop Image Here Now!
                        </div>
                      ) : (
                        <div className="bg-black/80 backdrop-blur-md px-3 py-1.5 rounded-xl border border-white/10 text-white text-[11px] font-semibold opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-2">
                          <Upload className="w-3.5 h-3.5 text-amber-400" />
                          <span>Drag & drop image from Google / website or click to upload</span>
                        </div>
                      )}
                    </div>

                    <div className="absolute bottom-2 right-2 bg-black/85 border border-white/10 px-2 py-0.5 rounded-md text-[10px] text-amber-400 font-bold backdrop-blur-sm flex items-center gap-1">
                      <span>✨ Drop from Google or Desktop</span>
                    </div>
                  </div>
                </div>

                {/* Description */}
                <div>
                  <label className="text-[11px] font-bold text-zinc-300 uppercase tracking-wider block mb-1">
                    Ingredients & Description
                  </label>
                  <textarea
                    rows={2}
                    value={editingItem.description}
                    onChange={(e) =>
                      setEditingItem({ ...editingItem, description: e.target.value })
                    }
                    placeholder="Ingredients, toppings, or spice level..."
                    className="w-full px-3 py-2 rounded-xl bg-zinc-950 border border-zinc-800 text-white text-xs focus:outline-none focus:border-amber-500 resize-none"
                  />
                </div>

                {/* Submit button */}
                <button
                  type="submit"
                  className="w-full py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-zinc-950 font-black text-xs transition-all shadow-lg shadow-amber-500/20 active:scale-95 cursor-pointer flex items-center justify-center gap-1.5"
                >
                  <Check className="w-4 h-4 stroke-[3]" />
                  Save & Apply Changes to Website
                </button>
              </form>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-center p-6 text-zinc-500 space-y-3 my-auto">
                <div className="w-12 h-12 rounded-2xl bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-400">
                  <Edit2 className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white mb-1">No Item Selected</h4>
                  <p className="text-[11px] max-w-xs text-zinc-400">
                    Click any item on the left to edit its prices and picture, or click{' '}
                    <span className="text-amber-400 font-semibold">"Add New Item"</span> to create a new pizza, burger or starter.
                  </p>
                </div>
                <button
                  onClick={handleAddNewClick}
                  className="px-4 py-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 text-amber-400 text-xs font-bold transition-all"
                >
                  + Add New Menu Item
                </button>
              </div>
            )}
          </div>
        </div>
        )}

        {/* TAB 2: SECTIONS BUILDER (ELEMENTOR STYLE ADD / REMOVE / TOGGLE SECTIONS) */}
        {activeTab === 'sections' && (
          <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 rounded-2xl bg-zinc-900 border border-zinc-800">
              <div>
                <h3 className="text-base font-black text-white flex items-center gap-2">
                  <LayoutTemplate className="w-5 h-5 text-amber-400" />
                  Elementor-Style Section Manager
                </h3>
                <p className="text-xs text-zinc-400 mt-1">
                  Apni marzi ke mutabiq poora section add ya remove (hide/show) karein. Changes foran live website par apply ho jayengi.
                </p>
              </div>

              <button
                type="button"
                onClick={() => {
                  setSectionsConfig({
                    announcementBar: true,
                    hero: true,
                    featurePillars: true,
                    dealsSection: true,
                    crownSpotlight: true,
                    menuSection: true,
                    aboutSection: true,
                    footer: true,
                  });
                  saveStoredSections({
                    announcementBar: true,
                    hero: true,
                    featurePillars: true,
                    dealsSection: true,
                    crownSpotlight: true,
                    menuSection: true,
                    aboutSection: true,
                    footer: true,
                  });
                  showToast('All sections enabled / shown!');
                }}
                className="px-3.5 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-bold transition-all cursor-pointer shrink-0"
              >
                Show All Sections
              </button>
            </div>

            {/* Sections List */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                {
                  key: 'announcementBar',
                  name: 'Top Announcement / Notification Bar',
                  desc: 'Top yellow bar with free delivery alert, hotline & opening timings.',
                },
                {
                  key: 'hero',
                  name: 'Hero Section (Main Banner)',
                  desc: 'Main top header with big headline "Magic In Every First Bite", pizza imagery & order buttons.',
                },
                {
                  key: 'featurePillars',
                  name: 'Feature Pillars (Why Choose Us)',
                  desc: '4 benefit cards: Stone-Fired Crust, 100% Real Mozzarella, Authentic Recipes, Thermal Delivery.',
                },
                {
                  key: 'dealsSection',
                  name: 'Special Deals & Combos Section',
                  desc: 'Family deals, midnight feast, burger combos with discounted pricing & savings badges.',
                },
                {
                  key: 'crownSpotlight',
                  name: 'Crown Crust Signature Spotlight',
                  desc: 'Special highlight banner for Seekh Kabab Stuffed Crown Crust with interactive size picker.',
                },
                {
                  key: 'menuSection',
                  name: 'Full Artisanal Menu & Search',
                  desc: 'Complete categorization (Pizzas, Burgers, Pastas, Starters) with search and filters.',
                },
                {
                  key: 'aboutSection',
                  name: 'Our Story & Gujranwala Location',
                  desc: 'Heritage story, customer reviews, chef highlights, and Gujranwala branch credentials.',
                },
                {
                  key: 'footer',
                  name: 'Website Footer',
                  desc: 'Footer navigation links, branch address, contact hotline and copyright.',
                },
              ].map((section) => {
                const isEnabled = sectionsConfig[section.key as keyof SiteSectionsConfig];
                return (
                  <div
                    key={section.key}
                    className={`p-4 rounded-2xl border transition-all flex items-start justify-between gap-4 ${
                      isEnabled
                        ? 'bg-zinc-900/60 border-zinc-800 hover:border-amber-500/40'
                        : 'bg-zinc-950/80 border-red-500/20 opacity-60'
                    }`}
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span
                          className={`w-2.5 h-2.5 rounded-full ${
                            isEnabled ? 'bg-emerald-400 animate-pulse' : 'bg-red-500'
                          }`}
                        />
                        <h4 className="text-sm font-bold text-white">{section.name}</h4>
                      </div>
                      <p className="text-xs text-zinc-400 leading-relaxed">
                        {section.desc}
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={() => {
                        const nextConfig = {
                          ...sectionsConfig,
                          [section.key]: !isEnabled,
                        };
                        setSectionsConfig(nextConfig);
                        saveStoredSections(nextConfig);
                        showToast(
                          !isEnabled
                            ? `Section "${section.name}" ADDED (Visible) on site!`
                            : `Section "${section.name}" REMOVED (Hidden) from site!`
                        );
                      }}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer shrink-0 ${
                        isEnabled
                          ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 hover:bg-red-500/20 hover:text-red-400 hover:border-red-500/30'
                          : 'bg-zinc-800 text-zinc-400 border border-zinc-700 hover:bg-emerald-500/20 hover:text-emerald-400 hover:border-emerald-500/40'
                      }`}
                    >
                      {isEnabled ? (
                        <>
                          <Eye className="w-3.5 h-3.5" />
                          <span>Visible (Remove)</span>
                        </>
                      ) : (
                        <>
                          <EyeOff className="w-3.5 h-3.5" />
                          <span>Hidden (Add)</span>
                        </>
                      )}
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* TAB 3: TEXT & CONTENT EDITOR (CLICK/FORM EDIT ALL HEADINGS, ANNOUNCEMENT, ETC.) */}
        {activeTab === 'texts' && (
          <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
            <div className="p-4 rounded-2xl bg-zinc-900 border border-zinc-800 flex items-center justify-between">
              <div>
                <h3 className="text-base font-black text-white flex items-center gap-2">
                  <Type className="w-5 h-5 text-amber-400" />
                  Live Website Content & Text Editor
                </h3>
                <p className="text-xs text-zinc-400 mt-1">
                  Yahan se aap Announcement Bar, Hero Headline, Phone, WhatsApp, aur Story ka koi bhi text live edit kar sakte hain.
                </p>
              </div>
              <button
                type="button"
                onClick={() => {
                  if (window.confirm('Reset all site texts and sections back to default?')) {
                    resetSiteContentAndSections();
                    setSiteContent(getStoredSiteContent());
                    setSectionsConfig(getStoredSections());
                    showToast('All texts & sections reset to default!');
                  }
                }}
                className="px-3 py-1.5 rounded-xl bg-zinc-800 hover:bg-red-500/20 hover:text-red-400 text-zinc-400 text-xs font-bold transition-all cursor-pointer"
              >
                Reset Default Texts
              </button>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                saveStoredSiteContent(siteContent);
                showToast('All website texts updated and saved successfully!');
              }}
              className="space-y-6"
            >
              {/* Group 1: Announcement Bar */}
              <div className="p-5 rounded-2xl bg-zinc-900/60 border border-zinc-800 space-y-4">
                <h4 className="text-xs font-bold text-amber-400 uppercase tracking-wider flex items-center gap-2">
                  <span>📢</span> Notification / Announcement Bar Text
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="text-[11px] font-semibold text-zinc-400 block mb-1">
                      Badge Tag
                    </label>
                    <input
                      type="text"
                      value={siteContent.announcementTag}
                      onChange={(e) =>
                        setSiteContent({ ...siteContent, announcementTag: e.target.value })
                      }
                      placeholder="Special Offer / Ramzan Deal"
                      className="w-full px-3 py-2 rounded-xl bg-zinc-950 border border-zinc-800 text-white text-xs focus:outline-none focus:border-amber-500"
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="text-[11px] font-semibold text-zinc-400 block mb-1">
                      Offer Message Text
                    </label>
                    <input
                      type="text"
                      value={siteContent.announcementText}
                      onChange={(e) =>
                        setSiteContent({ ...siteContent, announcementText: e.target.value })
                      }
                      placeholder="Free delivery message or current announcement..."
                      className="w-full px-3 py-2 rounded-xl bg-zinc-950 border border-zinc-800 text-white text-xs focus:outline-none focus:border-amber-500"
                    />
                  </div>
                </div>
              </div>

              {/* Group 2: Hero Main Banner */}
              <div className="p-5 rounded-2xl bg-zinc-900/60 border border-zinc-800 space-y-4">
                <h4 className="text-xs font-bold text-amber-400 uppercase tracking-wider flex items-center gap-2">
                  <span>🌟</span> Hero Section (Main Banner Texts)
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-[11px] font-semibold text-zinc-400 block mb-1">
                      Top Pill Badge
                    </label>
                    <input
                      type="text"
                      value={siteContent.heroBadge}
                      onChange={(e) =>
                        setSiteContent({ ...siteContent, heroBadge: e.target.value })
                      }
                      className="w-full px-3 py-2 rounded-xl bg-zinc-950 border border-zinc-800 text-white text-xs focus:outline-none focus:border-amber-500"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-semibold text-zinc-400 block mb-1">
                      Main Headline (Line 1)
                    </label>
                    <input
                      type="text"
                      value={siteContent.heroTitleLine1}
                      onChange={(e) =>
                        setSiteContent({ ...siteContent, heroTitleLine1: e.target.value })
                      }
                      className="w-full px-3 py-2 rounded-xl bg-zinc-950 border border-zinc-800 text-white text-xs focus:outline-none focus:border-amber-500"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-semibold text-zinc-400 block mb-1">
                      Golden Highlighted Text
                    </label>
                    <input
                      type="text"
                      value={siteContent.heroTitleHighlight}
                      onChange={(e) =>
                        setSiteContent({ ...siteContent, heroTitleHighlight: e.target.value })
                      }
                      className="w-full px-3 py-2 rounded-xl bg-zinc-950 border border-zinc-800 text-white text-xs focus:outline-none focus:border-amber-500"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-semibold text-zinc-400 block mb-1">
                      Primary Button Text
                    </label>
                    <input
                      type="text"
                      value={siteContent.heroButtonPrimary}
                      onChange={(e) =>
                        setSiteContent({ ...siteContent, heroButtonPrimary: e.target.value })
                      }
                      className="w-full px-3 py-2 rounded-xl bg-zinc-950 border border-zinc-800 text-white text-xs focus:outline-none focus:border-amber-500"
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="text-[11px] font-semibold text-zinc-400 block mb-1">
                      Hero Sub-Paragraph Description
                    </label>
                    <textarea
                      rows={2}
                      value={siteContent.heroDescription}
                      onChange={(e) =>
                        setSiteContent({ ...siteContent, heroDescription: e.target.value })
                      }
                      className="w-full px-3 py-2 rounded-xl bg-zinc-950 border border-zinc-800 text-white text-xs focus:outline-none focus:border-amber-500 resize-none"
                    />
                  </div>
                </div>
              </div>

              {/* Group 3: Contact, Brand & Timings */}
              <div className="p-5 rounded-2xl bg-zinc-900/60 border border-zinc-800 space-y-4">
                <h4 className="text-xs font-bold text-amber-400 uppercase tracking-wider flex items-center gap-2">
                  <span>📍</span> Brand Name, Hotline, WhatsApp & Timings
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="text-[11px] font-semibold text-zinc-400 block mb-1">
                      Brand / Restaurant Name
                    </label>
                    <input
                      type="text"
                      value={siteContent.restaurantName}
                      onChange={(e) =>
                        setSiteContent({ ...siteContent, restaurantName: e.target.value })
                      }
                      className="w-full px-3 py-2 rounded-xl bg-zinc-950 border border-zinc-800 text-white text-xs focus:outline-none focus:border-amber-500"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-semibold text-zinc-400 block mb-1">
                      Phone Hotline
                    </label>
                    <input
                      type="text"
                      value={siteContent.phone}
                      onChange={(e) =>
                        setSiteContent({ ...siteContent, phone: e.target.value })
                      }
                      className="w-full px-3 py-2 rounded-xl bg-zinc-950 border border-zinc-800 text-white text-xs focus:outline-none focus:border-amber-500"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-semibold text-zinc-400 block mb-1">
                      WhatsApp Number
                    </label>
                    <input
                      type="text"
                      value={siteContent.whatsapp}
                      onChange={(e) =>
                        setSiteContent({ ...siteContent, whatsapp: e.target.value })
                      }
                      className="w-full px-3 py-2 rounded-xl bg-zinc-950 border border-zinc-800 text-white text-xs focus:outline-none focus:border-amber-500"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-semibold text-zinc-400 block mb-1">
                      City / Area
                    </label>
                    <input
                      type="text"
                      value={siteContent.city}
                      onChange={(e) =>
                        setSiteContent({ ...siteContent, city: e.target.value })
                      }
                      className="w-full px-3 py-2 rounded-xl bg-zinc-950 border border-zinc-800 text-white text-xs focus:outline-none focus:border-amber-500"
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="text-[11px] font-semibold text-zinc-400 block mb-1">
                      Opening Timings
                    </label>
                    <input
                      type="text"
                      value={siteContent.openingHours}
                      onChange={(e) =>
                        setSiteContent({ ...siteContent, openingHours: e.target.value })
                      }
                      className="w-full px-3 py-2 rounded-xl bg-zinc-950 border border-zinc-800 text-white text-xs focus:outline-none focus:border-amber-500"
                    />
                  </div>
                </div>
              </div>

              {/* Group 4: About & Story Section */}
              <div className="p-5 rounded-2xl bg-zinc-900/60 border border-zinc-800 space-y-4">
                <h4 className="text-xs font-bold text-amber-400 uppercase tracking-wider flex items-center gap-2">
                  <span>📖</span> About Section Story & Details
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-[11px] font-semibold text-zinc-400 block mb-1">
                      Story Main Heading
                    </label>
                    <input
                      type="text"
                      value={siteContent.aboutTitle}
                      onChange={(e) =>
                        setSiteContent({ ...siteContent, aboutTitle: e.target.value })
                      }
                      className="w-full px-3 py-2 rounded-xl bg-zinc-950 border border-zinc-800 text-white text-xs focus:outline-none focus:border-amber-500"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-semibold text-zinc-400 block mb-1">
                      Story Subtitle Highlight
                    </label>
                    <input
                      type="text"
                      value={siteContent.aboutSubtitle}
                      onChange={(e) =>
                        setSiteContent({ ...siteContent, aboutSubtitle: e.target.value })
                      }
                      className="w-full px-3 py-2 rounded-xl bg-zinc-950 border border-zinc-800 text-white text-xs focus:outline-none focus:border-amber-500"
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="text-[11px] font-semibold text-zinc-400 block mb-1">
                      Paragraph 1
                    </label>
                    <textarea
                      rows={2}
                      value={siteContent.aboutText1}
                      onChange={(e) =>
                        setSiteContent({ ...siteContent, aboutText1: e.target.value })
                      }
                      className="w-full px-3 py-2 rounded-xl bg-zinc-950 border border-zinc-800 text-white text-xs focus:outline-none focus:border-amber-500 resize-none"
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="text-[11px] font-semibold text-zinc-400 block mb-1">
                      Paragraph 2
                    </label>
                    <textarea
                      rows={2}
                      value={siteContent.aboutText2}
                      onChange={(e) =>
                        setSiteContent({ ...siteContent, aboutText2: e.target.value })
                      }
                      className="w-full px-3 py-2 rounded-xl bg-zinc-950 border border-zinc-800 text-white text-xs focus:outline-none focus:border-amber-500 resize-none"
                    />
                  </div>
                </div>
              </div>

              {/* Save Button */}
              <button
                type="submit"
                className="w-full py-3.5 rounded-2xl bg-amber-500 hover:bg-amber-400 text-zinc-950 font-black text-xs transition-all shadow-xl shadow-amber-500/20 active:scale-95 cursor-pointer flex items-center justify-center gap-2"
              >
                <Check className="w-4 h-4 stroke-[3]" />
                <span>Save All Website Content Live</span>
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

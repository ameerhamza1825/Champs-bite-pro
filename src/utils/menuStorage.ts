import { MenuItem, DealItem } from '../types';
import { MENU_ITEMS, DEALS } from '../data/menuData';

const MENU_STORAGE_KEY = 'champs_bites_menu_items_v2';
const DEALS_STORAGE_KEY = 'champs_bites_deals_v2';

// Load stored menu items or default to INITIAL menu
export function getStoredMenuItems(): MenuItem[] {
  try {
    const raw = localStorage.getItem(MENU_STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch (e) {
    console.error('Failed reading menu from localStorage', e);
  }
  return MENU_ITEMS;
}

// Save menu items
export function saveStoredMenuItems(items: MenuItem[]): void {
  try {
    localStorage.setItem(MENU_STORAGE_KEY, JSON.stringify(items));
    window.dispatchEvent(new Event('champs_menu_updated'));
  } catch (e) {
    console.error('Failed saving menu to localStorage', e);
  }
}

// Reset menu to defaults
export function resetMenuToDefaults(): MenuItem[] {
  try {
    localStorage.removeItem(MENU_STORAGE_KEY);
    window.dispatchEvent(new Event('champs_menu_updated'));
  } catch (e) {
    console.error('Failed resetting menu in localStorage', e);
  }
  return MENU_ITEMS;
}

// Load stored deals
export function getStoredDeals(): DealItem[] {
  try {
    const raw = localStorage.getItem(DEALS_STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch (e) {
    console.error('Failed reading deals from localStorage', e);
  }
  return DEALS;
}

// Save deals
export function saveStoredDeals(deals: DealItem[]): void {
  try {
    localStorage.setItem(DEALS_STORAGE_KEY, JSON.stringify(deals));
    window.dispatchEvent(new Event('champs_deals_updated'));
  } catch (e) {
    console.error('Failed saving deals to localStorage', e);
  }
}

// Reset deals to defaults
export function resetDealsToDefaults(): DealItem[] {
  try {
    localStorage.removeItem(DEALS_STORAGE_KEY);
    window.dispatchEvent(new Event('champs_deals_updated'));
  } catch (e) {
    console.error('Failed resetting deals in localStorage', e);
  }
  return DEALS;
}

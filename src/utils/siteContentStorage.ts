// Storage utility for website content, section visibility, and copy editing (Elementor style)
import { RESTAURANT_INFO } from '../data/menuData';

export interface SiteSectionsConfig {
  announcementBar: boolean;
  hero: boolean;
  featurePillars: boolean;
  dealsSection: boolean;
  crownSpotlight: boolean;
  menuSection: boolean;
  aboutSection: boolean;
  footer: boolean;
}

export interface SiteContentConfig {
  announcementText: string;
  announcementTag: string;
  heroBadge: string;
  heroTitleLine1: string;
  heroTitleHighlight: string;
  heroDescription: string;
  heroButtonPrimary: string;
  heroButtonSecondary: string;
  restaurantName: string;
  tagline: string;
  phone: string;
  whatsapp: string;
  address: string;
  city: string;
  openingHours: string;
  aboutTitle: string;
  aboutSubtitle: string;
  aboutText1: string;
  aboutText2: string;
}

const SECTIONS_STORAGE_KEY = 'champs_site_sections_visibility_v1';
const CONTENT_STORAGE_KEY = 'champs_site_custom_content_v1';

export const DEFAULT_SECTIONS: SiteSectionsConfig = {
  announcementBar: true,
  hero: true,
  featurePillars: true,
  dealsSection: true,
  crownSpotlight: true,
  menuSection: true,
  aboutSection: true,
  footer: true,
};

export const DEFAULT_SITE_CONTENT: SiteContentConfig = {
  announcementText: `Free Delivery on orders above Rs. ${RESTAURANT_INFO.freeDeliveryThreshold.toLocaleString()} in ${RESTAURANT_INFO.city}`,
  announcementTag: 'Special Offer',
  heroBadge: "Artisanal Pizzeria · Gujranwala's No. 1 Crust",
  heroTitleLine1: 'Magic In Every',
  heroTitleHighlight: 'First Bite.',
  heroDescription:
    'Stone-hearth baked pizzas loaded with 100% whole milk mozzarella, mouth-watering seekh kabab stuffed crusts, juicy zinger burgers, and smoky BBQ wings. Baked hot & delivered fresh across Gujranwala.',
  heroButtonPrimary: 'Explore Full Menu',
  heroButtonSecondary: 'Special Deals & Combos',
  restaurantName: RESTAURANT_INFO.name,
  tagline: RESTAURANT_INFO.tagline,
  phone: RESTAURANT_INFO.phone,
  whatsapp: RESTAURANT_INFO.whatsappRaw,
  address: RESTAURANT_INFO.address,
  city: RESTAURANT_INFO.city,
  openingHours: RESTAURANT_INFO.openingHours,
  aboutTitle: 'The Champs Bites Story —',
  aboutSubtitle: 'Proudly Born in Gujranwala',
  aboutText1:
    'At Champs Bites, we believe great pizza begins with uncompromising passion. We set out to redefine pizza culture in Gujranwala by replacing mass-produced frozen bases with genuine slow-fermented, stone-baked artisan dough.',
  aboutText2:
    'Every single pizza is hand-stretched, topped with 100% whole milk mozzarella, and baked inside high-heat stone hearth ovens. Combined with our legendary local flavor profiles like creamy Malai Boti, smoky Behari Kabab, and our signature Crown Crust, we guarantee magic in your very first bite.',
};

export function getStoredSections(): SiteSectionsConfig {
  try {
    const raw = localStorage.getItem(SECTIONS_STORAGE_KEY);
    if (raw) {
      return { ...DEFAULT_SECTIONS, ...JSON.parse(raw) };
    }
  } catch (e) {
    console.error('Error reading sections visibility', e);
  }
  return DEFAULT_SECTIONS;
}

export function saveStoredSections(sections: SiteSectionsConfig): void {
  try {
    localStorage.setItem(SECTIONS_STORAGE_KEY, JSON.stringify(sections));
    window.dispatchEvent(new Event('champs_content_updated'));
  } catch (e) {
    console.error('Error saving sections visibility', e);
  }
}

export function getStoredSiteContent(): SiteContentConfig {
  try {
    const raw = localStorage.getItem(CONTENT_STORAGE_KEY);
    if (raw) {
      return { ...DEFAULT_SITE_CONTENT, ...JSON.parse(raw) };
    }
  } catch (e) {
    console.error('Error reading site content', e);
  }
  return DEFAULT_SITE_CONTENT;
}

export function saveStoredSiteContent(content: SiteContentConfig): void {
  try {
    localStorage.setItem(CONTENT_STORAGE_KEY, JSON.stringify(content));
    window.dispatchEvent(new Event('champs_content_updated'));
  } catch (e) {
    console.error('Error saving site content', e);
  }
}

export function resetSiteContentAndSections(): void {
  try {
    localStorage.removeItem(SECTIONS_STORAGE_KEY);
    localStorage.removeItem(CONTENT_STORAGE_KEY);
    window.dispatchEvent(new Event('champs_content_updated'));
  } catch (e) {
    console.error('Error resetting site content', e);
  }
}

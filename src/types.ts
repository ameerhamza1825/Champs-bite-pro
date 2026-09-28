export type PizzaSizeKey = 'small' | 'medium' | 'large' | 'xl';

export interface PizzaSizeConfig {
  key: PizzaSizeKey;
  name: string;
  inches: string;
  slices: number;
  serves: string;
  badge?: string;
}

export interface CrustOption {
  id: string;
  name: string;
  description: string;
  priceModifier: {
    small: number;
    medium: number;
    large: number;
    xl: number;
  };
}

export interface MenuItem {
  id: string;
  name: string;
  category: string;
  description: string;
  image: string;
  isPizza?: boolean;
  isCrown?: boolean;
  isSpicy?: boolean;
  isVegetarian?: boolean;
  badge?: string;
  price?: number;
  prices?: Record<PizzaSizeKey, number>;
  variants?: Array<{
    size: string;
    price: number;
  }>;
}

export interface DealItem {
  id: string;
  name: string;
  type: 'starter' | 'burger' | 'mega';
  items: string[];
  price: number;
  oldPrice?: number;
  saveAmount?: number;
  tag?: string;
  image?: string;
}

export interface CartItem {
  cartItemId: string;
  menuItemId?: string;
  name: string;
  details?: string;
  price: number;
  quantity: number;
  image?: string;
  selectedSize?: string;
  selectedCrust?: string;
  selectedAddons?: string[];
}

export interface RestaurantInfo {
  name: string;
  tagline: string;
  phone: string;
  hotline: string;
  whatsappRaw: string;
  address: string;
  city: string;
  openingHours: string;
  freeDeliveryThreshold: number;
  standardDeliveryFee: number;
}

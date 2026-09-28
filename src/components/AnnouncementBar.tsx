import React from 'react';
import { Phone, Flame, Clock } from 'lucide-react';
import { RESTAURANT_INFO } from '../data/menuData';

interface AnnouncementBarProps {
  customText?: string;
  customTag?: string;
  customPhone?: string;
  customHours?: string;
  isVisualEditMode?: boolean;
  onEditClick?: (field: string) => void;
}

export const AnnouncementBar: React.FC<AnnouncementBarProps> = ({
  customText,
  customTag,
  customPhone,
  customHours,
  isVisualEditMode,
  onEditClick,
}) => {
  const tag = customTag || 'Special Offer';
  const text =
    customText ||
    `Free Delivery on orders above Rs. ${RESTAURANT_INFO.freeDeliveryThreshold.toLocaleString()} in ${RESTAURANT_INFO.city}`;
  const phone = customPhone || RESTAURANT_INFO.phone;
  const hours = customHours || RESTAURANT_INFO.openingHours;

  return (
    <div
      onClick={() => isVisualEditMode && onEditClick?.('announcement')}
      className={`bg-gradient-to-r from-amber-600 via-amber-500 to-amber-600 text-zinc-950 font-semibold text-xs py-2 px-4 select-none relative transition-all ${
        isVisualEditMode
          ? 'cursor-pointer hover:ring-2 hover:ring-amber-300 hover:ring-inset'
          : ''
      }`}
    >
      {isVisualEditMode && (
        <span className="absolute left-2 top-1/2 -translate-y-1/2 bg-black text-amber-400 text-[9px] font-black uppercase px-1.5 py-0.5 rounded shadow">
          ✎ Edit Bar
        </span>
      )}
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2 text-center sm:text-left">
        <div className="flex items-center gap-2 mx-auto sm:mx-0">
          <span className="flex items-center gap-1 bg-zinc-950 text-amber-400 text-[10px] uppercase font-black px-2 py-0.5 rounded-full">
            <Flame className="w-3 h-3 text-amber-400 animate-pulse" />
            {tag}
          </span>
          <span className="text-zinc-950 font-medium">{text}</span>
        </div>

        <div className="hidden md:flex items-center gap-4 text-[11px] font-medium text-zinc-950/90">
          <div className="flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 text-zinc-950" />
            <span>{hours}</span>
          </div>
          <span className="opacity-40">•</span>
          <a
            href={`tel:${phone}`}
            className="flex items-center gap-1.5 hover:text-white transition-colors"
          >
            <Phone className="w-3.5 h-3.5 text-zinc-950" />
            <span className="font-bold">Hotline: {phone}</span>
          </a>
        </div>
      </div>
    </div>
  );
};

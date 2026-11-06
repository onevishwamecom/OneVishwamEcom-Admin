import React from 'react';

/**
 * Standard OneVishwam Category Configurations (Single Source of Truth)
 * Canonical categories across all portals without duplicates.
 */
export const CATEGORY_CONFIG = {
  properties: { label: 'Properties', icon: 'fa-house-chimney', color: 'bg-blue-50 text-brand-blue border-blue-100' },
  automobiles: { label: 'Automobiles', icon: 'fa-car-side', color: 'bg-amber-50 text-amber-700 border-amber-200' },
  electronics: { label: 'Consumer Electronics', icon: 'fa-tv', color: 'bg-teal-50 text-teal-700 border-teal-200' },
  comfort: { label: 'Bedding & Comfort', icon: 'fa-bed', color: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
  bedding: { label: 'Bedding & Comfort', icon: 'fa-bed', color: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
  groceries: { label: 'Groceries', icon: 'fa-basket-shopping', color: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
  garments: { label: 'Garments', icon: 'fa-shirt', color: 'bg-purple-50 text-purple-700 border-purple-200' },
  jewellery: { label: 'Jewellery', icon: 'fa-gem', color: 'bg-cyan-50 text-cyan-700 border-cyan-200' },
  finance: { label: 'Finance', icon: 'fa-building-columns', color: 'bg-indigo-50 text-indigo-700 border-indigo-200' },
  services: { label: 'Services', icon: 'fa-wrench', color: 'bg-slate-100 text-slate-700 border-slate-200' },
};

/**
 * Normalizes any category string or legacy alias to the canonical category key.
 */
export function normalizeCategoryKey(category) {
  if (!category) return '';
  const k = String(category).trim().toLowerCase();
  switch (k) {
    case 'property':
    case 'properties':
    case 'real-estate':
      return 'properties';
    case 'vehicle':
    case 'vehicles':
    case 'automobile':
    case 'automobiles':
      return 'automobiles';
    case 'grocery':
    case 'groceries':
      return 'groceries';
    case 'garment':
    case 'garments':
      return 'garments';
    case 'jewellery':
    case 'jewelry':
      return 'jewellery';
    case 'finance':
    case 'finance-offerings':
    case 'finance-lending':
      return 'finance';
    case 'electronic':
    case 'electronics':
    case 'consumer-electronics':
    case 'consumer_electronics':
      return 'electronics';
    case 'bedding':
    case 'bedding-comfort':
    case 'bedding_comfort':
    case 'comfort':
      return 'comfort';
    case 'service':
    case 'services':
      return 'services';
    default:
      return k;
  }
}

/**
 * Reusable CategoryBadge with icon box and label matching screenshot design.
 */
export function CategoryBadge({
  category = 'properties',
  label,
  icon,
  className = '',
  showIconBox = true,
  cfgMap,
}) {
  const key = normalizeCategoryKey(category);
  const cfg = cfgMap?.[key] || CATEGORY_CONFIG[key] || {
    label: label || category || 'General',
    icon: icon || 'fa-box-open',
    color: 'bg-blue-50 text-brand-blue border-blue-100',
  };

  const displayLabel = label || cfg.label;
  const displayIcon = icon || cfg.icon;

  if (!showIconBox) {
    return (
      <span
        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold border ${cfg.color} ${className}`}
      >
        <i className={`fa-solid ${displayIcon} text-[11px]`} />
        <span>{displayLabel}</span>
      </span>
    );
  }

  return (
    <div className={`flex items-center gap-2 whitespace-nowrap ${className}`}>
      <span
        className={`w-7 h-7 rounded-lg border flex items-center justify-center ${cfg.color} shrink-0`}
      >
        <i className={`fa-solid ${displayIcon} text-[11px]`} />
      </span>
      <span className="text-xs font-semibold text-slate-700">{displayLabel}</span>
    </div>
  );
}

export default CategoryBadge;

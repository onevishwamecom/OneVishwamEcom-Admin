/**
 * PHASE 1 — CATEGORY / SECTOR METADATA (static configuration, not data).
 * ============================================================================
 * Labels, icons and form fields for each OneVishwam sector. Live counts are
 * derived from the data source by the admin data-access layer (`adminApi`),
 * so this module stays dependency-free.
 * ============================================================================
 */

export const CATEGORY_TO_TYPE = {
  'real-estate': 'properties',
  property: 'properties',
  properties: 'properties',
  vehicle: 'vehicles',
  vehicles: 'vehicles',
  automobile: 'vehicles',
  automobiles: 'vehicles',
  grocery: 'groceries',
  groceries: 'groceries',
  garment: 'garments',
  garments: 'garments',
  jewellery: 'jewellery',
  finance: 'finance',
  service: 'services',
  services: 'services',
  electronic: 'electronics',
  electronics: 'electronics',
  'consumer-electronics': 'electronics',
  'consumer_electronics': 'electronics',
  bedding: 'bedding',
  'bedding-comfort': 'bedding',
  'bedding_comfort': 'bedding',
  comfort: 'bedding',
};

export const TYPE_TO_CATEGORY = Object.fromEntries(
  Object.entries(CATEGORY_TO_TYPE).map(([k, v]) => [v, k]),
);

export const typeKeyOf = (categoryId) => CATEGORY_TO_TYPE[categoryId] || categoryId;
export const categoryIdOf = (typeKey) => TYPE_TO_CATEGORY[typeKey] || typeKey;

export const CATEGORIES = [
  {
    id: 'properties',
    label: 'Properties',
    icon: 'fa-house-chimney',
    gradient: 'from-brand-blue to-brand-blue/70',
    fields: [
      { key: 'bhk', label: 'BHK' },
      { key: 'bathrooms', label: 'Bathrooms' },
      { key: 'area_sqft', label: 'Area' },
      { key: 'furnishing', label: 'Furnishing' },
      { key: 'floor', label: 'Floor' },
      { key: 'parking', label: 'Parking' },
      { key: 'projectCount', label: 'Total Projects' },
      { key: 'totalUnits', label: 'Total Units' },
      { key: 'availableUnits', label: 'Available Units' },
    ],
  },
  {
    id: 'vehicles',
    label: 'Automobiles',
    icon: 'fa-car',
    gradient: 'from-brand-gold to-brand-gold/70',
    fields: [
      { key: 'brand', label: 'Brand' },
      { key: 'model', label: 'Model' },
      { key: 'year', label: 'Year' },
      { key: 'condition', label: 'Condition' },
      { key: 'category', label: 'Category' },
      { key: 'fuelType', label: 'Fuel Type' },
      { key: 'transmission', label: 'Transmission' },
      { key: 'kmDriven', label: 'KM Driven' },
    ],
  },
  {
    id: 'electronics',
    label: 'Consumer Electronics',
    icon: 'fa-tv',
    gradient: 'from-teal-500 to-teal-600',
    fields: [
      { key: 'brand', label: 'Brand' },
      { key: 'model', label: 'Model' },
      { key: 'category', label: 'Category' },
      { key: 'subcategory', label: 'Subcategory' },
      { key: 'condition', label: 'Condition' },
      { key: 'warranty', label: 'Warranty' },
    ],
  },
  {
    id: 'bedding',
    label: 'Bedding & Comfort',
    icon: 'fa-bed',
    gradient: 'from-emerald-500 to-teal-600',
    fields: [
      { key: 'brand', label: 'Brand' },
      { key: 'material', label: 'Material' },
      { key: 'size', label: 'Size' },
      { key: 'firmness', label: 'Firmness' },
      { key: 'warranty', label: 'Warranty' },
    ],
  },
  {
    id: 'groceries',
    label: 'Groceries',
    icon: 'fa-basket-shopping',
    gradient: 'from-brand-orange to-brand-orange/70',
    fields: [
      { key: 'quantity', label: 'Quantity' },
      { key: 'unit', label: 'Unit' },
      { key: 'organic', label: 'Organic' },
    ],
  },
  {
    id: 'garments',
    label: 'Garments',
    icon: 'fa-shirt',
    gradient: 'from-slate-400 to-slate-500',
    fields: [
      { key: 'size', label: 'Size' },
      { key: 'color', label: 'Color' },
      { key: 'material', label: 'Material' },
    ],
  },
  {
    id: 'jewellery',
    label: 'Jewellery',
    icon: 'fa-gem',
    gradient: 'from-brand-blue to-brand-blue/60',
    fields: [
      { key: 'material', label: 'Material' },
      { key: 'purity', label: 'Purity' },
      { key: 'weight', label: 'Weight (g)' },
      { key: 'gemstone', label: 'Gemstone' },
      { key: 'occasion', label: 'Occasion' },
    ],
  },
  {
    id: 'finance',
    label: 'Finance',
    icon: 'fa-building-columns',
    gradient: 'from-brand-gold to-brand-orange',
    fields: [
      { key: 'serviceType', label: 'Service Type' },
      { key: 'interestRate', label: 'Interest Rate' },
      { key: 'tenureMin', label: 'Tenure Min (Yr)' },
      { key: 'tenureMax', label: 'Tenure Max (Yr)' },
    ],
  },
  {
    id: 'services',
    label: 'Services',
    icon: 'fa-wrench',
    gradient: 'from-slate-500 to-gray-500',
    fields: [
      { key: 'serviceType', label: 'Service Type' },
      { key: 'experience', label: 'Experience (Years)' },
    ],
  },
];

export function getCategoryById(categoryId) {
  const norm = CATEGORY_TO_TYPE[categoryId] || categoryId;
  return CATEGORIES.find((c) => c.id === norm || c.id === categoryId) || null;
}

export function getMockCategories() {
  return CATEGORIES.map((category) => ({ ...category }));
}

export default CATEGORIES;

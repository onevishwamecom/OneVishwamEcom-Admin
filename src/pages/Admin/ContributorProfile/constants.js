export const TYPE_ICONS = {
  properties: 'fa-building',
  vehicles: 'fa-car',
  groceries: 'fa-basket-shopping',
  garments: 'fa-shirt',
  jewellery: 'fa-gem',
  finance: 'fa-hand-holding-dollar',
  services: 'fa-wrench',
};

export function typeIcon(type) {
  return TYPE_ICONS[type] || 'fa-tag';
}
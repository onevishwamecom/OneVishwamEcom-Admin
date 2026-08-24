export function sanitizeText(value) {
  if (value === null || value === undefined) return '';
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

export function getDisplayId(item) {
  if (!item) return null;
  return item._id || item.id || null;
}

export function formatDate(dateString, fallback = 'N/A') {
  if (!dateString) return fallback;
  try {
    return new Date(dateString).toLocaleDateString();
  } catch {
    return fallback;
  }
}

export function safeParseInt(value, fallback = 0) {
  const n = parseInt(value, 10);
  return isNaN(n) ? fallback : n;
}

export function safeParseFloat(value, fallback = 0) {
  const n = parseFloat(value);
  return isNaN(n) ? fallback : n;
}

export function currentYear() {
  return new Date().getFullYear();
}

const LAKH = 100000;
const CRORE = 10000000;

export function formatINR(value, { compact = false, asCents = false } = {}) {
  if (value === null || value === undefined || value === '') return '';

  let num = Number(value);
  if (isNaN(num)) return String(value);

  if (asCents) num = num / 100;

  const sign = num < 0 ? '-' : '';
  const abs = Math.abs(num);

  if (compact && abs >= CRORE) return `${sign}₹${(abs / CRORE).toFixed(1).replace(/\.0$/, '')} Cr`;
  if (compact && abs >= LAKH) return `${sign}₹${(abs / LAKH).toFixed(1).replace(/\.0$/, '')} L`;

  const isDecimal = !Number.isInteger(abs);
  const [intPart, decPart] = isDecimal ? abs.toFixed(2).split('.') : [String(Math.round(abs)), null];

  const last3 = intPart.slice(-3);
  const rest = intPart.slice(0, -3);
  let grouped = rest
    ? rest.replace(/\B(?=(\d{2})+(?!\d))/g, ',') + ',' + last3
    : last3;

  let result = `${sign}₹${grouped}`;
  if (decPart) result += `.${decPart}`;
  return result.trim();
}

export function isImageUrl(url) {
  return typeof url === 'string' && url.trim().startsWith('http');
}

const MINUTE = 60 * 1000;
const HOUR = 60 * MINUTE;

/** Human-friendly relative time for the admin activity feed. */
export function formatTimeAgo(dateString, fallback = 'N/A') {
  if (!dateString) return fallback;
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return fallback;

  const diff = Date.now() - date.getTime();
  if (diff < MINUTE) return 'Just now';

  const startOfToday = new Date();
  startOfToday.setHours(0, 0, 0, 0);
  const startOfDay = new Date(startOfToday.getTime());
  const startOfYesterday = new Date(startOfDay.getTime() - 24 * HOUR);

  if (diff < HOUR) return `${Math.floor(diff / MINUTE)}m ago`;
  if (date >= startOfDay) {
    return `Today, ${date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })}`;
  }
  if (date >= startOfYesterday) {
    return `Yesterday, ${date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })}`;
  }
  return date.toLocaleDateString('en-US', { day: 'numeric', month: 'short' });
}

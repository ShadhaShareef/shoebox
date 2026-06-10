export const formatMoney = (value: number) =>
  new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(value);

export const formatDate = (value: Date | string) => {
  const date = typeof value === 'string' ? new Date(value) : value;
  return new Intl.DateTimeFormat('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }).format(date);
};

export const formatDistance = (km: number) => `${km.toFixed(km < 10 ? 1 : 0)} km`;

export const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value));

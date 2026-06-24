export function formatMoney(cents: number, currency: string = 'egp'): string {
  return new Intl.NumberFormat('en-EG', {
    style: 'currency',
    currency: currency,
  }).format(cents / 100);
}
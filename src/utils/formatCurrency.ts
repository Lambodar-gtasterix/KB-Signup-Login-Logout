// src/utils/formatCurrency.ts

export const formatINR = (value: number | null | undefined): string => {
  const numeric = typeof value === 'number' && !Number.isNaN(value) ? value : 0;
  try {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(numeric);
  } catch {
    const rounded = Math.round(numeric);
    return `INR ${rounded.toLocaleString('en-IN')}`;
  }
};

export const formatMoney = formatINR;

import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Format a number as a currency.
 * 
 * @param value The number to format. (should be in cents)
 * @returns The formatted currency as string.
 */
export function formatMoney(value: number, type?: 'clear' | null) {
  const realValue = value / 100
  
  const result = new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(realValue)

  if (type === 'clear') {
    return result.replace('R$', '').trim()
  } else {
    return result
  }
}

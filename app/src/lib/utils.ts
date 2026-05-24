import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const fmt = (n: number) =>
  n >= 100000 ? `₹${(n / 100000).toFixed(2)}L Cr` : `₹${(n / 1000).toFixed(0)}K Cr`

export const fmtShort = (n: number) =>
  n >= 100000 ? `${(n / 100000).toFixed(1)}L` : `${(n / 1000).toFixed(0)}K`

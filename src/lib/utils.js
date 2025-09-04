import { clsx } from 'clsx';
import { cva } from 'class-variance-authority';

export function cn(...inputs) {
  return clsx(inputs);
}

export { cva }; 
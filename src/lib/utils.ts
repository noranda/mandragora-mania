import {twJoin, twMerge} from 'tailwind-merge';

type ClassValue = Parameters<typeof twJoin>[0];

export function cn(...inputs: ClassValue[]) {
  return twMerge(twJoin(inputs));
}

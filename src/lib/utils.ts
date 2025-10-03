import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type WithoutChild<T> = T extends { child?: any } ? Omit<T, 'child'> : T;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type WithoutChildren<T> = T extends { children?: any } ? Omit<T, 'children'> : T;
export type WithoutChildrenOrChild<T> = WithoutChildren<WithoutChild<T>>;
export type WithElementRef<T, U extends HTMLElement = HTMLElement> = T & { ref?: U | null };

export function debounce<T extends unknown[], U>(
	callback: (...args: T) => PromiseLike<U> | U,
	wait: number
) {
	let timer: number;

	return (...args: T): Promise<U> => {
		clearTimeout(timer);
		return new Promise((resolve) => {
			timer = setTimeout(() => resolve(callback(...args)), wait) as never as number;
		});
	};
}

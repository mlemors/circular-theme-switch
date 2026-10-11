export interface RippleOptions { event?: MouseEvent; duration?: number; easing?: string }
export declare function revealTheme(apply: () => void | Promise<void>, options?: RippleOptions): Promise<boolean>;
export declare function createThemeToggle(options?: {
  initialTheme?: 'dark' | 'light'; storageKey?: string | null; onChange?: (theme: 'dark' | 'light') => void;
}): { readonly theme: 'dark' | 'light'; toggle(event?: MouseEvent, options?: Omit<RippleOptions, 'event'>): Promise<boolean> };

'use client';
import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { getThemePreference, saveThemePreference, type Theme } from '../utils/themeStorage';

interface ThemeContextType {
		theme: Theme;
		setTheme: (theme: Theme) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: ReactNode }) {
		// Always start with default theme to match server rendering
		const [theme, setThemeState] = useState<Theme>('dark');
		const [mounted, setMounted] = useState(false);

		// Load theme from localStorage only on client
		useEffect(() => {
				const savedTheme = getThemePreference();
				setThemeState(savedTheme);
				applyTheme(savedTheme);
				setMounted(true);
		}, []);

		// Apply theme class to <html> element
		const applyTheme = (newTheme: Theme) => {
				if (typeof document === 'undefined') return;

				const html = document.documentElement;

				html.classList.remove('light', 'dark', 'green');
				html.classList.add(newTheme);
		};

		const setTheme = (newTheme: Theme) => {
				setThemeState(newTheme);
				saveThemePreference(newTheme);
				applyTheme(newTheme);
		};

		// Prevent hydration mismatch by not rendering until mounted
		if (!mounted) {
				return <>{children}</>;
		}

		return (
				<ThemeContext.Provider value={{ theme, setTheme }}>
						{children}
				</ThemeContext.Provider>
		);
}

export function useTheme() {
		const context = useContext(ThemeContext);
		if (context === undefined) {
				throw new Error('useTheme must be used within a ThemeProvider');
		}
		return context;
}

export type { Theme };
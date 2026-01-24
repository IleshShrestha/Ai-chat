const THEME_STORAGE_KEY = 'themePreference';

export type Theme = 'light' | 'dark' | 'green';

const DEFAULT_THEME: Theme = 'dark';

export function getThemePreference(): Theme {
	if (typeof window === 'undefined') {
		return DEFAULT_THEME;
	}

	try {
		const savedTheme = localStorage.getItem(THEME_STORAGE_KEY);
		if (savedTheme && ['light', 'dark', 'green'].includes(savedTheme)) {
			return savedTheme as Theme;
		}
	} catch (error) {
		console.error('Error reading theme preference:', error);
	}

	return DEFAULT_THEME;
}


export function saveThemePreference(theme: Theme): void {
	if (typeof window === 'undefined') {
		return;
	}

	try {
		localStorage.setItem(THEME_STORAGE_KEY, theme);
	} catch (error) {
		console.error('Error saving theme preference:', error);
	}
}

import { ThemeOptions } from '@/common/ui/mui'

/**
 * Design tokens — single source of truth for brand colors and
 * component defaults. The CSS variables in `src/app/globals.css`
 * mirror these values; keep both files in sync when changing them.
 */

/**
 * Brand gradient (blue → purple) — the friendly accent used by
 * `primarygradient` buttons, the toolbar, search input etc.
 * The purple intentionally lives here and NOT in `palette.primary.dark`,
 * so MUI hover/active darkening stays a real darker blue.
 */
export const gradient = {
	from: '#0085FF',
	to: '#532EE7',
}

export const theme = {
	palette: {
		primary: {
			light: '#54AAFF',
			main: '#0085FF',
			dark: '#0068C9',
			contrastText: '#FFFFFF',
		},
		secondary: {
			main: '#EBBC1E',
		},
		success: {
			main: '#43A047',
		},
	},
	components: {
		MuiButton: {
			defaultProps: {
				disableElevation: true,
			},
			styleOverrides: {
				root: {
					borderRadius: 8,
				},
			},
		},
		MuiCard: {
			styleOverrides: {
				root: {
					borderRadius: 12,
				},
			},
		},
		MuiDialog: {
			styleOverrides: {
				paper: {
					borderRadius: 12,
				},
			},
		},
		MuiOutlinedInput: {
			styleOverrides: {
				root: {
					borderRadius: 8,
				},
			},
		},
		MuiTooltip: {
			styleOverrides: {
				tooltip: {
					borderRadius: 6,
				},
			},
		},
	},
}

// Type checks, dont remove
const a: ThemeOptions = theme

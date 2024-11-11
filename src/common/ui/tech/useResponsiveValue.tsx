import { ResponsiveStyleValue, useMediaQuery, useTheme } from '@mui/system'

export function useResponsiveValue<T>(
	responsiveValue: ResponsiveStyleValue<T>
): T {
	const theme = useTheme()

	// Kontrolujeme jednotlivé breakpoints od nejmenšího k největšímu
	const matchesXs = useMediaQuery(theme.breakpoints.only('xs'))
	const matchesSm = useMediaQuery(theme.breakpoints.only('sm'))
	const matchesMd = useMediaQuery(theme.breakpoints.only('md'))
	const matchesLg = useMediaQuery(theme.breakpoints.only('lg'))
	const matchesXl = useMediaQuery(theme.breakpoints.only('xl'))

	// Vrátí nejbližší dostupnou hodnotu pokud není přesný breakpoint přítomen
	const getClosestValue = (): T => {
		if (typeof responsiveValue !== 'object') return responsiveValue

		const r: any = responsiveValue
		if (matchesXl && r.xl !== undefined) return r.xl
		if (matchesLg && r.lg !== undefined) return r.lg
		if (matchesMd && r.md !== undefined) return r.md
		if (matchesSm && r.sm !== undefined) return r.sm
		if (matchesXs && r.xs !== undefined) return r.xs

		// get existing key
		const values = Object.values(r) as T[]
		return values.length > 0 ? values[0] : (null as T)
	}

	return getClosestValue()
}

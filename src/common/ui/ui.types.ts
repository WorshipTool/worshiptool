export type ColorThemeType =
	| 'primary'
	| 'secondary'
	| 'success'
	| 'error'
	| 'inherit'
export type ColorType = ColorThemeType | StringColor

// Create type for string color, but auto complete colortype still
type StringColor = string & {}

export const isColorOfThemeType = (color: ColorType): color is ColorThemeType =>
	['primary', 'secondary', 'success', 'error', 'inherit'].includes(
		color as string
	)

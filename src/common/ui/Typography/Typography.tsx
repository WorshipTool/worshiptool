import { Typography as Typo } from '@mui/material'

type CustomTypographyProps = {
	children?: string
	variant?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'normal'
	strong?: boolean | number
}

export function Typography({
	children,
	variant = 'normal',
	strong = false,
}: CustomTypographyProps) {
	const fontWeight = strong ? (strong === true ? 700 : strong) : undefined

	const typoVariant = variant === 'normal' ? 'body1' : variant

	return (
		<Typo variant={typoVariant} fontWeight={fontWeight}>
			{children}
		</Typo>
	)
}

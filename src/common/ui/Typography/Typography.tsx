import { ColorType } from '@/common/ui/ui.types'
import { Typography as Typo } from '@mui/material'

type CustomTypographyProps = {
	children?: React.ReactNode
	variant?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'normal'
	strong?: boolean | number
	color?: ColorType
}

export function Typography({
	children,
	variant = 'normal',
	strong = false,
	color,
}: CustomTypographyProps) {
	const fontWeight = strong ? (strong === true ? 700 : strong) : undefined

	const typoVariant = variant === 'normal' ? 'body1' : variant

	return (
		<Typo variant={typoVariant} fontWeight={fontWeight} color={color}>
			{children}
		</Typo>
	)
}

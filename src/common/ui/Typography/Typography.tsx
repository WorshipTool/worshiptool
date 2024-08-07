import { ColorType } from '@/common/ui/ui.types'
import { SxProps, Typography as Typo } from '@mui/material'

type CustomTypographyProps = {
	children?: React.ReactNode
	variant?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'normal'
	strong?: boolean | number
	color?: ColorType
	size?: number | string
	align?: 'center' | 'inherit' | 'left' | 'right' | 'justify'
	sx?: SxProps
}

export function Typography({
	children,
	variant = 'normal',
	strong = false,
	color,
	size,
	...props
}: CustomTypographyProps) {
	const fontWeight = strong ? (strong === true ? 700 : strong) : undefined

	const typoVariant = variant === 'normal' ? 'body1' : variant

	return (
		<Typo
			variant={typoVariant}
			color={color}
			fontWeight={fontWeight}
			sx={{
				fontSize: size,
				...props.sx,
			}}
			align={props.align}
		>
			{children}
		</Typo>
	)
}

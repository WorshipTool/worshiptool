import { Typography } from '@/common/ui/Typography'
import { Info } from '@mui/icons-material'
import { Box } from '@mui/material'

import { ReactNode, useMemo } from 'react'
import './InfoButton.styles.css'

type InfoButtonProps = {
	label?: string
	children?: ReactNode
	expandedWidth?: number
	lineCount?: number
}

export function InfoButton(props: InfoButtonProps) {
	const icon = useMemo(() => {
		return (
			<Info
				fontSize="small"
				color="inherit"
				sx={{
					color: 'grey.600',
				}}
			/>
		)
	}, [])

	const targetWidth = props.expandedWidth || 300
	const targetHeight = props.lineCount ? props.lineCount * 30 + 'px' : undefined

	return (
		<Box
			className={'info-button'}
			sx={{
				// height: '1rem',
				// transform: 'translateY(-5px)',
				'&:hover .info-button-text-box': {
					width: targetWidth,
					height: targetHeight,
				},
			}}
		>
			<Box
				width={30}
				height={30}
				display={'flex'}
				justifyContent={'center'}
				alignItems={'center'}
			>
				{icon}
			</Box>
			<Box className={'info-button-text-box'}>
				<Box
					sx={{
						width: targetWidth,
						height: targetHeight,
						pointerEvents: 'none',
					}}
				>
					<Box
						width={30}
						height={30}
						display={'flex'}
						justifyContent={'center'}
						alignItems={'center'}
						sx={{
							position: 'absolute',
							left: 0,
						}}
					>
						{icon}
					</Box>
					<Typography className="info-button-text" size={'small'}>
						{props.label}
						{props.children}
					</Typography>
				</Box>
			</Box>
		</Box>
	)
}

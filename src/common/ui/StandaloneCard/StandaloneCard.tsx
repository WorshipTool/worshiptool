import { Gap } from '@/common/ui/Gap'
import { Typography } from '@/common/ui/Typography'
import { Box } from '@mui/material'
import { useMemo } from 'react'

type StandaloneCardProps = {
	title: string
	subtitle?: string
	children?: React.ReactNode
	variant?: 'default' | 'secondary'
}

export function StandaloneCard(props: StandaloneCardProps) {
	const variant = useMemo(() => props.variant ?? 'default', [props.variant])
	const defaultVariant = useMemo(() => variant === 'default', [variant])
	return (
		<Box
			sx={{
				maxWidth: '500px',
			}}
		>
			<Box
				sx={{
					backgroundColor: defaultVariant ? 'white' : 'grey.200',
					borderRadius: 5,
					padding: 2,
					paddingX: 6,
					paddingBottom: 4,
					display: 'flex',
					flexDirection: 'column',
					alignItems: defaultVariant ? 'center' : 'start',

					boxShadow: '0px 1px 4px rgba(0, 0, 0, 0.1)',
				}}
			>
				<Box
					display={'flex'}
					flexDirection={'row'}
					alignItems={'center'}
					gap={1}
				>
					<Typography
						size={defaultVariant ? '2.5rem' : '2rem'}
						strong={defaultVariant ? 600 : 400}
					>
						{props.title}
					</Typography>

					{!defaultVariant && (
						<>
							{/* <Box
								sx={{
									width: '16px',
									height: '16px',
									bgcolor: defaultVariant ? 'primary.main' : 'secondary.main',
								}}
							/> */}
						</>
					)}
				</Box>
				<Typography
					align={defaultVariant ? 'center' : 'left'}
					size={'1.1rem'}
					color="grey.600"
				>
					{props.subtitle}
				</Typography>
				{props.children !== undefined && <Gap value={2} />}
				{props.children}
			</Box>
		</Box>
	)
}

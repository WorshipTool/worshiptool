import { Box, Typography } from '@/common/ui'
import { ReactNode } from 'react'

type SideSectionProps = {
	title?: string
	children: ReactNode
}

/**
 * A light card used in the song page sidebar (note, media, sources…).
 */
export default function SideSection({ title, children }: SideSectionProps) {
	return (
		<Box
			sx={{
				backgroundColor: 'background.paper',
				borderRadius: 3,
				borderStyle: 'solid',
				borderWidth: 1,
				borderColor: 'grey.200',
				boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.04)',
				padding: 2.5,
				display: 'flex',
				flexDirection: 'column',
				gap: 1.5,
			}}
		>
			{title && (
				<Typography
					small
					strong={600}
					uppercase
					color="text.secondary"
					sx={{ letterSpacing: '0.06em' }}
				>
					{title}
				</Typography>
			)}
			{children}
		</Box>
	)
}

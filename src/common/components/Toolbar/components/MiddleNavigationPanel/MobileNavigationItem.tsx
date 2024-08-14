import { Button } from '@/common/ui/Button'
import { RoutesKeys } from '@/routes'
import { useSmartMatch } from '@/routes/useSmartMatch'
import { Box } from '@mui/material'
import { useMemo } from 'react'

type MobileNavigationItemProps = {
	title: string
	enabled?: boolean
	onClick?: () => void
	to?: RoutesKeys
}

export default function MobileNavigationItem(props: MobileNavigationItemProps) {
	const match = useSmartMatch(props.to || 'home')

	const enabled = useMemo(
		() => props.enabled ?? (props.to ? match : false),
		[props.enabled, match, props.to]
	)

	return (
		<Box
			sx={{
				pointerEvents: 'auto',
				bgcolor: enabled ? 'grey.300' : 'transparent',
				// bgcolor: 'grey.300',
				transition: 'background-color 0.2s',
				minWidth: 130,
			}}
			flex={1}
			padding={1}
		>
			<Button
				variant="text"
				color="inherit"
				size="small"
				to={props.to}
				onClick={props.onClick}
				sx={{
					borderRadius: 2,
				}}
			>
				{props.title}
			</Button>
		</Box>
	)
}

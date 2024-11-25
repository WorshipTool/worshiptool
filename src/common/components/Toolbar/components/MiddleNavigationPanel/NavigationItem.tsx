import { Box } from '@/common/ui'
import { Button } from '@/common/ui/Button'
import { RoutesKeys, SmartAllParams } from '@/routes'
import { useSmartMatch } from '@/routes/useSmartMatch'
import { useMemo } from 'react'

export type NavigationItemProps<T extends RoutesKeys> = {
	title: string
	enabled?: boolean
	onClick?: () => void
	to?: T
	toParams?: SmartAllParams<T>
}

export default function NavigationItem<T extends RoutesKeys>(
	props: NavigationItemProps<T>
) {
	const match = useSmartMatch(props.to || 'home')

	const enabled = useMemo(
		() => props.enabled ?? (props.to ? match : false),
		[props.enabled, match, props.to]
	)

	return (
		<Box
			sx={{
				pointerEvents: 'auto',
				bgcolor: enabled ? 'rgba(0,0,0,0.09)' : 'transparent',
				borderRadius: 2,
				transition: 'background-color 0.2s',
				paddingX: 1,
			}}
		>
			<Button
				variant="text"
				color="inherit"
				size="small"
				to={props.to}
				toParams={props.toParams}
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

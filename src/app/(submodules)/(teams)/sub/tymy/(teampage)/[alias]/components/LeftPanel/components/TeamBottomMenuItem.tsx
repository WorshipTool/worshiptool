import { TeamBarMenuTypes } from '@/app/(submodules)/(teams)/sub/tymy/(teampage)/[alias]/components/LeftPanel/components/MenuItem'
import { useTeamLeftMenuItems } from '@/app/(submodules)/(teams)/sub/tymy/(teampage)/[alias]/components/LeftPanel/hooks/useTeamLeftMenuItems'
import { Box, Button, Typography, useTheme } from '@/common/ui'
import { useMediaQuery } from '@/common/ui/mui'
import { useSmartMatch } from '@/routes/useSmartMatch'

type Props = {
	item: TeamBarMenuTypes
	title?: string
	noTitle?: boolean
}

export default function TeamBottomMenuItem({ item, title, ...props }: Props) {
	const items = useTeamLeftMenuItems()

	const data = items.find((itm) => itm.id === item) || null

	const theme = useTheme()
	const isBig = !useMediaQuery('(max-width: 400px)')
	const isOn = useSmartMatch(data?.to || null)

	const showTitle = (isBig || isOn) && !props.noTitle

	return data ? (
		<Box flex={1}>
			<Button
				variant="text"
				color={isOn ? 'primary' : 'grey.800'}
				to={data.to}
				toParams={data.toParams}
				disableUppercase
			>
				<Box
					sx={{
						display: 'flex',
						alignItems: 'center',
						justifyContent: 'center',
						flexDirection: 'row',
					}}
					gap={0.5}
				>
					{data.icon}
					{showTitle && <Typography small>{title || data.title}</Typography>}
				</Box>
			</Button>
		</Box>
	) : null
}

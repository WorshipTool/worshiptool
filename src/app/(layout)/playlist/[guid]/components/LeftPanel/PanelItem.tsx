import { Box, Typography } from '@/common/ui'
import { Skeleton } from '@/common/ui/mui/Skeleton'
import { parseVariantAlias } from '@/routes/routes.tech'
import { styled } from '@mui/system'
import { useMemo } from 'react'
import { Link } from '../../../../../../common/ui/Link/Link'
import { PlaylistItemGuid } from '../../../../../../interfaces/playlist/playlist.types'
import useInnerPlaylist from '../../hooks/useInnerPlaylist'

const PanelItemContainer = styled(Box)(({ theme }) => ({
	backgroundColor: theme.palette.grey[50],
	boxShadow: `0px 0px 5px ${theme.palette.grey[400]}`,
	borderRadius: 8,
	display: 'flex',
	flexDirection: 'row',
	'&:hover': {
		backgroundColor: theme.palette.grey[200],
		boxShadow: `0px 0px 9px ${theme.palette.grey[400]}`,
	},
	cursor: 'pointer',
	justifyContent: 'center',
	alignItems: 'center',
	paddingRight: 7,
	scrollMarginTop: theme.spacing(0.5),
}))

const StyledPanelButton = styled(Typography)(({ theme }) => ({
	display: 'flex',
	alignItems: 'center',
	flex: 1,
	padding: 9,
	paddingLeft: 0,
}))

interface PanelItemProps {
	itemGuid: PlaylistItemGuid
	itemIndex: number
}

export default function PanelItem({ itemGuid, itemIndex }: PanelItemProps) {
	const { loading, items } = useInnerPlaylist()

	const item = useMemo(() => {
		return items.find((i) => i.guid === itemGuid)!
	}, [items, itemGuid])

	const onPanelItemClickCall = (guid: string) => {
		const el = document.getElementById('playlistItem_' + guid)
		el?.scrollIntoView({
			behavior: 'smooth',
			block: 'start',
		})
	}

	return !item ? (
		<></>
	) : (
		<Link
			to="variant"
			params={{
				...parseVariantAlias(item.pack.packAlias),
			}}
			onlyWithShift
		>
			<PanelItemContainer id={'panelItem_' + item.guid}>
				{!loading ? (
					<>
						<Typography
							sx={{
								padding: '9px',
								paddingLeft: '14px',
							}}
							strong={900}
						>
							{itemIndex + 1}.
						</Typography>
						<StyledPanelButton onClick={() => onPanelItemClickCall(item.guid)}>
							{item.pack.title}
						</StyledPanelButton>
					</>
				) : (
					<Skeleton
						variant="text"
						width={200}
						sx={{ marginLeft: 2 }}
						key={'skelet' + item.guid}
					></Skeleton>
				)}
			</PanelItemContainer>
		</Link>
	)
}

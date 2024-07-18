import { Box, Skeleton, Typography, styled } from '@mui/material'
import { Link } from '../../../../../../common/ui/Link/CustomLink'
import { PlaylistItemDto } from '../../../../../../interfaces/playlist/playlist.types'
import { parseVariantAlias } from '../../../../../../routes'
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
	item: PlaylistItemDto
}

export default function PanelItem({ item }: PanelItemProps) {
	const { loading } = useInnerPlaylist()

	const onPanelItemClickCall = (guid: string) => {
		const el = document.getElementById('playlistItem_' + guid)
		el?.scrollIntoView({
			behavior: 'smooth',
			block: 'start',
		})
	}

	return (
		<Link
			to="variant"
			params={{
				...parseVariantAlias(item.variant.packAlias),
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
							fontWeight={900}
						>
							{item.order + 1}.
						</Typography>
						<StyledPanelButton onClick={() => onPanelItemClickCall(item.guid)}>
							{item.variant.preferredTitle}
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

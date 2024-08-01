import Panel from '@/app/(layout)/playlist/[guid]/components/Panel'
import PresentationButton from '@/app/(layout)/playlist/[guid]/components/TopPanel/components/PresentationButton/PresentationButton'
import PrintButton from '@/app/(layout)/playlist/[guid]/components/TopPanel/components/PrintButton/PrintButton'
import SaveEditButtons from '@/app/(layout)/playlist/[guid]/components/TopPanel/components/SaveEditButtons/SaveEditButtons'
import ShareButton from '@/app/(layout)/playlist/[guid]/components/TopPanel/components/ShareButton/ShareButton'
import TitleBox from '@/app/(layout)/playlist/[guid]/components/TopPanel/components/TitleBox/TitleBox'
import useInnerPlaylist from '@/app/(layout)/playlist/[guid]/hooks/useInnerPlaylist'
import { Box, useTheme } from '@mui/material'
export default function TopPlaylistPanel() {
	const { canUserEdit } = useInnerPlaylist()
	const theme = useTheme()
	return (
		<Panel
			sx={{
				minHeight: '2.4rem',
				display: 'flex',
				flexWrap: 'wrap',
				alignItems: 'center',
				justifyContent: 'space-between',
				position: 'sticky',
				top: 56,
				zIndex: 1,
				[theme.breakpoints.down('sm')]: {
					position: 'relative',
					top: 0,
					zIndex: 0,
				},
			}}
		>
			<TitleBox />
			<Box display={'flex'} flexDirection={'row'} alignItems={'center'} gap={1}>
				<PresentationButton />
				<PrintButton />
				<ShareButton />
				{canUserEdit && (
					<Box
						display={{
							xs: 'none',
							sm: 'flex',
						}}
					>
						<Box />
						<SaveEditButtons />
					</Box>
				)}
			</Box>
		</Panel>
	)
}

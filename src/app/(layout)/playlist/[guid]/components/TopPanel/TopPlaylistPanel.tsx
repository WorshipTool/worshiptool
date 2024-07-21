import Panel from '@/app/(layout)/playlist/[guid]/components/Panel'
import PresentationButton from '@/app/(layout)/playlist/[guid]/components/TopPanel/components/PresentationButton/PresentationButton'
import PrintButton from '@/app/(layout)/playlist/[guid]/components/TopPanel/components/PrintButton/PrintButton'
import SaveEditButtons from '@/app/(layout)/playlist/[guid]/components/TopPanel/components/SaveEditButtons/SaveEditButtons'
import ShareButton from '@/app/(layout)/playlist/[guid]/components/TopPanel/components/ShareButton/ShareButton'
import TitleBox from '@/app/(layout)/playlist/[guid]/components/TopPanel/components/TitleBox/TitleBox'
import { Box } from '@mui/material'
export default function TopPlaylistPanel() {
	return (
		<Panel
			sx={{
				height: '2.4rem',
				display: 'flex',
				alignItems: 'center',
				justifyContent: 'space-between',
				position: 'sticky',
				top: 56,
				zIndex: 1,
			}}
		>
			<TitleBox />
			<Box display={'flex'} flexDirection={'row'} alignItems={'center'} gap={1}>
				<PresentationButton />
				<PrintButton />
				<ShareButton />
				<Box />
				<SaveEditButtons />
			</Box>
		</Panel>
	)
}

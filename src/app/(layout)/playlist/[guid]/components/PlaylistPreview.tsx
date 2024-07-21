import LeftPanel from '@/app/(layout)/playlist/[guid]/components/LeftPanel/LeftPanel'
import MiddlePanel from '@/app/(layout)/playlist/[guid]/components/MiddlePanel/MiddlePanel'
import TopPlaylistPanel from '@/app/(layout)/playlist/[guid]/components/TopPanel/TopPlaylistPanel'
import Card from '@/common/ui/Card/Card'
import { Info } from '@mui/icons-material'
import { Box } from '@mui/material'

export default function PlaylistPreview() {
	return (
		<Box position={'relative'}>
			<TopPlaylistPanel />
			<Card
				icon={<Info />}
				subtitle="Playlist nelze na telefonu editovat. Pro editaci použij prosím
					počítač."
				sx={{
					marginX: 2,
					marginTop: 2,
					display: { xs: 'block', sm: 'none' },
				}}
			></Card>
			<Box display={'flex'} flexDirection={'row'} position={'relative'}>
				<LeftPanel />
				<MiddlePanel />
			</Box>
		</Box>
	)
}

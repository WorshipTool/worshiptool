import PresentationButton from '@/app/(layout)/playlist/[guid]/components/TopPanel/components/PresentationButton/PresentationButton'
import PrintButton from '@/app/(layout)/playlist/[guid]/components/TopPanel/components/PrintButton/PrintButton'
import ShareButton from '@/app/(layout)/playlist/[guid]/components/TopPanel/components/ShareButton/ShareButton'
import TitleBox from '@/app/(layout)/playlist/[guid]/components/TopPanel/components/TitleBox/TitleBox'
import { Box } from '@mui/material'

export default function TeamPlaylistTopPanel() {
	return (
		<Box
			flex={1}
			display={'flex'}
			flexDirection={'row'}
			justifyContent={'space-between'}
		>
			<TitleBox />
			<Box display={'flex'} flexDirection={'row'} alignItems={'center'} gap={1}>
				<PresentationButton />
				<PrintButton />
				<ShareButton />
				{/* {canUserEdit && (
					<Box
						display={{
							xs: 'none',
							sm: 'flex',
						}}
					>
						<Box />
						<SaveEditButtons />
					</Box>
				)} */}
			</Box>
		</Box>
	)
}

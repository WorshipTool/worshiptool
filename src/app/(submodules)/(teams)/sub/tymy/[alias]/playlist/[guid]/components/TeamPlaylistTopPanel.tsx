import PresentationButton from '@/app/(layout)/playlist/[guid]/components/TopPanel/components/PresentationButton/PresentationButton'
import PrintButton from '@/app/(layout)/playlist/[guid]/components/TopPanel/components/PrintButton/PrintButton'
import SaveEditButtons from '@/app/(layout)/playlist/[guid]/components/TopPanel/components/SaveEditButtons/SaveEditButtons'
import ShareButton from '@/app/(layout)/playlist/[guid]/components/TopPanel/components/ShareButton/ShareButton'
import TitleBox from '@/app/(layout)/playlist/[guid]/components/TopPanel/components/TitleBox/TitleBox'
import useInnerPlaylist from '@/app/(layout)/playlist/[guid]/hooks/useInnerPlaylist'
import TeamPlaylistMoreButton from '@/app/(submodules)/(teams)/sub/tymy/[alias]/playlist/[guid]/components/TeamPlaylistMoreButton'
import { Box } from '@/common/ui'
import { Gap } from '@/common/ui/Gap'

export default function TeamPlaylistTopPanel() {
	const { canUserEdit } = useInnerPlaylist()
	return (
		<Box
			flex={1}
			display={'flex'}
			flexDirection={'row'}
			justifyContent={'space-between'}
		>
			<TitleBox />
			<Box display={'flex'} flexDirection={'row'} alignItems={'center'} gap={1}>
				<TeamPlaylistMoreButton />
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
						{/* <Box /> */}
						<Gap horizontal />
						<SaveEditButtons />
					</Box>
				)}
			</Box>
		</Box>
	)
}

import PresentationButton from '@/app/(layout)/playlist/[guid]/components/TopPanel/components/PresentationButton/PresentationButton'
import PrintButton from '@/app/(layout)/playlist/[guid]/components/TopPanel/components/PrintButton/PrintButton'
import SaveEditButtons from '@/app/(layout)/playlist/[guid]/components/TopPanel/components/SaveEditButtons/SaveEditButtons'
import ShareButton from '@/app/(layout)/playlist/[guid]/components/TopPanel/components/ShareButton/ShareButton'
import TitleBox from '@/app/(layout)/playlist/[guid]/components/TopPanel/components/TitleBox/TitleBox'
import useInnerPlaylist from '@/app/(layout)/playlist/[guid]/hooks/useInnerPlaylist'
import TeamPlaylistMoreButton, {
	TEAM_PLAYLIST_MORE_BUTTON_ID,
} from '@/app/(submodules)/(teams)/sub/tymy/(teampage)/[alias]/playlist/[guid]/components/TeamPlaylistMoreButton'
import useInnerTeam from '@/app/(submodules)/(teams)/sub/tymy/(teampage)/hooks/useInnerTeam'
import { SmartPortalMenuProvider } from '@/common/components/SmartPortalMenuItem/SmartPortalMenuProvider'
import { Box } from '@/common/ui'
import { Gap } from '@/common/ui/Gap'

export default function TeamPlaylistTopPanel() {
	const { canUserEdit, guid } = useInnerPlaylist()
	const { alias } = useInnerTeam()
	return (
		<SmartPortalMenuProvider id={TEAM_PLAYLIST_MORE_BUTTON_ID}>
			<Box
				flex={1}
				display={'flex'}
				flexDirection={'row'}
				justifyContent={'space-between'}
			>
				<TitleBox />
				<Box
					display={'flex'}
					flexDirection={'row'}
					alignItems={'center'}
					gap={1}
				>
					<TeamPlaylistMoreButton />
					<PresentationButton
						to="teamPlaylistCards"
						toParams={{
							alias,
							guid,
						}}
					/>
					<PrintButton />
					<ShareButton />
					{canUserEdit && (
						<Box
							display={{
								xs: 'none',
								sm: 'none',
								md: 'flex',
							}}
						>
							{/* <Box /> */}
							<Gap horizontal />
							<SaveEditButtons />
						</Box>
					)}
				</Box>
			</Box>
		</SmartPortalMenuProvider>
	)
}

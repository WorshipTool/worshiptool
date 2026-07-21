import LeftPanel from '@/app/(layout)/playlist/[guid]/components/LeftPanel/LeftPanel'
import MiddlePanel from '@/app/(layout)/playlist/[guid]/components/MiddlePanel/MiddlePanel'
import PlaylistMobile from '@/app/(layout)/playlist/[guid]/components/PlaylistMobile'
import SongDropPlaylistContainer from '@/app/(layout)/playlist/[guid]/components/SongDropPlaylistContainer'
import TopPlaylistPanel from '@/app/(layout)/playlist/[guid]/components/TopPanel/TopPlaylistPanel'
import { MOBILE_NAV_BREAKPOINT } from '@/common/components/MobileAppTabBar/nav.constants'
import { Box, useTheme } from '@/common/ui'
import { useMediaQuery } from '@/common/ui/mui'

export default function PlaylistPreview() {
	const theme = useTheme()
	const phoneVersion = useMediaQuery(theme.breakpoints.down(MOBILE_NAV_BREAKPOINT))

	// phones get the native-feeling app-shell layout; desktop keeps the classic
	// three-panel editor below, unchanged
	if (phoneVersion) return <PlaylistMobile />

	return (
		<SongDropPlaylistContainer>
			<Box position={'relative'}>
				<TopPlaylistPanel />

				<Box
					display={'flex'}
					flexDirection={'row'}
					position={'relative'}
					minHeight={'calc(100vh - 140px)'}
				>
					<LeftPanel />
					<MiddlePanel />
					{/* <RightPanel /> */}
				</Box>
			</Box>
		</SongDropPlaylistContainer>
	)
}

'use client'

import { PlaylistData } from '@/api/generated'
import CreateNewPlaylistButton from '@/app/(layout)/ucet/playlisty/components/CreateNewPlaylistButton'
import PlaylistsOrderSelect, {
	PlaylistOrderOptions,
} from '@/app/(layout)/ucet/playlisty/components/PlaylistsOrderSelect'
import { Box, Typography, useTheme } from '@/common/ui'
import { Link } from '@/common/ui/Link/Link'
import { Chip } from '@/common/ui/mui'
import { Skeleton } from '@/common/ui/mui/Skeleton'
import { getSmartDateAgoString } from '@/tech/date/date.tech'
import { czechConjugation } from '@/tech/string/string.tech'
import { ChevronRightRounded, QueueMusicRounded } from '@mui/icons-material'

const PAGE_MAX_WIDTH = 480
// on app-shell routes the top bar's sticky spacer shrinks to the safe-area
// inset (Toolbar.tsx); reclaim exactly that so the grey canvas reaches the top
const TOOLBAR_SPACER = 'env(safe-area-inset-top)'
const CONTENT_CLEARANCE = 'calc(env(safe-area-inset-bottom) + 96px)'

type PlaylistyMobileProps = {
	playlists: PlaylistData[]
	loading: boolean
	sortType: PlaylistOrderOptions
	onSortChange: (type: PlaylistOrderOptions) => void
}

/**
 * Native-feeling mobile list of the user's playlists: white cards on the grey
 * canvas (matching the songs list) with a gradient playlist thumbnail, song
 * count and last-updated date. The desktop table-ish rows stay in page.tsx;
 * this component owns the phone view.
 */
export default function PlaylistyMobile({
	playlists,
	loading,
	sortType,
	onSortChange,
}: PlaylistyMobileProps) {
	const theme = useTheme()

	const card = (p: PlaylistData) => (
		<Link key={p.guid} to="playlist" params={{ guid: p.guid }}>
			<Box
				sx={{
					display: 'flex',
					alignItems: 'center',
					gap: 1.5,
					bgcolor: 'background.paper',
					boxShadow: 1,
					borderRadius: 2,
					paddingX: 1.75,
					paddingY: 1.25,
					transition: 'background-color 0.15s ease',
					'&:active': { bgcolor: 'grey.100' },
				}}
			>
				<Box
					sx={{
						width: 48,
						height: 48,
						flexShrink: 0,
						borderRadius: 1.5,
						display: 'flex',
						alignItems: 'center',
						justifyContent: 'center',
						color: 'common.white',
						background: `linear-gradient(120deg, ${theme.palette.primary.main}, ${theme.palette.primary.dark})`,
					}}
				>
					<QueueMusicRounded />
				</Box>

				<Box sx={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column' }}>
					<Typography strong noWrap>
						{p.title || 'Bez názvu'}
					</Typography>
					<Typography small color="grey.600" noWrap>
						{p.itemsCount > 0 ? p.itemsCount : 'Žádná'}{' '}
						{czechConjugation('píseň', 'písně', 'písní', p.itemsCount)}
						{' · '}
						{getSmartDateAgoString(new Date(p.updatedAt))}
					</Typography>
				</Box>

				{p.teamName ? (
					<Chip label={p.teamName} size="small" color="primary" />
				) : null}

				<ChevronRightRounded sx={{ color: 'grey.400', flexShrink: 0 }} />
			</Box>
		</Link>
	)

	return (
		<Box
			sx={{
				// full-bleed: escape the SmartPage padded wrapper and the toolbar spacer
				width: '100vw',
				marginLeft: 'calc(50% - 50vw)',
				marginTop: `calc(-1 * ${TOOLBAR_SPACER})`,
				minHeight: '100dvh',
				bgcolor: 'grey.300',
				display: 'flex',
				justifyContent: 'center',
			}}
		>
			<Box
				sx={{
					width: '100%',
					maxWidth: PAGE_MAX_WIDTH,
					minWidth: 0,
					minHeight: '100dvh',
					bgcolor: 'grey.100',
					display: 'flex',
					flexDirection: 'column',
					boxShadow: 3,
				}}
			>
				<Box
					sx={{
						paddingX: 2.5,
						paddingTop: 'calc(env(safe-area-inset-top) + 24px)',
						paddingBottom: 1.5,
						display: 'flex',
						flexDirection: 'column',
						gap: 1.5,
					}}
				>
					<Box
						sx={{
							display: 'flex',
							alignItems: 'center',
							justifyContent: 'space-between',
							gap: 1,
						}}
					>
						<Typography variant="h4" strong={800}>
							Moje playlisty
						</Typography>
						<CreateNewPlaylistButton />
					</Box>

					{!loading && playlists.length > 0 && (
						<Box
							sx={{
								display: 'flex',
								alignItems: 'center',
								justifyContent: 'space-between',
								gap: 1,
							}}
						>
							<Typography small color="grey.600">
								{playlists.length}{' '}
								{czechConjugation(
									'playlist',
									'playlisty',
									'playlistů',
									playlists.length
								)}
							</Typography>
							<PlaylistsOrderSelect
								onChange={onSortChange}
								startValue={sortType}
							/>
						</Box>
					)}
				</Box>

				<Box
					sx={{
						paddingX: 2.5,
						paddingTop: 1,
						paddingBottom: CONTENT_CLEARANCE,
						display: 'flex',
						flexDirection: 'column',
						gap: 1,
					}}
				>
					{loading ? (
						Array.from({ length: 6 }).map((_, i) => (
							<Skeleton
								key={i}
								variant="rounded"
								sx={{ height: 72, borderRadius: 2, bgcolor: 'grey.200' }}
							/>
						))
					) : playlists.length === 0 ? (
						<Box
							sx={{
								display: 'flex',
								flexDirection: 'column',
								alignItems: 'center',
								textAlign: 'center',
								gap: 1,
								paddingTop: 8,
								paddingX: 3,
							}}
						>
							<QueueMusicRounded sx={{ fontSize: 48, color: 'grey.400' }} />
							<Typography color="grey.600">
								Zatím nemáš žádný playlist. Vytvoř si první tlačítkem nahoře.
							</Typography>
						</Box>
					) : (
						playlists.map(card)
					)}
				</Box>
			</Box>
		</Box>
	)
}

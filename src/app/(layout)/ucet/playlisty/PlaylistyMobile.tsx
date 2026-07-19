'use client'

import { PlaylistData } from '@/api/generated'
import CreateNewPlaylistButton from '@/app/(layout)/ucet/playlisty/components/CreateNewPlaylistButton'
import PlaylistsOrderSelect, {
	PlaylistOrderOptions,
} from '@/app/(layout)/ucet/playlisty/components/PlaylistsOrderSelect'
import { Box, Typography } from '@/common/ui'
import { Link } from '@/common/ui/Link/Link'
import { Chip } from '@/common/ui/mui'
import { Skeleton } from '@/common/ui/mui/Skeleton'
import { getSmartDateAgoString } from '@/tech/date/date.tech'
import { czechConjugation } from '@/tech/string/string.tech'
import { ChevronRightRounded, QueueMusicRounded } from '@mui/icons-material'
import { Fragment } from 'react'

// on app-shell routes the top bar's sticky spacer shrinks to the safe-area
// inset (Toolbar.tsx); reclaim exactly that so the grey canvas reaches the top
const TOOLBAR_SPACER = 'env(safe-area-inset-top)'
const CONTENT_CLEARANCE = 'calc(env(safe-area-inset-bottom) + 96px)'

// the playlists live in one white "group" surface (iOS-style grouped list);
// rows are separated by a hairline inset to the text (no leading thumbnail —
// playlists stay text-only, matching the desktop look)
const GROUP_CARD_SX = {
	bgcolor: 'background.paper',
	borderRadius: 3,
	boxShadow: '0 1px 3px rgba(0,0,0,0.06)',
	overflow: 'hidden',
}
const DIVIDER_INSET = 1.75

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
	const row = (p: PlaylistData, isLast: boolean) => (
		<Fragment key={p.guid}>
			<Link to="playlist" params={{ guid: p.guid }}>
				<Box
					sx={{
						display: 'flex',
						alignItems: 'center',
						gap: 1.5,
						paddingX: 1.75,
						paddingY: 1.25,
						transition: 'background-color 0.15s ease',
						'&:active': { bgcolor: 'grey.100' },
					}}
				>
					<Box
						sx={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column' }}
					>
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
			{!isLast && (
				<Box
					sx={{ height: '1px', bgcolor: 'grey.100', marginLeft: DIVIDER_INSET }}
				/>
			)}
		</Fragment>
	)

	return (
		<Box
			sx={{
				// full-bleed: escape the SmartPage padded wrapper and the toolbar spacer
				width: '100vw',
				marginLeft: 'calc(50% - 50vw)',
				marginTop: `calc(-1 * ${TOOLBAR_SPACER})`,
				minHeight: '100dvh',
				bgcolor: 'grey.50',
				display: 'flex',
				justifyContent: 'center',
			}}
		>
			<Box
				sx={{
					width: '100%',
					minWidth: 0,
					minHeight: '100dvh',
					bgcolor: 'grey.50',
					display: 'flex',
					flexDirection: 'column',
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
						paddingX: 2,
						paddingTop: 1,
						paddingBottom: CONTENT_CLEARANCE,
						display: 'flex',
						flexDirection: 'column',
					}}
				>
					{loading ? (
						<Box sx={GROUP_CARD_SX}>
							{Array.from({ length: 6 }).map((_, i) => (
								<Fragment key={i}>
									<Box sx={{ paddingX: 1.75, paddingY: 1.25 }}>
										<Skeleton
											variant="text"
											sx={{ width: '55%', bgcolor: 'grey.100' }}
										/>
										<Skeleton
											variant="text"
											sx={{ width: '80%', bgcolor: 'grey.100' }}
										/>
									</Box>
									{i < 5 && (
										<Box
											sx={{
												height: '1px',
												bgcolor: 'grey.200',
												marginLeft: DIVIDER_INSET,
											}}
										/>
									)}
								</Fragment>
							))}
						</Box>
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
						<Box sx={GROUP_CARD_SX}>
							{playlists.map((p, i) => row(p, i === playlists.length - 1))}
						</Box>
					)}
				</Box>
			</Box>
		</Box>
	)
}

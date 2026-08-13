'use client'

import useLastAddedSongs from '@/app/components/components/LastAddedSongsList/hooks/useLastAddedSongs'
import useRecommendedSongs from '@/app/components/components/RecommendedSongsList/hooks/useRecommendedSongs'
import { MAIN_SEARCH_EVENT_NAME } from '@/app/components/components/MainSearchInput'
import MobileSearchScreen from '@/app/components/MobileSearchScreen'
import { GROUP_CARD_SX, SongGroup } from '@/common/ui/GroupList'
import { MobileAppHeader } from '@/common/components/MobileAppHeader'
import { Box, Clickable, Typography } from '@/common/ui'
import { Link } from '@/common/ui/Link/Link'
import { Skeleton } from '@/common/ui/mui/Skeleton'
import { getSmartDateAgoString } from '@/tech/date/date.tech'
import { parseVariantAlias } from '@/tech/song/variant/variant.utils'
import { ChevronRightRounded, CloudOffRounded } from '@mui/icons-material'
import { useTranslations } from 'next-intl'
import { Fragment, ReactNode, useCallback, useEffect, useState } from 'react'

const PREVIEW_LINES = 2 // lyric preview lines shown on the song cards

const TEXT_DIVIDER_INSET = 1.75

type HomeMobileProps = {
	searchInputValue: string
	onSearchValueChange: (value: string) => void
	searchString: string | null
	smartSearch: boolean
}

/**
 * Native-feeling mobile home: a flat light-grey canvas with white grouped lists
 * (recommended picks, a quiet "last added") under the shell's large title, which
 * is the desktop hero in a phone's clothes.
 *
 * Searching is a mode rather than a strip on this screen — see
 * MobileSearchScreen for why. The desktop layout stays in HomeDesktop; this
 * component owns the phone view.
 */
export default function HomeMobile({
	searchInputValue,
	onSearchValueChange,
	searchString,
	smartSearch,
}: HomeMobileProps) {
	const tHome = useTranslations('home')

	const recommended = useRecommendedSongs()
	const lastAdded = useLastAddedSongs()
	const rec = recommended.data
	const last = lastAdded.data

	// Open straight into search when the URL already carries a query, so a shared
	// or reloaded ?hledat= link lands where it says it does.
	const [searchOpen, setSearchOpen] = useState(() => Boolean(searchString))

	// The tab bar's raised search button links here and fires MAIN_SEARCH_EVENT,
	// exactly like the desktop toolbar's "Hledat" item does. Only MainSearchInput
	// listened for it, and that is desktop-only — so on a phone the bar's primary
	// action used to do nothing visible.
	const openSearch = useCallback(() => setSearchOpen(true), [])

	useEffect(() => {
		window.addEventListener(MAIN_SEARCH_EVENT_NAME, openSearch)
		return () => window.removeEventListener(MAIN_SEARCH_EVENT_NAME, openSearch)
	}, [openSearch])

	// A full-screen layer should answer the hardware Back button, so opening it
	// pushes a history entry and Back (or Zrušit, which unwinds through the same
	// entry) closes it. useUrlState edits the query with replaceState, so typing
	// re-labels this entry instead of stacking more.
	useEffect(() => {
		if (!searchOpen) return
		window.history.pushState({ mobileSearch: true }, '')
		const onPop = () => setSearchOpen(false)
		window.addEventListener('popstate', onPop)
		return () => window.removeEventListener('popstate', onPop)
	}, [searchOpen])

	const closeSearch = useCallback(() => {
		onSearchValueChange('')
		window.history.back()
	}, [onSearchValueChange])

	const label = (text: string, action?: ReactNode) => (
		<Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 1, paddingX: 0.5 }}>
			<Typography small strong uppercase color="grey.700">
				{text}
			</Typography>
			{action}
		</Box>
	)

	const browseAction = (
		<Clickable>
			<Link to="songsList" params={{ s: undefined }}>
				<Typography small strong uppercase color="primary.main">
					{tHome('allList.browse')}
				</Typography>
			</Link>
		</Clickable>
	)

	// ---- picks: one white S5 group on the grey canvas ----------------

	const picks = (
		<Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
			{label(tHome('recommended.idea'), browseAction)}
			{recommended.isLoading ? (
				<Skeleton variant="rounded" sx={{ height: 288, borderRadius: 3, bgcolor: 'grey.200' }} />
			) : recommended.isError ? (
				<SectionError message={tHome('recommended.error')} />
			) : (
				<SongGroup songs={rec.slice(0, 5)} previewLines={PREVIEW_LINES} />
			)}
		</Box>
	)

	// ---- recent: quiet text-only S5 group (like the playlists list) ---

	const dateOf = (publishedAt?: Date | null) => (publishedAt ? getSmartDateAgoString(publishedAt) : '')

	const recentInner = lastAdded.isLoading ? (
		<Skeleton variant="rounded" sx={{ height: 220, borderRadius: 3, bgcolor: 'grey.200' }} />
	) : lastAdded.isError ? (
		<SectionError message={tHome('recommended.error')} />
	) : (
		<Box sx={GROUP_CARD_SX}>
			{last.slice(0, 5).map((s, i) => (
				<Fragment key={s.packGuid}>
					<Clickable>
						<Link to="variant" params={parseVariantAlias(s.packAlias)}>
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
								<Typography noWrap sx={{ flex: 1 }}>
									{s.title}
								</Typography>
								<Typography small color="grey.600" noWrap>
									{dateOf(s.publishedAt)}
								</Typography>
								<ChevronRightRounded fontSize="small" sx={{ color: 'grey.400' }} />
							</Box>
						</Link>
					</Clickable>
					{i < Math.min(last.length, 5) - 1 && (
						<Box sx={{ height: '1px', bgcolor: 'grey.200', marginLeft: TEXT_DIVIDER_INSET }} />
					)}
				</Fragment>
			))}
		</Box>
	)

	const recent = (
		<Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
			{label(tHome('lastAdded.title'))}
			{recentInner}
		</Box>
	)

	return (
		<>
			{/* Home is a tab-root, so no back arrow — otherwise the same shell as
			    every other screen: large title that shrinks to a slim bar on scroll,
			    with only the content between it and the tab bar scrolling. */}
			<MobileAppHeader
				title={tHome('hero.title')}
				subtitle={tHome('hero.lead')}
			>
				<Box
					sx={{
						display: 'flex',
						flexDirection: 'column',
						gap: 3,
						paddingTop: 1,
					}}
				>
					{picks}
					{recent}
				</Box>
			</MobileAppHeader>

			{searchOpen && (
				<MobileSearchScreen
					value={searchInputValue}
					onValueChange={onSearchValueChange}
					searchString={searchString}
					smartSearch={smartSearch}
					suggestions={rec.slice(0, 5)}
					onClose={closeSearch}
				/>
			)}
		</>
	)
}

/**
 * A home section whose data failed to load. Home used to render an empty white
 * card in this case, with nothing telling the user what happened.
 */
function SectionError({ message }: { message: string }) {
	return (
		<Box
			sx={{
				...GROUP_CARD_SX,
				display: 'flex',
				flexDirection: 'column',
				alignItems: 'center',
				gap: 1,
				paddingY: 4,
				paddingX: 3,
				textAlign: 'center',
			}}
		>
			<CloudOffRounded sx={{ fontSize: 40, color: 'grey.400' }} />
			<Typography color="grey.600">{message}</Typography>
		</Box>
	)
}

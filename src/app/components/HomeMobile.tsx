'use client'

import useLastAddedSongs from '@/app/components/components/LastAddedSongsList/hooks/useLastAddedSongs'
import useRecommendedSongs from '@/app/components/components/RecommendedSongsList/hooks/useRecommendedSongs'
import { MAIN_SEARCH_EVENT_NAME } from '@/app/components/components/MainSearchInput'
import MobileSearchScreen from '@/app/components/MobileSearchScreen'
import { setMobileSearchOpen } from '@/common/components/MobileAppTabBar/mobileSearchState'
import { GROUP_CARD_SX, SongGroup } from '@/common/ui/GroupList'
import { MobileAppHeader } from '@/common/components/MobileAppHeader'
import { Box, Clickable, Image, Typography } from '@/common/ui'
import { Link } from '@/common/ui/Link/Link'
import { Skeleton } from '@/common/ui/mui/Skeleton'
import { getSmartDateAgoString } from '@/tech/date/date.tech'
import { getAssetUrl } from '@/tech/paths.tech'
import { parseVariantAlias } from '@/tech/song/variant/variant.utils'
import {
	ChevronRightRounded,
	CloudOffRounded,
	SearchRounded,
} from '@mui/icons-material'
import { useTranslations } from 'next-intl'
import { useSearchParams } from 'next/navigation'
import { Fragment, ReactNode, useCallback, useEffect, useState } from 'react'

const PREVIEW_LINES = 2 // lyric preview lines shown on the song cards

const TEXT_DIVIDER_INSET = 1.75
/** Sheep size in the hero; it peeks out from behind the search entry below it. */
const SHEEP_SIZE = 96
/** How far the sheep reaches past the hero. Its front paws sit at about 30% of
 * the illustration's height, so the field's top edge lands just under them. */
const SHEEP_TUCK = Math.round(SHEEP_SIZE * 0.22)
/** Extra left inset for the title/slogan, past the app's normal content edge. */
const TITLE_INSET = 2.5

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
	const tSearch = useTranslations('search')

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

	// Tapping a tab is the way out of search. Písně and Účet leave this route and
	// unmount the screen on their own, but Domů navigates to the route we are
	// already on, so nothing would tear the layer down — the query param dropping
	// out of the URL is the signal. Typing edits the URL with replaceState, which
	// does not update this hook, so it cannot fire mid-search.
	//
	// Guarded on the layer actually being open: clearing the value writes the
	// (empty) query param back through useUrlState, so running this on a plain
	// visit to `/` would put ?hledat= in the URL and make the bar light up as if
	// search were open.
	const searchParams = useSearchParams()
	useEffect(() => {
		if (searchParams.has('hledat')) return
		if (!searchOpen) return
		setSearchOpen(false)
		onSearchValueChange('')
	}, [searchParams, searchOpen, onSearchValueChange])

	// Let the tab bar reflect the layer (it has no other way to know — see
	// mobileSearchState), and make sure it doesn't stay lit if we unmount.
	useEffect(() => {
		setMobileSearchOpen(searchOpen)
		return () => setMobileSearchOpen(false)
	}, [searchOpen])

	// The Back gesture should close the layer too, so opening it pushes a history
	// entry. useUrlState edits the query with replaceState, so typing re-labels
	// that entry instead of stacking more.
	useEffect(() => {
		if (!searchOpen) return
		window.history.pushState({ mobileSearch: true }, '')
		const onPop = () => setSearchOpen(false)
		window.addEventListener('popstate', onPop)
		return () => window.removeEventListener('popstate', onPop)
	}, [searchOpen])

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

	// ---- hero: the title beside the sheep, which tucks behind the search entry

	const hero = (
		<Box sx={{ position: 'relative', paddingX: 0.5, paddingTop: 1 }}>
			<Box
				sx={{
					position: 'absolute',
					right: 8,
					bottom: -SHEEP_TUCK,
					width: SHEEP_SIZE,
					height: SHEEP_SIZE,
					pointerEvents: 'none',
				}}
			>
				<Image
					src={getAssetUrl('/sheeps/ovce3.svg')}
					alt={tHome('hero.title')}
					fill
					sizes={`${SHEEP_SIZE}px`}
					style={{ objectFit: 'contain', objectPosition: 'bottom center' }}
				/>
			</Box>
			<Box
				sx={{
					position: 'relative',
					maxWidth: '60%',
					paddingLeft: TITLE_INSET,
					paddingBottom: 2.5,
				}}
			>
				<Typography
					strong={900}
					size="2.1rem"
					sx={{ lineHeight: 1.1, letterSpacing: '-0.5px' }}
				>
					{tHome('hero.title')}
				</Typography>
				<Typography small strong={500} color="grey.600" sx={{ marginTop: 0.5 }}>
					{tHome('hero.lead')}
				</Typography>
			</Box>
		</Box>
	)

	// Entry point rather than a live field: tapping it opens the same full-screen
	// search the tab bar's Hledat opens, so there is one search surface and no
	// input pinned above the keyboard.
	const searchEntry = (
		<Box sx={{ position: 'relative', zIndex: 1 }}>
			<Clickable onClick={openSearch}>
				<Box
					sx={{
						display: 'flex',
						alignItems: 'center',
						gap: 1.5,
						bgcolor: 'background.paper',
						border: '1px solid',
						borderColor: 'grey.300',
						borderRadius: 2.5,
						paddingX: 2,
						paddingY: 1.5,
						boxShadow: '0 2px 10px rgba(0,0,0,0.05)',
					}}
				>
					<SearchRounded sx={{ color: 'grey.500' }} />
					<Typography color="grey.500" noWrap>
						{tSearch('searchByTitleOrText')}
					</Typography>
				</Box>
			</Clickable>
		</Box>
	)

	return (
		<>
			{/* Home brings its own hero, so the shell renders no header row of its
			    own — see MobileAppHeader. Everything still scrolls inside the one
			    scroller between the status bar and the tab bar. */}
			<MobileAppHeader>
				<Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
					{hero}
					{searchEntry}
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

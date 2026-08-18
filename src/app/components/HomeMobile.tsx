'use client'

import useLastAddedSongs from '@/app/components/components/LastAddedSongsList/hooks/useLastAddedSongs'
import useRecommendedSongs from '@/app/components/components/RecommendedSongsList/hooks/useRecommendedSongs'
import { MAIN_SEARCH_EVENT_NAME } from '@/app/components/components/MainSearchInput'
import MobileSearchBody, {
	MobileSearchEntry,
	MobileSearchField,
} from '@/app/components/MobileSearch'
import { setMobileSearchOpen } from '@/common/components/MobileAppTabBar/mobileSearchState'
import { GROUP_CARD_SX, SongGroup } from '@/common/ui/GroupList'
import { MobileAppHeader } from '@/common/components/MobileAppHeader'
import { Box, Clickable, Image, Typography } from '@/common/ui'
import { Link } from '@/common/ui/Link/Link'
import { Skeleton } from '@/common/ui/mui/Skeleton'
import { getSmartDateAgoString } from '@/tech/date/date.tech'
import { getAssetUrl } from '@/tech/paths.tech'
import { parseVariantAlias } from '@/tech/song/variant/variant.utils'
import { ChevronRightRounded, CloudOffRounded } from '@mui/icons-material'
import { useTranslations } from 'next-intl'
import { useSearchParams } from 'next/navigation'
import {
	Fragment,
	ReactNode,
	useCallback,
	useEffect,
	useRef,
	useState,
} from 'react'

const PREVIEW_LINES = 2 // lyric preview lines shown on the song cards

const TEXT_DIVIDER_INSET = 1.75
/** Sheep size in the hero. Sized to the gap between the title and the pinned
 * search bar, so it starts level with the title and its paws land on the bar. */
const SHEEP_SIZE = 94
/** Where the sheep starts inside the header block, so it sits level with the
 * title and reaches far enough down for the search bar to cover its paws. */
const SHEEP_TOP = 37
/** Extra left inset for the title/slogan, past the app's normal content edge. */
const TITLE_INSET = 2.5
/** Extra breathing room above the title at rest, so the hero starts lower. */
const TITLE_TOP_SPACE = 2.5
/** Gap between the search bar and the first section, so the hero reads as its
 * own block rather than running straight into the lists. */
const SECTIONS_TOP_SPACE = 2

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
 * Searching is a mode of this screen rather than a layer over it — see
 * MobileSearch. The desktop layout stays in HomeDesktop; this component owns
 * the phone view.
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

	// Tapping a tab is the way out of search. Písně and Účet leave this route and
	// unmount the screen on their own, but Domů navigates to the route we are
	// already on, so nothing would take the mode down — the query param dropping
	// out of the URL is the signal. Typing edits the URL with replaceState, which
	// does not update this hook, so it cannot fire mid-search.
	//
	// Guarded on search actually being open: clearing the value writes the
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

	// Let the tab bar reflect the mode (it has no other way to know — see
	// mobileSearchState), and make sure it doesn't stay lit if we unmount.
	useEffect(() => {
		setMobileSearchOpen(searchOpen)
		return () => setMobileSearchOpen(false)
	}, [searchOpen])

	// The Back gesture should leave search too, so opening it pushes a history
	// entry. useUrlState edits the query with replaceState, so typing re-labels
	// that entry instead of stacking more.
	const pushedHistoryRef = useRef(false)
	useEffect(() => {
		if (!searchOpen) return
		window.history.pushState({ mobileSearch: true }, '')
		pushedHistoryRef.current = true
		const onPop = () => {
			pushedHistoryRef.current = false
			setSearchOpen(false)
			onSearchValueChange('')
		}
		window.addEventListener('popstate', onPop)
		return () => window.removeEventListener('popstate', onPop)
	}, [searchOpen, onSearchValueChange])

	// Cancel goes back through that entry rather than around it, so the Back
	// gesture afterwards isn't a step that appears to do nothing.
	const closeSearch = useCallback(() => {
		if (pushedHistoryRef.current) {
			window.history.back()
			return
		}
		setSearchOpen(false)
		onSearchValueChange('')
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

	// ---- the sheep: drawn in the header so it sits level with the title, reaching
	// low enough for the search bar below it to cover its paws. Both live in the
	// header block, so the bar simply paints after it. The shell fades the sheep
	// out as the header collapses.

	const sheep = (
		<Box
			sx={{
				position: 'absolute',
				right: 16,
				top: SHEEP_TOP,
				width: SHEEP_SIZE,
				height: SHEEP_SIZE,
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
	)

	// The bar lives inside the header rather than under it, so once the title has
	// scrolled away it is what the collapsed header is made of — the phone's
	// version of the desktop toolbar keeping search at the top of the page. It is
	// also where searching happens: tapping it turns it into a live field.
	const searchBar = searchOpen ? (
		<MobileSearchField
			value={searchInputValue}
			onValueChange={onSearchValueChange}
			onCancel={closeSearch}
		/>
	) : (
		<MobileSearchEntry onOpen={openSearch} />
	)

	return (
		// Searching is a mode of this screen, not a layer over it: the hero steps
		// aside so the field is at the top, and the body swaps recommendations for
		// results. Nothing covers the tab bar, so the tabs stay a way out.
		<MobileAppHeader
			title={searchOpen ? undefined : tHome('hero.title')}
			subtitle={searchOpen ? undefined : tHome('hero.lead')}
			titleInset={TITLE_INSET}
			titleTopSpace={TITLE_TOP_SPACE}
			// The whole hero — name, slogan and sheep — scrolls away together,
			// handing the collapsed header over to the search bar.
			decoration={searchOpen ? undefined : sheep}
			controlPanel={searchBar}
			collapseTitle
			// searching has no hero to blend into, so the header reads as a bar from
			// the start rather than only once something scrolls under it
			divider={searchOpen}
			// entering or leaving search starts its body at the top
			scrollResetKey={searchOpen ? 'search' : 'home'}
		>
			{searchOpen ? (
				<MobileSearchBody
					searchString={searchString}
					smartSearch={smartSearch}
					suggestions={rec.slice(0, 5)}
				/>
			) : (
				<Box
					sx={{
						display: 'flex',
						flexDirection: 'column',
						gap: 3,
						marginTop: SECTIONS_TOP_SPACE,
					}}
				>
					{picks}
					{recent}
				</Box>
			)}
		</MobileAppHeader>
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

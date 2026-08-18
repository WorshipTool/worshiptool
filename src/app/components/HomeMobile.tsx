'use client'

import useLastAddedSongs from '@/app/components/components/LastAddedSongsList/hooks/useLastAddedSongs'
import useRecommendedSongs from '@/app/components/components/RecommendedSongsList/hooks/useRecommendedSongs'
import { MAIN_SEARCH_EVENT_NAME } from '@/app/components/components/MainSearchInput'
import MobileSearchBody, {
	MobileSearchBar,
} from '@/app/components/MobileSearch'
import { setMobileSearchOpen } from '@/common/components/MobileAppTabBar/mobileSearchState'
import { GROUP_CARD_SX, SongGroup } from '@/common/ui/GroupList'
import {
	MobileAppHeader,
	TOOLBAR_SPACER,
} from '@/common/components/MobileAppHeader'
import { Box, Clickable, Image, Typography, useTheme } from '@/common/ui'
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
	useLayoutEffect,
	useRef,
	useState,
} from 'react'

const PREVIEW_LINES = 2 // lyric preview lines shown on the song cards

const TEXT_DIVIDER_INSET = 1.75
/** Sheep size in the hero. Sized to the gap between the title and the search
 * bar, so it starts level with the title and its paws land on the bar. */
const SHEEP_SIZE = 94
/** Where the sheep starts relative to the title, so it sits level with it and
 * reaches far enough down for the search bar to cover its paws. */
const SHEEP_TOP = 5
/** Extra left inset for the title/slogan, past the app's normal content edge. */
const TITLE_INSET = 2.5
/** Hero title size (rem) — the shell's large-title size, since this is one. */
const TITLE_SIZE = 1.85
/** Space above the title, below the status bar. */
const HERO_TOP_PAD = 32
/** Gap between the search bar and the first section, so the hero reads as its
 * own block rather than running straight into the lists. */
const SECTIONS_TOP_SPACE = 2
/** How long the hero takes to fold away when search opens, carrying the bar up
 * to the top with it. */
const HERO_COLLAPSE_MS = 260

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

	// The tab bar's Hledat links here and fires MAIN_SEARCH_EVENT, exactly like the
	// desktop toolbar's "Hledat" item does. Only MainSearchInput listened for it,
	// and that is desktop-only — so on a phone the bar's primary action used to do
	// nothing visible.
	//
	// Focusing the field is what opens search, so the event focuses it rather than
	// flipping the mode behind its back; a tap has already focused it by the time
	// this runs, and focusing twice costs nothing.
	const searchInputRef = useRef<HTMLInputElement>(null)
	const openSearch = useCallback(() => {
		setSearchOpen(true)
		searchInputRef.current?.focus()
	}, [])

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

	// The bar carries a hairline once it has become the top bar, and none while
	// it is still part of the hero — a divider mid-page would be meaningless.
	// Painted straight onto the node, so sticking re-renders nothing.
	const searchBandRef = useRef<HTMLDivElement>(null)
	const heroRef = useRef<HTMLDivElement>(null)
	const heroInnerRef = useRef<HTMLDivElement>(null)
	const theme = useTheme()
	useEffect(() => {
		const band = searchBandRef.current
		if (!band) return
		// env() resolves to pixels in computed style, so the sticky offset is
		// readable without repeating the safe-area inset here
		const stickyTop = parseFloat(window.getComputedStyle(band).top) || 0
		let raf = 0
		let stuck: boolean | null = null
		const paint = () => {
			raf = 0
			const next = band.getBoundingClientRect().top <= stickyTop + 0.5
			if (next === stuck) return
			stuck = next
			band.style.borderBottomColor = next ? theme.palette.grey[200] : 'transparent'
			band.style.boxShadow = next ? '0 2px 8px rgba(0,0,0,0.05)' : 'none'
		}
		const schedule = () => {
			if (!raf) raf = requestAnimationFrame(paint)
		}
		// the shell owns the scroller, so listen in the capture phase: scroll events
		// don't bubble, but they are dispatched down through the document first
		document.addEventListener('scroll', schedule, true)
		// the bar also arrives at the top when the hero collapses under it, which no
		// scroll event announces — the observer fires for every frame of that
		const observer = new ResizeObserver(schedule)
		if (heroRef.current) observer.observe(heroRef.current)
		paint()
		return () => {
			document.removeEventListener('scroll', schedule, true)
			observer.disconnect()
			if (raf) cancelAnimationFrame(raf)
		}
	}, [theme])

	// Cancel goes back through that entry rather than around it, so the Back
	// gesture afterwards isn't a step that appears to do nothing.
	const closeSearch = useCallback(() => {
		// let go of the field first, or the keyboard stays up over the home screen
		searchInputRef.current?.blur()
		if (pushedHistoryRef.current) {
			window.history.back()
			return
		}
		setSearchOpen(false)
		onSearchValueChange('')
	}, [onSearchValueChange])

	// The hero collapses instead of disappearing, so the bar below it rides up to
	// the top instead of jumping there.
	//
	// Its height is always an explicit length, never `auto`: a transition has
	// nothing to interpolate from `auto`, so letting it size itself between
	// toggles would make the collapse a jump. The natural size comes from the
	// block inside, which an observer keeps up to date (rotation, text scaling,
	// a longer slogan in another language).
	useLayoutEffect(() => {
		const outer = heroRef.current
		const inner = heroInnerRef.current
		if (!outer || !inner) return
		const apply = () => {
			// the inner block's own box: the sheep hangs past its bottom edge and
			// would otherwise count as hero height, pushing the bar down
			outer.style.height = searchOpen ? '0px' : `${inner.offsetHeight}px`
		}
		apply()
		const observer = new ResizeObserver(apply)
		observer.observe(inner)
		return () => observer.disconnect()
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

	// ---- hero: plain content, so it scrolls away like everything else. The sheep
	// sits level with the title and reaches low enough that the search bar covers
	// its paws — the bar comes later in the flow, so it simply paints over it, and
	// scrolling slides the sheep under it until it is gone.

	const hero = (
		<Box
			ref={heroRef}
			// height is animated between the inner block's size and zero — see the
			// layout effect above
			sx={{
				overflow: 'hidden',
				opacity: searchOpen ? 0 : 1,
				transition: `height ${HERO_COLLAPSE_MS}ms ease, opacity ${
					HERO_COLLAPSE_MS / 2
				}ms ease`,
			}}
		>
			<Box
				ref={heroInnerRef}
				sx={{
					paddingTop: `calc(${TOOLBAR_SPACER} + ${HERO_TOP_PAD}px)`,
					paddingLeft: TITLE_INSET,
				}}
			>
			<Box sx={{ position: 'relative' }}>
				<Box
					sx={{
						fontSize: `${TITLE_SIZE}rem`,
						fontWeight: 800,
						letterSpacing: '-0.4px',
						lineHeight: 1.15,
						color: 'grey.900',
					}}
				>
					{tHome('hero.title')}
				</Box>
				<Box sx={{ marginTop: 0.25 }}>
					<Typography small strong={500} color="grey.600">
						{tHome('hero.lead')}
					</Typography>
				</Box>

				<Box
					sx={{
						position: 'absolute',
						// the scroller's own inset already holds it off the screen edge
						right: 0,
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
				</Box>
			</Box>
		</Box>
	)

	return (
		// Searching is a mode of this screen, not a layer over it, and not a
		// different screen either: the hero collapses, the bar it sat under rides up
		// to the top, and the body swaps recommendations for results. The tab bar
		// stays uncovered, so the tabs remain a way out.
		//
		// No shell header: the hero is ordinary content that scrolls away at the
		// speed of the page, and the bar below it is sticky — so it becomes the top
		// bar on its own, without anything shrinking or fading on the way.
		<MobileAppHeader>
			{hero}

			<Box
				ref={searchBandRef}
				sx={{
					position: 'sticky',
					// under the status bar, whose scrim the shell draws above it
					top: TOOLBAR_SPACER,
					zIndex: 2,
					bgcolor: 'grey.50',
					// bleed to the scroller's edges, so content passes under the whole
					// band rather than beside it
					marginX: -2,
					paddingX: 2,
					paddingY: 1,
					borderBottom: '1px solid',
					borderColor: 'transparent',
				}}
			>
				<MobileSearchBar
					value={searchInputValue}
					onValueChange={onSearchValueChange}
					active={searchOpen}
					onActivate={openSearch}
					onCancel={closeSearch}
					inputRef={searchInputRef}
				/>
			</Box>

			<Box
				// keyed so the incoming body fades in rather than replacing the other
				// one between two frames
				key={searchOpen ? 'search' : 'home'}
				sx={{
					'@keyframes bodyIn': { from: { opacity: 0 }, to: { opacity: 1 } },
					animation: `bodyIn ${HERO_COLLAPSE_MS / 2}ms ease`,
					display: 'flex',
					flexDirection: 'column',
					gap: 3,
					marginTop: SECTIONS_TOP_SPACE,
				}}
			>
				{searchOpen ? (
					<MobileSearchBody searchString={searchString} smartSearch={smartSearch} />
				) : (
					<>
						{picks}
						{recent}
					</>
				)}
			</Box>
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

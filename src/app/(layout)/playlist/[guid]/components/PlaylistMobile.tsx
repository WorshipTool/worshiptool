'use client'

import { BasicVariantPack } from '@/api/dtos/song/song.dto'
import { CollapsingHeader, MorphItem } from '@/common/components/CollapsingHeader/CollapsingHeader'
import Menu from '@/common/components/Menu/Menu'
import { MenuItemObjectType } from '@/common/components/Menu/MenuItem'
import { MOBILE_NAV_CLEARANCE } from '@/common/components/MobileAppTabBar/nav.constants'
import SongSelectPopup from '@/common/components/SongSelectPopup/SongSelectPopup'
import { Box, IconButton, Typography } from '@/common/ui'
import { PlaylistItemDto, PlaylistItemGuid } from '@/interfaces/playlist/playlist.types'
import { routesPaths } from '@/routes'
import { getReplacedUrlWithParams, getRouteUrlWithParams } from '@/routes/tech/transformer.tech'
import { useSmartNavigate } from '@/routes/useSmartNavigate'
import { printDocumentByUrl } from '@/tech/print.tech'
import {
	AddRounded,
	ArrowBackRounded,
	CheckRounded,
	ChevronRightRounded,
	DeleteOutlineRounded,
	DragIndicatorRounded,
	EditRounded,
	MoreVertRounded,
	MusicNoteRounded,
	PrintRounded,
	QueueMusicRounded,
	ShareRounded,
	SlideshowRounded,
} from '@mui/icons-material'
import { Reorder, useDragControls } from 'framer-motion'
import { useSnackbar } from 'notistack'
import { useTranslations } from 'next-intl'
import { useRouter } from 'next/navigation'
import { Fragment, useEffect, useMemo, useRef, useState } from 'react'
import useInnerPlaylist from '../hooks/useInnerPlaylist'
import PlaylistSwipeDeck from './PlaylistSwipeDeck'

// header sizes (px, on top of the safe-area inset). The header morphs from the
// tall expanded hero to the compact bar as the list scrolls (see CollapsingHeader).
const H_FULL = 210
const H_SLIM = 54
const HEADER_TOP = 'calc(env(safe-area-inset-top) + '
// space the floating mode switcher occupies at the bottom, so detail-mode
// content (the swipe deck's arrows + dots) can sit clear above it
const SWITCHER_CLEARANCE = 74

const CARD = {
	bgcolor: 'background.paper',
	borderRadius: 3,
	boxShadow: '0 1px 3px rgba(0,0,0,0.06)',
	overflow: 'hidden',
} as const
const ROW = { display: 'flex', alignItems: 'center', gap: 1.25, paddingX: 1.5, paddingY: 1.25 } as const

function KeyChip({ k }: { k: string }) {
	return (
		<Box sx={{ minWidth: 30, height: 26, paddingX: 0.75, borderRadius: 1.5, bgcolor: 'grey.100', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
			<Typography small strong={600} color="grey.700">{k}</Typography>
		</Box>
	)
}
function Cover() {
	return (
		<Box sx={{ width: 60, height: 60, borderRadius: 2.5, bgcolor: 'primary.50', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
			<QueueMusicRounded sx={{ color: 'primary.main', fontSize: 32 }} />
		</Box>
	)
}
// a reorderable row (edit mode): drag by the handle only, remove button works
function EditRow({ item, index, onRemove }: { item: PlaylistItemDto; index: number; onRemove: () => void }) {
	const tCommon = useTranslations('common')
	const controls = useDragControls()
	return (
		<Reorder.Item value={item.guid} dragListener={false} dragControls={controls} as="div">
			<Box sx={{ ...ROW, bgcolor: 'background.paper' }}>
				<Box onPointerDown={(e) => controls.start(e)} sx={{ display: 'flex', flexShrink: 0, cursor: 'grab', touchAction: 'none', color: 'grey.400' }}>
					<DragIndicatorRounded />
				</Box>
				<Typography strong={600} color="grey.400" sx={{ minWidth: 18, textAlign: 'center', flexShrink: 0 }}>{index + 1}</Typography>
				<Typography strong noWrap sx={{ flex: 1, minWidth: 0 }}>{item.pack.title}</Typography>
				{item.toneKey && <KeyChip k={item.toneKey} />}
				<IconButton onClick={onRemove} alt={tCommon('remove')} color="grey.500"><DeleteOutlineRounded /></IconButton>
			</Box>
		</Reorder.Item>
	)
}

/**
 * Phone layout for the playlist detail page: a single page with a bottom mode
 * switcher (Seznam písní ↔ Detail písní). Seznam is the ordered list (owners can
 * add / remove / reorder); Detail is the full-song swipe deck. The big hero
 * header scrolls away with the list, condensing into a slim shared bar
 * (Prezentovat + ⋮). Wired to the same useInnerPlaylist state as desktop;
 * PlaylistPreview keeps desktop intact.
 */
export default function PlaylistMobile({
	initialMode = 'list',
}: {
	/** Which mode to open in — 'detail' can deep-link straight to the song deck. */
	initialMode?: 'list' | 'detail'
} = {}) {
	const t = useTranslations('playlist')
	const tCommon = useTranslations('common')
	const tSongs = useTranslations('songsList')
	const navigate = useSmartNavigate()
	const router = useRouter()
	const { enqueueSnackbar } = useSnackbar()
	const { items, title, loading, canUserEdit, guid, addItem, removeItem, setItems, save } =
		useInnerPlaylist()

	const [mode, setMode] = useState<'list' | 'detail'>(initialMode)
	const [detailIndex, setDetailIndex] = useState(0)
	const [editMode, setEditMode] = useState(false)
	const [addOpen, setAddOpen] = useState(false)
	const [menuAnchor, setMenuAnchor] = useState<null | HTMLElement>(null)
	const addAnchorRef = useRef<HTMLDivElement>(null)

	const listScrollRef = useRef<HTMLDivElement>(null)

	const sorted = useMemo(() => [...(items ?? [])].sort((a, b) => a.order - b.order), [items])

	// drag reorder (edit mode) — local order, committed on pointer up
	const [orderGuids, setOrderGuids] = useState<PlaylistItemGuid[]>([])
	const draggingRef = useRef(false)
	useEffect(() => {
		if (!draggingRef.current) setOrderGuids(sorted.map((i) => i.guid))
	}, [sorted])
	useEffect(() => {
		if (!editMode) return
		const onUp = () => {
			if (!draggingRef.current) return
			draggingRef.current = false
			const byGuid = new Map(sorted.map((it) => [it.guid, it]))
			const next = orderGuids
				.map((g, i) => {
					const it = byGuid.get(g)
					return it ? { ...it, order: i } : null
				})
				.filter((x): x is PlaylistItemDto => x !== null)
			setItems(next)
		}
		document.addEventListener('pointerup', onUp)
		document.addEventListener('touchend', onUp)
		return () => {
			document.removeEventListener('pointerup', onUp)
			document.removeEventListener('touchend', onUp)
		}
	}, [editMode, orderGuids, sorted, setItems])

	const leave = () => {
		if (typeof window !== 'undefined' && window.history.length > 1) router.back()
		else navigate('account', {})
	}
	const onBack = () => (mode === 'detail' ? setMode('list') : leave())
	const onPresent = async () => {
		await save()
		navigate('playlistCards', { guid })
	}
	const onShare = async () => {
		await save()
		const url = getRouteUrlWithParams('playlist', { guid })
		if (navigator.share) navigator.share({ title: `${title} - Playlist`, url }).catch(() => {})
		navigator.clipboard?.writeText(url)
		enqueueSnackbar(t('linkCopiedToClipboard'), {})
	}
	const onPrint = async () => {
		await save()
		printDocumentByUrl(getReplacedUrlWithParams(routesPaths.playlistPdf, { guid }, { returnFormat: 'absolute' }))
	}
	const onToggleEdit = async () => {
		if (editMode) await save()
		else if (mode === 'detail') setMode('list') // editing only makes sense on the list
		setEditMode((e) => !e)
	}
	const openDetail = (i: number) => {
		setDetailIndex(i)
		setMode('detail')
	}
	const onAddSubmit = async (packs: BasicVariantPack[]) => {
		for (const pack of packs) await addItem(pack)
	}
	const addFilter = (pack: BasicVariantPack) =>
		!(items ?? []).some((i) => i.pack.packGuid === pack.packGuid)

	// secondary actions live in one overflow menu (keeps the header to a single
	// primary + a single ⋮, consistent with the rest of the mobile shell)
	const moreItems: MenuItemObjectType[] = [
		{ title: t('share'), icon: <ShareRounded fontSize="small" />, onClick: onShare },
		{ title: t('print'), icon: <PrintRounded fontSize="small" />, onClick: onPrint },
		...(canUserEdit
			? [{ title: tCommon('edit'), icon: <EditRounded fontSize="small" />, onClick: onToggleEdit }]
			: []),
	]
	// the header's single trailing control: ⋮ menu, or a ✓ to leave edit mode
	const renderMore = (small?: boolean) =>
		editMode ? (
			<IconButton size={small ? 'small' : undefined} color="primary.main" alt={tCommon('save')} onClick={onToggleEdit}>
				<CheckRounded sx={small ? { fontSize: 21 } : undefined} />
			</IconButton>
		) : (
			<IconButton size={small ? 'small' : undefined} color="grey.700" alt={t('more')} onClick={(e) => setMenuAnchor(e.currentTarget as HTMLElement)}>
				<MoreVertRounded sx={small ? { fontSize: 21 } : undefined} />
			</IconButton>
		)

	const subtitle = (
		<Typography small color="grey.500" noWrap>
			<Box component="span" sx={{ color: 'primary.main', fontWeight: 600 }}>{t('typeLabel')}</Box>
			{items ? ` · ${t('songsCount', { count: items.length })}` : ''}
		</Typography>
	)

	// ── Seznam list body ─────────────────────────────────────────────────────
	let listBody
	if (loading || !items) {
		listBody = (
			<Box sx={CARD}>
				{Array.from({ length: 6 }).map((_, i) => (
					<Box key={i} sx={{ ...ROW, opacity: 0.5 }}>
						<Box sx={{ width: 40, height: 40, borderRadius: 2, bgcolor: 'grey.100', flexShrink: 0 }} />
						<Box sx={{ flex: 1, height: 14, borderRadius: 1, bgcolor: 'grey.100' }} />
					</Box>
				))}
			</Box>
		)
	} else if (sorted.length === 0) {
		listBody = (
			<Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', gap: 2, paddingTop: 6, paddingX: 3 }}>
				<MusicNoteRounded sx={{ fontSize: 48, color: 'grey.400' }} />
				<Typography color="grey.600">{tSongs('empty')}</Typography>
				{canUserEdit && (
					<Box onClick={() => setAddOpen(true)} sx={{ display: 'flex', alignItems: 'center', gap: 0.5, cursor: 'pointer' }}>
						<AddRounded sx={{ color: 'primary.main' }} />
						<Typography strong color="primary.main">{t('addSongToPlaylist')}</Typography>
					</Box>
				)}
			</Box>
		)
	} else if (editMode && canUserEdit) {
		listBody = (
			<>
				<Box sx={CARD}>
					<Reorder.Group
						axis="y"
						values={orderGuids}
						onReorder={(v) => {
							draggingRef.current = true
							setOrderGuids(v as PlaylistItemGuid[])
						}}
						as="div"
						style={{ listStyle: 'none', margin: 0, padding: 0 }}
					>
						{orderGuids.map((g, i) => {
							const item = sorted.find((it) => it.guid === g)
							if (!item) return null
							return (
								<Fragment key={g}>
									<EditRow item={item} index={i} onRemove={() => removeItem(item.guid)} />
									{i < orderGuids.length - 1 && <Box sx={{ height: '1px', bgcolor: 'grey.200', marginLeft: 7 }} />}
								</Fragment>
							)
						})}
					</Reorder.Group>
				</Box>
				<Box onClick={() => setAddOpen(true)} sx={{ ...ROW, ...CARD, marginTop: 1.5, cursor: 'pointer', justifyContent: 'center' }}>
					<AddRounded sx={{ color: 'primary.main' }} />
					<Typography strong color="primary.main">{t('addSongToPlaylist')}</Typography>
				</Box>
			</>
		)
	} else {
		listBody = (
			<Box sx={CARD}>
				{sorted.map((item, i) => (
					<Fragment key={item.guid}>
						<Box sx={{ ...ROW, cursor: 'pointer', '&:active': { bgcolor: 'grey.50' } }} onClick={() => openDetail(i)}>
							<Typography strong={600} color="grey.400" sx={{ minWidth: 20, textAlign: 'center', flexShrink: 0 }}>{i + 1}</Typography>
							<Typography strong noWrap sx={{ flex: 1, minWidth: 0 }}>{item.pack.title}</Typography>
							{item.toneKey && <KeyChip k={item.toneKey} />}
							<ChevronRightRounded sx={{ color: 'grey.400', flexShrink: 0 }} />
						</Box>
						{i < sorted.length - 1 && <Box sx={{ height: '1px', bgcolor: 'grey.200', marginLeft: 6.5 }} />}
					</Fragment>
				))}
			</Box>
		)
	}

	const TABS: [string, 'list' | 'detail'][] = [
		[t('tabSongs'), 'list'],
		[t('tabDetail'), 'detail'],
	]

	return (
		<Box sx={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: MOBILE_NAV_CLEARANCE, bgcolor: 'grey.50', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
			{/* content: the list carries a top spacer for the hero area, so the header
			    can be an overlay that morphs (rather than a flex child that shrinks and
			    steals the scroll distance) — no feedback loop, no dead space at the end.
			    Detail is the swipe deck under the compact header. */}
			{mode === 'list' ? (
				<Box ref={listScrollRef} sx={{ flex: 1, minHeight: 0, overflowY: 'auto' }}>
					<Box aria-hidden style={{ height: `${HEADER_TOP}${H_FULL}px)` }} />
					<Box sx={{ paddingX: 2, paddingBottom: 12 }}>{listBody}</Box>
				</Box>
			) : sorted.length > 0 ? (
				<Box sx={{ flex: 1, minHeight: 0, display: 'flex', flexDirection: 'column', paddingTop: `${HEADER_TOP}${H_SLIM}px)` }}>
					<PlaylistSwipeDeck items={sorted} startIndex={Math.min(detailIndex, sorted.length - 1)} bottomInset={SWITCHER_CLEARANCE} />
				</Box>
			) : (
				<Box sx={{ flex: 1 }} />
			)}

			{/* the morphing header: the tall hero condenses continuously into the
			    compact bar — the title shrinks and travels, the Prezentovat pill moves
			    and shrinks to its circle, and expanded-only bits (cover, subtitle,
			    share / print / edit) just fade. Detail mode pins it compact. */}
			<CollapsingHeader scrollRef={listScrollRef} expandedHeight={H_FULL} compactHeight={H_SLIM} forceCompact={mode === 'detail'}>
				{/* back — present in both states, sits still */}
				<Box sx={{ position: 'absolute', top: `${HEADER_TOP}8px)`, left: 8, pointerEvents: 'auto' }}>
					<IconButton color="grey.800" alt={tCommon('back')} onClick={onBack}><ArrowBackRounded /></IconButton>
				</Box>

				{/* Choreography: the expanded-only extras (cover, subtitle, share / print
				    / edit) lift and fade out FIRST (range [0, .45]); the two shared
				    elements (title, Prezentovat) morph across the WHOLE scroll; the ⋮
				    fades in LAST (range [.5, 1]). One shared easing ties it together, so
				    it reads as a single "condense" rather than parts moving separately. */}

				{/* cover — fades + lifts out early */}
				<MorphItem to={{ opacity: 0, translateY: -18 }} range={[0, 0.45]} sx={{ top: `${HEADER_TOP}50px)`, left: 16 }}>
					<Cover />
				</MorphItem>

				{/* title — shrinks and travels up to the compact bar (whole scroll) */}
				<MorphItem
					from={{ fontSize: 23 }}
					to={{ translateX: -40, translateY: -41, fontSize: 17.5 }}
					sx={{ top: `${HEADER_TOP}58px)`, left: 88, maxWidth: 'calc(100vw - 210px)', fontWeight: 800, letterSpacing: '-0.3px', color: 'grey.900', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}
				>
					{title || ''}
				</MorphItem>

				{/* subtitle — fades + lifts out early */}
				<MorphItem to={{ opacity: 0, translateY: -18 }} range={[0, 0.45]} sx={{ top: `${HEADER_TOP}92px)`, left: 88 }}>
					{subtitle}
				</MorphItem>

				{/* Prezentovat — the pill moves and shrinks into the compact circle (whole
				    scroll); its label fades + collapses over the early window */}
				<MorphItem
					from={(w) => ({ width: w - 176, height: 46 })}
					to={(w) => ({ translateX: w - 110, translateY: -126, width: 38, height: 38 })}
					onClick={onPresent}
					sx={{ top: `${HEADER_TOP}134px)`, left: 16, bgcolor: 'primary.main', borderRadius: 999, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 0.5, cursor: 'pointer', pointerEvents: 'auto', overflow: 'hidden', boxShadow: '0 4px 12px rgba(0,0,0,0.14)' }}
				>
					<SlideshowRounded sx={{ color: 'common.white', fontSize: 22, flexShrink: 0 }} />
					<Typography strong sx={{ color: 'common.white', whiteSpace: 'nowrap', overflow: 'hidden', opacity: 'calc((0.45 - var(--collapse-p, 0)) / 0.45)', maxWidth: 'max(0px, calc((0.45 - var(--collapse-p, 0)) / 0.45 * 180px))' }}>{t('presentation')}</Typography>
				</MorphItem>

				{/* share / print / edit — expanded-only, lift and fade out early */}
				<MorphItem to={{ opacity: 0, translateY: -70 }} range={[0, 0.45]} sx={{ top: `${HEADER_TOP}137px)`, right: 104, pointerEvents: 'auto' }}>
					<IconButton onClick={onShare} alt={t('share')} color="grey.700"><ShareRounded /></IconButton>
				</MorphItem>
				<MorphItem to={{ opacity: 0, translateY: -70 }} range={[0, 0.45]} sx={{ top: `${HEADER_TOP}137px)`, right: 60, pointerEvents: 'auto' }}>
					<IconButton onClick={onPrint} alt={t('print')} color="grey.700"><PrintRounded /></IconButton>
				</MorphItem>
				{canUserEdit && (
					<MorphItem to={{ opacity: 0, translateY: -70 }} range={[0, 0.45]} sx={{ top: `${HEADER_TOP}137px)`, right: 16, pointerEvents: 'auto' }}>
						<IconButton onClick={onToggleEdit} alt={editMode ? tCommon('save') : tCommon('edit')} color={editMode ? 'primary.main' : 'grey.700'}>{editMode ? <CheckRounded /> : <EditRounded />}</IconButton>
					</MorphItem>
				)}

				{/* ⋮ (or ✓ in edit mode) — compact-only, fades in last */}
				<MorphItem from={{ opacity: 0 }} to={{ opacity: 1 }} range={[0.5, 1]} sx={{ top: `${HEADER_TOP}8px)`, right: 4, pointerEvents: 'auto' }}>
					{renderMore(true)}
				</MorphItem>
			</CollapsingHeader>

			{/* floating mode switcher (subtle grey), above the tab bar */}
			<Box sx={{ position: 'absolute', left: 16, right: 16, bottom: 14, zIndex: 5, display: 'flex', gap: 0.5, bgcolor: 'grey.200', borderRadius: 2.5, padding: 0.5, boxShadow: '0 8px 28px rgba(0,0,0,0.18)' }}>
				{TABS.map(([label, m]) => (
					<Box key={m} onClick={() => setMode(m)} sx={{ flex: 1, textAlign: 'center', paddingY: 1, borderRadius: 2, cursor: 'pointer', bgcolor: mode === m ? 'background.paper' : 'transparent', boxShadow: mode === m ? '0 1px 3px rgba(0,0,0,0.18)' : 'none' }}>
						<Typography strong={mode === m ? 600 : 500} color={mode === m ? 'grey.900' : 'grey.600'}>{label}</Typography>
					</Box>
				))}
			</Box>

			{/* overflow menu: the secondary header actions (share / print / edit) */}
			<Menu
				open={Boolean(menuAnchor)}
				anchor={menuAnchor}
				onClose={() => setMenuAnchor(null)}
				items={moreItems}
				anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
				transformOrigin={{ vertical: 'top', horizontal: 'right' }}
			/>

			{/* off-screen anchor + shared song picker (reused from desktop) */}
			<Box ref={addAnchorRef} sx={{ position: 'fixed', bottom: 0, left: '50%' }} />
			<SongSelectPopup open={addOpen} onClose={() => setAddOpen(false)} anchorRef={addAnchorRef} onSubmit={onAddSubmit} filterFunc={addFilter} anchorName="mobilePlaylistAdd" upDirection />
		</Box>
	)
}

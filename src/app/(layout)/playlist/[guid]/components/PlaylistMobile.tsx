'use client'

import { BasicVariantPack } from '@/api/dtos/song/song.dto'
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

// collapsing header sizes (px, on top of the safe-area inset)
const H_FULL = 210
const H_SLIM = 54
const COLLAPSE_DIST = 150
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
function Circle({ children, onClick, alt }: { children: React.ReactNode; onClick: () => void; alt: string }) {
	return (
		<Box sx={{ flexShrink: 0 }}>
			<IconButton onClick={onClick} alt={alt} color="grey.700">{children}</IconButton>
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
 * add / remove / reorder); Detail is the full-song swipe deck. A collapsing
 * header (Prezentovat / share / print / edit) shrinks on scroll. Wired to the
 * same useInnerPlaylist state as desktop; PlaylistPreview keeps desktop intact.
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
	const addAnchorRef = useRef<HTMLDivElement>(null)

	const headerRef = useRef<HTMLDivElement>(null)
	const fullRef = useRef<HTMLDivElement>(null)
	const slimRef = useRef<HTMLDivElement>(null)
	const listScrollRef = useRef<HTMLDivElement>(null)

	const sorted = useMemo(() => [...(items ?? [])].sort((a, b) => a.order - b.order), [items])

	// collapse the header as the Seznam list scrolls (imperative, no re-render)
	useEffect(() => {
		if (mode !== 'list') return
		const scroller = listScrollRef.current
		if (!scroller) return
		let raf = 0
		const apply = (p: number) => {
			if (headerRef.current) {
				headerRef.current.style.height = `calc(env(safe-area-inset-top) + ${H_FULL - (H_FULL - H_SLIM) * p}px)`
				headerRef.current.style.boxShadow = p > 0.9 ? '0 2px 8px rgba(0,0,0,0.05)' : 'none'
			}
			if (fullRef.current) fullRef.current.style.opacity = String(1 - Math.min(1, p * 1.5))
			if (slimRef.current) slimRef.current.style.opacity = String(Math.max(0, (p - 0.5) / 0.5))
		}
		const paint = () => {
			raf = 0
			apply(Math.min(1, Math.max(0, scroller.scrollTop / COLLAPSE_DIST)))
		}
		const onScroll = () => {
			if (!raf) raf = requestAnimationFrame(paint)
		}
		scroller.addEventListener('scroll', onScroll, { passive: true })
		apply(0)
		return () => scroller.removeEventListener('scroll', onScroll)
	}, [mode, sorted.length, editMode])

	// detail mode: force the header to its slim state (more room for the song)
	useEffect(() => {
		if (mode !== 'detail') return
		if (headerRef.current) {
			headerRef.current.style.height = `calc(env(safe-area-inset-top) + ${H_SLIM}px)`
			headerRef.current.style.boxShadow = 'none'
		}
		if (fullRef.current) fullRef.current.style.opacity = '0'
		if (slimRef.current) slimRef.current.style.opacity = '1'
	}, [mode])

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
			{/* collapsing header: full layer (identity + actions) ⇆ slim bar */}
			<Box
				ref={headerRef}
				style={{ height: `calc(env(safe-area-inset-top) + ${mode === 'detail' ? H_SLIM : H_FULL}px)` }}
				sx={{ flexShrink: 0, position: 'relative', overflow: 'hidden', bgcolor: 'grey.50', borderBottom: '1px solid', borderColor: 'grey.200' }}
			>
				{/* full */}
				<Box ref={fullRef} style={{ opacity: mode === 'detail' ? 0 : 1 }} sx={{ position: 'absolute', inset: 0, paddingTop: 'calc(env(safe-area-inset-top) + 8px)', paddingX: 2 }}>
					<Box sx={{ display: 'flex', alignItems: 'center' }}>
						<IconButton color="grey.800" alt={tCommon('back')} onClick={onBack} sx={{ marginLeft: -1 }}><ArrowBackRounded /></IconButton>
					</Box>
					<Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, paddingBottom: 1.5, paddingTop: 0.5 }}>
						<Cover />
						<Box sx={{ minWidth: 0 }}>
							<Typography noWrap sx={{ fontSize: '1.45rem', fontWeight: 800, letterSpacing: '-0.3px' }}>{title || ''}</Typography>
							{subtitle}
						</Box>
					</Box>
					<Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
						<Box onClick={onPresent} sx={{ flex: 1, bgcolor: 'primary.main', borderRadius: 999, height: 46, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 0.5, cursor: 'pointer', boxShadow: '0 4px 12px rgba(0,0,0,0.14)' }}>
							<SlideshowRounded sx={{ color: 'common.white' }} />
							<Typography strong sx={{ color: 'common.white' }}>{t('presentation')}</Typography>
						</Box>
						<Circle onClick={onShare} alt={t('share')}><ShareRounded /></Circle>
						<Circle onClick={onPrint} alt={t('print')}><PrintRounded /></Circle>
						{canUserEdit && (
							<Box sx={{ flexShrink: 0 }}>
								<IconButton onClick={onToggleEdit} alt={editMode ? tCommon('save') : tCommon('edit')} color={editMode ? 'primary.main' : 'grey.700'}>
									{editMode ? <CheckRounded /> : <EditRounded />}
								</IconButton>
							</Box>
						)}
					</Box>
				</Box>
				{/* slim: keeps the same actions as the full header, just compact */}
				<Box ref={slimRef} style={{ opacity: mode === 'detail' ? 1 : 0 }} sx={{ position: 'absolute', left: 0, right: 0, bottom: 0, height: H_SLIM, display: 'flex', alignItems: 'center', gap: 0.25, paddingX: 1 }}>
					<IconButton color="grey.800" alt={tCommon('back')} onClick={onBack} sx={{ marginLeft: -0.5 }}><ArrowBackRounded /></IconButton>
					<Typography strong noWrap sx={{ flex: 1, minWidth: 0, fontSize: '1.1rem' }}>{title || ''}</Typography>
					<IconButton size="small" color="grey.700" alt={t('share')} onClick={onShare}><ShareRounded sx={{ fontSize: 21 }} /></IconButton>
					<IconButton size="small" color="grey.700" alt={t('print')} onClick={onPrint}><PrintRounded sx={{ fontSize: 21 }} /></IconButton>
					{canUserEdit && (
						<IconButton size="small" color={editMode ? 'primary.main' : 'grey.700'} alt={editMode ? tCommon('save') : tCommon('edit')} onClick={onToggleEdit}>
							{editMode ? <CheckRounded sx={{ fontSize: 21 }} /> : <EditRounded sx={{ fontSize: 21 }} />}
						</IconButton>
					)}
					<Box onClick={onPresent} sx={{ width: 38, height: 38, borderRadius: '50%', bgcolor: 'primary.main', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, cursor: 'pointer', marginLeft: 0.25 }}>
						<SlideshowRounded sx={{ color: 'common.white', fontSize: 20 }} />
					</Box>
				</Box>
			</Box>

			{/* content: list (scrolls, drives collapse) or the swipe deck */}
			{mode === 'list' ? (
				<Box ref={listScrollRef} sx={{ flex: 1, minHeight: 0, overflowY: 'auto', paddingX: 2, paddingTop: 2, paddingBottom: 12 }}>
					{listBody}
				</Box>
			) : sorted.length > 0 ? (
				<PlaylistSwipeDeck items={sorted} startIndex={Math.min(detailIndex, sorted.length - 1)} bottomInset={SWITCHER_CLEARANCE} />
			) : (
				<Box sx={{ flex: 1 }} />
			)}

			{/* floating mode switcher (subtle grey), above the tab bar */}
			<Box sx={{ position: 'absolute', left: 16, right: 16, bottom: 14, zIndex: 5, display: 'flex', gap: 0.5, bgcolor: 'grey.200', borderRadius: 2.5, padding: 0.5, boxShadow: '0 8px 28px rgba(0,0,0,0.18)' }}>
				{TABS.map(([label, m]) => (
					<Box key={m} onClick={() => setMode(m)} sx={{ flex: 1, textAlign: 'center', paddingY: 1, borderRadius: 2, cursor: 'pointer', bgcolor: mode === m ? 'background.paper' : 'transparent', boxShadow: mode === m ? '0 1px 3px rgba(0,0,0,0.18)' : 'none' }}>
						<Typography strong={mode === m ? 600 : 500} color={mode === m ? 'grey.900' : 'grey.600'}>{label}</Typography>
					</Box>
				))}
			</Box>

			{/* off-screen anchor + shared song picker (reused from desktop) */}
			<Box ref={addAnchorRef} sx={{ position: 'fixed', bottom: 0, left: '50%' }} />
			<SongSelectPopup open={addOpen} onClose={() => setAddOpen(false)} anchorRef={addAnchorRef} onSubmit={onAddSubmit} filterFunc={addFilter} anchorName="mobilePlaylistAdd" upDirection />
		</Box>
	)
}

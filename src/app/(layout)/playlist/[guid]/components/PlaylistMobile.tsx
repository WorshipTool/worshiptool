'use client'

import { BasicVariantPack } from '@/api/dtos/song/song.dto'
import { MobileAppHeader } from '@/common/components/MobileAppHeader'
import SongSelectPopup from '@/common/components/SongSelectPopup/SongSelectPopup'
import { Box, IconButton, Typography } from '@/common/ui'
import { PlaylistItemDto, PlaylistItemGuid } from '@/interfaces/playlist/playlist.types'
import { routesPaths } from '@/routes'
import { getReplacedUrlWithParams, getRouteUrlWithParams } from '@/routes/tech/transformer.tech'
import { printDocumentByUrl } from '@/tech/print.tech'
import {
	AddRounded,
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
import { Fragment, useEffect, useMemo, useRef, useState } from 'react'
import useInnerPlaylist from '../hooks/useInnerPlaylist'
import PlaylistSongReader from './PlaylistSongReader'

// the songs live in one white "group" surface (iOS-style grouped list) on the
// grey app canvas — matching the seznam / song screens
const CARD = {
	bgcolor: 'background.paper',
	borderRadius: 3,
	boxShadow: '0 1px 3px rgba(0,0,0,0.06)',
	overflow: 'hidden',
} as const

const ROW = {
	display: 'flex',
	alignItems: 'center',
	gap: 1.5,
	paddingX: 1.75,
	paddingY: 1.25,
} as const

function KeyChip({ k }: { k: string }) {
	return (
		<Box
			sx={{
				minWidth: 30,
				height: 26,
				paddingX: 0.75,
				borderRadius: 1.5,
				bgcolor: 'grey.100',
				display: 'flex',
				alignItems: 'center',
				justifyContent: 'center',
				flexShrink: 0,
			}}
		>
			<Typography small strong={600} color="grey.700">
				{k}
			</Typography>
		</Box>
	)
}

function CoverTile() {
	return (
		<Box
			sx={{
				width: 84,
				height: 84,
				borderRadius: 3,
				bgcolor: 'primary.50',
				display: 'flex',
				alignItems: 'center',
				justifyContent: 'center',
			}}
		>
			<QueueMusicRounded sx={{ fontSize: 42, color: 'primary.main' }} />
		</Box>
	)
}

function ActionCircle({
	children,
	onClick,
	alt,
}: {
	children: React.ReactNode
	onClick: () => void
	alt: string
}) {
	return (
		<Box sx={{ flexShrink: 0 }}>
			<IconButton onClick={onClick} alt={alt} color="grey.700">
				{children}
			</IconButton>
		</Box>
	)
}

// a reorderable row (edit mode): drag by the handle only, so the remove button
// still works normally
function EditRow({
	item,
	index,
	onRemove,
	onDragStart,
}: {
	item: PlaylistItemDto
	index: number
	onRemove: () => void
	onDragStart: () => void
}) {
	const tCommon = useTranslations('common')
	const controls = useDragControls()
	return (
		<Reorder.Item value={item.guid} dragListener={false} dragControls={controls} as="div">
			<Box sx={{ ...ROW, bgcolor: 'background.paper' }}>
				<Box
					onPointerDown={(e) => {
						onDragStart()
						controls.start(e)
					}}
					sx={{ display: 'flex', flexShrink: 0, cursor: 'grab', touchAction: 'none', color: 'grey.400' }}
				>
					<DragIndicatorRounded />
				</Box>
				<Typography
					strong={600}
					color="grey.400"
					sx={{ minWidth: 20, textAlign: 'center', flexShrink: 0 }}
				>
					{index + 1}
				</Typography>
				<Typography strong noWrap sx={{ flex: 1, minWidth: 0 }}>
					{item.pack.title}
				</Typography>
				{item.toneKey && <KeyChip k={item.toneKey} />}
				<IconButton onClick={onRemove} alt={tCommon('remove')} color="grey.500">
					<DeleteOutlineRounded />
				</IconButton>
			</Box>
		</Reorder.Item>
	)
}

/**
 * Phone layout for the playlist detail page, built on the shared collapsing
 * MobileAppHeader. Songs show as a simple ordered list; tapping one opens the
 * full-song swipe reader (PlaylistSongReader). Owners can add / remove / reorder
 * songs in edit mode. Wired to the same useInnerPlaylist state as desktop; the
 * desktop layout in PlaylistPreview stays untouched.
 */
export default function PlaylistMobile() {
	const t = useTranslations('playlist')
	const tCommon = useTranslations('common')
	const tSongs = useTranslations('songsList')
	const { enqueueSnackbar } = useSnackbar()
	const { items, title, loading, canUserEdit, guid, addItem, removeItem, setItems, save } =
		useInnerPlaylist()

	const [editMode, setEditMode] = useState(false)
	const [addOpen, setAddOpen] = useState(false)
	const [readerIndex, setReaderIndex] = useState<number | null>(null)
	const addAnchorRef = useRef<HTMLDivElement>(null)

	const sorted = useMemo(
		() => [...(items ?? [])].sort((a, b) => a.order - b.order),
		[items],
	)

	// local order for the drag list; committed to the playlist on pointer up
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
			const newItems = orderGuids
				.map((g, i) => {
					const it = byGuid.get(g)
					return it ? { ...it, order: i } : null
				})
				.filter((x): x is PlaylistItemDto => x !== null)
			setItems(newItems)
		}
		document.addEventListener('pointerup', onUp)
		document.addEventListener('touchend', onUp)
		return () => {
			document.removeEventListener('pointerup', onUp)
			document.removeEventListener('touchend', onUp)
		}
	}, [editMode, orderGuids, sorted, setItems])

	const onPresent = async () => {
		await save()
		if (typeof window !== 'undefined')
			window.location.assign(getReplacedUrlWithParams(routesPaths.playlistCards, { guid }))
	}
	const onShare = async () => {
		await save()
		const url = getRouteUrlWithParams('playlist', { guid })
		if (navigator.share) {
			navigator.share({ title: `${title} - Playlist`, url }).catch(() => {})
		}
		navigator.clipboard?.writeText(url)
		enqueueSnackbar(t('linkCopiedToClipboard'), {})
	}
	const onPrint = async () => {
		await save()
		const url = getReplacedUrlWithParams(routesPaths.playlistPdf, { guid }, { returnFormat: 'absolute' })
		printDocumentByUrl(url)
	}
	const onToggleEdit = async () => {
		if (editMode) await save()
		setEditMode((e) => !e)
	}
	const onAddSubmit = async (packs: BasicVariantPack[]) => {
		for (const pack of packs) await addItem(pack)
	}
	const addFilter = (pack: BasicVariantPack) =>
		!(items ?? []).some((i) => i.pack.packGuid === pack.packGuid)

	// pinned action strip under the hero: Prezentovat + share + print + edit
	const actionRow = (
		<Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
			<Box
				onClick={onPresent}
				sx={{
					flex: 1,
					bgcolor: 'primary.main',
					borderRadius: 999,
					height: 44,
					display: 'flex',
					alignItems: 'center',
					justifyContent: 'center',
					gap: 0.5,
					cursor: 'pointer',
					boxShadow: '0 4px 14px rgba(0,0,0,0.12)',
				}}
			>
				<SlideshowRounded sx={{ color: 'common.white' }} />
				<Typography strong sx={{ color: 'common.white' }}>
					{t('presentation')}
				</Typography>
			</Box>
			<ActionCircle onClick={onShare} alt={t('share')}>
				<ShareRounded />
			</ActionCircle>
			<ActionCircle onClick={onPrint} alt={t('print')}>
				<PrintRounded />
			</ActionCircle>
			{canUserEdit && (
				<Box sx={{ flexShrink: 0 }}>
					<IconButton
						onClick={onToggleEdit}
						alt={editMode ? tCommon('save') : tCommon('edit')}
						color={editMode ? 'primary.main' : 'grey.700'}
					>
						{editMode ? <CheckRounded /> : <EditRounded />}
					</IconButton>
				</Box>
			)}
		</Box>
	)

	let content
	if (loading || !items) {
		content = (
			<Box sx={CARD}>
				{Array.from({ length: 5 }).map((_, i) => (
					<Box key={i} sx={{ ...ROW, opacity: 0.5 }}>
						<Box sx={{ width: 40, height: 40, borderRadius: 2, bgcolor: 'grey.100', flexShrink: 0 }} />
						<Box sx={{ flex: 1, height: 14, borderRadius: 1, bgcolor: 'grey.100' }} />
					</Box>
				))}
			</Box>
		)
	} else if (sorted.length === 0) {
		content = (
			<Box
				sx={{
					display: 'flex',
					flexDirection: 'column',
					alignItems: 'center',
					textAlign: 'center',
					gap: 2,
					paddingTop: 8,
					paddingX: 3,
				}}
			>
				<MusicNoteRounded sx={{ fontSize: 48, color: 'grey.400' }} />
				<Typography color="grey.600">{tSongs('empty')}</Typography>
				{canUserEdit && (
					<Box
						onClick={() => setAddOpen(true)}
						sx={{ display: 'flex', alignItems: 'center', gap: 0.5, cursor: 'pointer' }}
					>
						<AddRounded sx={{ color: 'primary.main' }} />
						<Typography strong color="primary.main">
							{t('addSongToPlaylist')}
						</Typography>
					</Box>
				)}
			</Box>
		)
	} else if (editMode && canUserEdit) {
		content = (
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
									<EditRow
										item={item}
										index={i}
										onRemove={() => removeItem(item.guid)}
										onDragStart={() => {
											draggingRef.current = true
										}}
									/>
									{i < orderGuids.length - 1 && (
										<Box sx={{ height: '1px', bgcolor: 'grey.200', marginLeft: 7 }} />
									)}
								</Fragment>
							)
						})}
					</Reorder.Group>
				</Box>
				<Box
					onClick={() => setAddOpen(true)}
					sx={{ ...ROW, ...CARD, marginTop: 1.5, cursor: 'pointer', justifyContent: 'center' }}
				>
					<AddRounded sx={{ color: 'primary.main' }} />
					<Typography strong color="primary.main">
						{t('addSongToPlaylist')}
					</Typography>
				</Box>
				<Box sx={{ height: 24 }} />
			</>
		)
	} else {
		content = (
			<>
				<Box sx={CARD}>
					{sorted.map((item, i) => (
						<Fragment key={item.guid}>
							<Box
								sx={{ ...ROW, cursor: 'pointer', '&:active': { bgcolor: 'grey.50' } }}
								onClick={() => setReaderIndex(i)}
							>
								<Typography
									strong={600}
									color="grey.400"
									sx={{ minWidth: 20, textAlign: 'center', flexShrink: 0 }}
								>
									{i + 1}
								</Typography>
								<Typography strong noWrap sx={{ flex: 1, minWidth: 0 }}>
									{item.pack.title}
								</Typography>
								{item.toneKey && <KeyChip k={item.toneKey} />}
								<ChevronRightRounded sx={{ color: 'grey.400', flexShrink: 0 }} />
							</Box>
							{i < sorted.length - 1 && (
								<Box sx={{ height: '1px', bgcolor: 'grey.200', marginLeft: 6.5 }} />
							)}
						</Fragment>
					))}
				</Box>
				<Box sx={{ height: 24 }} />
			</>
		)
	}

	return (
		<>
			<MobileAppHeader
				title={title || ''}
				subtitle={items ? t('songsCount', { count: items.length }) : undefined}
				backTo="account"
				surface="grey.50"
				overlay
				heroIcon={<CoverTile />}
				controlPanel={actionRow}
			>
				{content}
			</MobileAppHeader>

			{/* off-screen anchor + the shared song picker (reused from desktop) */}
			<Box ref={addAnchorRef} sx={{ position: 'fixed', bottom: 0, left: '50%' }} />
			<SongSelectPopup
				open={addOpen}
				onClose={() => setAddOpen(false)}
				anchorRef={addAnchorRef}
				onSubmit={onAddSubmit}
				filterFunc={addFilter}
				anchorName="mobilePlaylistAdd"
				upDirection
			/>

			{readerIndex !== null && sorted[readerIndex] && (
				<PlaylistSongReader
					items={sorted}
					playlistTitle={title || ''}
					startIndex={readerIndex}
					onClose={() => setReaderIndex(null)}
				/>
			)}
		</>
	)
}

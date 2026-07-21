'use client'

import { BasicVariantPack } from '@/api/dtos/song/song.dto'
import { MobileAppHeader } from '@/common/components/MobileAppHeader'
import SongSelectPopup from '@/common/components/SongSelectPopup/SongSelectPopup'
import { Box, IconButton, Typography } from '@/common/ui'
import { useSmartNavigate } from '@/routes/useSmartNavigate'
import { parseVariantAlias } from '@/tech/song/variant/variant.utils'
import {
	AddRounded,
	CheckRounded,
	ChevronRightRounded,
	DeleteOutlineRounded,
	EditRounded,
	MusicNoteRounded,
	QueueMusicRounded,
	SlideshowRounded,
} from '@mui/icons-material'
import { useTranslations } from 'next-intl'
import { Fragment, useMemo, useRef, useState } from 'react'
import useInnerPlaylist from '../hooks/useInnerPlaylist'

// the whole page of songs lives in one white "group" surface (iOS-style grouped
// list) on the grey app canvas — matching the seznam / song screens
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

// the cover emblem shown in the taller hero header
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

/**
 * Phone layout for the playlist detail page, built on the shared collapsing
 * MobileAppHeader (hero header + pinned Prezentovat / edit actions). The songs
 * show as a simple ordered list; tapping one opens the song, editing lets owners
 * add / remove songs. Wired to the same useInnerPlaylist state as desktop; the
 * desktop layout in PlaylistPreview stays untouched.
 */
export default function PlaylistMobile() {
	const t = useTranslations('playlist')
	const tCommon = useTranslations('common')
	const tSongs = useTranslations('songsList')
	const navigate = useSmartNavigate()
	const { items, title, loading, canUserEdit, guid, addItem, removeItem, save } =
		useInnerPlaylist()

	const [editMode, setEditMode] = useState(false)
	const [addOpen, setAddOpen] = useState(false)
	const addAnchorRef = useRef<HTMLDivElement>(null)

	const sorted = useMemo(
		() => [...(items ?? [])].sort((a, b) => a.order - b.order),
		[items],
	)

	const onPresent = async () => {
		await save()
		navigate('playlistCards', { guid })
	}
	const onToggleEdit = async () => {
		if (editMode) await save()
		setEditMode((e) => !e)
	}
	const openSong = (pack: BasicVariantPack) => {
		navigate('variant', parseVariantAlias(pack.packAlias))
	}
	const onAddSubmit = async (packs: BasicVariantPack[]) => {
		for (const pack of packs) await addItem(pack)
	}
	const addFilter = (pack: BasicVariantPack) =>
		!(items ?? []).some((i) => i.pack.packGuid === pack.packGuid)

	// pinned action strip under the hero: Prezentovat (primary) + edit toggle
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
			{canUserEdit && (
				<IconButton
					onClick={onToggleEdit}
					alt={editMode ? tCommon('save') : tCommon('edit')}
					color={editMode ? 'primary.main' : 'grey.700'}
				>
					{editMode ? <CheckRounded /> : <EditRounded />}
				</IconButton>
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
	} else {
		content = (
			<>
				<Box sx={CARD}>
					{sorted.map((item, i) => (
						<Fragment key={item.guid}>
							<Box
								sx={{ ...ROW, cursor: 'pointer', '&:active': { bgcolor: 'grey.50' } }}
								onClick={editMode ? undefined : () => openSong(item.pack)}
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
								{editMode ? (
									<IconButton
										onClick={() => removeItem(item.guid)}
										alt={t('removeFromPlaylist')}
										color="grey.500"
									>
										<DeleteOutlineRounded />
									</IconButton>
								) : (
									<ChevronRightRounded sx={{ color: 'grey.400', flexShrink: 0 }} />
								)}
							</Box>
							{i < sorted.length - 1 && (
								<Box sx={{ height: '1px', bgcolor: 'grey.200', marginLeft: 6.5 }} />
							)}
						</Fragment>
					))}
				</Box>
				{editMode && canUserEdit && (
					<Box
						onClick={() => setAddOpen(true)}
						sx={{
							...ROW,
							...CARD,
							marginTop: 1.5,
							cursor: 'pointer',
							justifyContent: 'center',
						}}
					>
						<AddRounded sx={{ color: 'primary.main' }} />
						<Typography strong color="primary.main">
							{t('addSongToPlaylist')}
						</Typography>
					</Box>
				)}
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
		</>
	)
}

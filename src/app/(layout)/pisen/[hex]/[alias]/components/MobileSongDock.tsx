'use client'

import CreateCopyButton from '@/app/(layout)/pisen/[hex]/[alias]/components/components/CreateCopyButton'
import EditButton from '@/app/(layout)/pisen/[hex]/[alias]/components/components/EditButton'
import SongsOptionsButton from '@/app/(layout)/pisen/[hex]/[alias]/components/components/SongsOptionsButton'
import AddToPlaylistButton from '@/app/(layout)/pisen/[hex]/[alias]/components/components/AddToPlaylistButton/AddToPlaylistButton'
import { ABOVE_TABBAR_SLOT_ID } from '@/common/components/MobileAppTabBar/nav.constants'
import SmartPortalMenuItem from '@/common/components/SmartPortalMenuItem/SmartPortalMenuItem'
import { Box, IconButton, Typography } from '@/common/ui'
import HeartLikeButton from '@/common/ui/SongCard/components/HeartLikeButton'
import useAuth from '@/hooks/auth/useAuth'
import { getReplacedUrlWithParams } from '@/routes/tech/transformer.tech'
import { printDocumentByUrl } from '@/tech/print.tech'
import { parseVariantAlias } from '@/tech/song/variant/variant.utils'
import { ExtendedVariantPack } from '@/types/song'
import {
	AddRounded,
	FeaturedPlayList,
	MusicNoteRounded,
	MusicOffRounded,
	Print,
	RemoveRounded,
} from '@mui/icons-material'
import { Sheet } from '@pepavlin/sheet-api'
import { useTranslations } from 'next-intl'
import { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import { SongDto } from '../../../../../../api/dtos'
import { routesPaths } from '../../../../../../routes'

type MobileSongDockProps = {
	variant: ExtendedVariantPack
	sheet: Sheet
	song: SongDto
	showChords: boolean
	onToggleChords: (show: boolean) => void
	transpose: (i: number) => void
	reloadSong: () => void
	onEditClick: (editable: boolean) => Promise<void>
	saving: boolean
	editedTitle: string
	isOwner: boolean
	anyChange: boolean
}

/**
 * Phone-only floating control dock for the song page (the V12 layout): a
 * detached white bar above the tab bar — [chords toggle, like] | [− key +] |
 * [options menu]. Everything that doesn't fit the dock (presentation, print,
 * edit, create copy, add to playlist…) lives in the options menu, keeping
 * behavior parity with the desktop TopPanel. Portalled into the tab bar's
 * slot so it stacks above the bar via layout. Desktop keeps the classic
 * TopPanel; this renders instead of it on phones (outside edit mode, which
 * brings the TopPanel back for its save/cancel UI).
 */
export default function MobileSongDock(props: MobileSongDockProps) {
	const { user, isLoggedIn } = useAuth()
	const tTranspose = useTranslations('songPage.transpose')
	const tHide = useTranslations('songPage.hideChords')
	const tTopPanel = useTranslations('songPage.topPanel')
	const tPrint = useTranslations('songPage.print')

	const [tabBarSlot, setTabBarSlot] = useState<HTMLElement | null>(null)
	useEffect(() => {
		setTabBarSlot(document.getElementById(ABOVE_TABBAR_SLOT_ID))
	}, [])

	const hasChords = Boolean(props.sheet?.getKeyChord())
	const keyNote = props.sheet?.getKeyNote() || null

	const isOwner = Boolean(user && props.variant.createdByGuid === user.guid)

	const onPrintClick = () => {
		const url = getReplacedUrlWithParams(
			routesPaths['variantPdf'],
			{
				...parseVariantAlias(props.variant.packAlias),
				hideChords: !props.showChords,
				key: props.sheet?.getKeyNote() || undefined,
			},
			{ returnFormat: 'absolute' }
		)
		printDocumentByUrl(url)
	}

	if (!tabBarSlot) return null

	return createPortal(
		<>
			{/* the options menu carries everything that doesn't fit the dock —
			    mirrors the desktop TopPanel's extra actions */}
			<SmartPortalMenuItem
				title={tTopPanel('presentationItem.title')}
				subtitle={tTopPanel('presentationItem.subtitle')}
				to="variantCards"
				toParams={{
					...parseVariantAlias(props.variant.packAlias),
					key: props.sheet.getKeyNote() ?? undefined,
				}}
				icon={<FeaturedPlayList />}
			/>
			<SmartPortalMenuItem
				title={tPrint('label')}
				icon={<Print />}
				onClick={onPrintClick}
			/>
			{/* on phones EditButton renders as an options-menu item */}
			{isOwner && !props.variant.public && (
				<EditButton
					onClick={props.onEditClick}
					inEditMode={false}
					sheetData={props.sheet?.getOriginalSheetData() || ''}
					title={props.editedTitle}
					anyChange={props.anyChange}
				/>
			)}
			{/* on phones this renders as an options-menu item too */}
			{isLoggedIn() && <CreateCopyButton packGuid={props.variant.packGuid} />}

			<Box
				sx={{
					marginX: 2,
					marginBottom: 1.5,
					bgcolor: 'background.paper',
					borderRadius: 3,
					boxShadow: '0 6px 24px rgba(0,0,0,0.16)',
					display: 'flex',
					alignItems: 'center',
					justifyContent: 'space-between',
					paddingX: 1,
					height: 58,
				}}
			>
				<Box sx={{ display: 'flex', alignItems: 'center' }}>
					{hasChords && (
						<IconButton
							tooltip={props.showChords ? tHide('hide') : tHide('show')}
							onClick={() => props.onToggleChords(!props.showChords)}
						>
							{props.showChords ? (
								<MusicNoteRounded
									fontSize="small"
									sx={{ color: 'primary.main' }}
								/>
							) : (
								<MusicOffRounded fontSize="small" sx={{ color: 'grey.500' }} />
							)}
						</IconButton>
					)}
					{user && (
						<HeartLikeButton packGuid={props.variant.packGuid} interactable />
					)}
				</Box>

				{hasChords && (
					<Box
						sx={{
							display: 'flex',
							alignItems: 'center',
							gap: 0.25,
							bgcolor: 'grey.100',
							borderRadius: 5,
							paddingX: 0.5,
							height: 42,
						}}
					>
						<IconButton
							tooltip={tTranspose('decrease')}
							onClick={() => props.transpose(-1)}
						>
							<RemoveRounded />
						</IconButton>
						<Typography strong noWrap sx={{ minWidth: 54, textAlign: 'center' }}>
							{keyNote
								? tTranspose('keyWithNote', { note: keyNote })
								: tTranspose('title')}
						</Typography>
						<IconButton
							tooltip={tTranspose('increase')}
							onClick={() => props.transpose(1)}
						>
							<AddRounded />
						</IconButton>
					</Box>
				)}

				<Box sx={{ display: 'flex', alignItems: 'center' }}>
					{isLoggedIn() && <AddToPlaylistButton variant={props.variant} />}
					<SongsOptionsButton
						reloadSong={props.reloadSong}
						variant={props.variant}
						sheet={props.sheet}
						song={props.song}
						onEditClick={props.onEditClick}
						isInEditMode={false}
						saving={props.saving}
						editedTitle={props.editedTitle}
						isOwner={props.isOwner}
						anyChange={props.anyChange}
					/>
				</Box>
			</Box>
		</>,
		tabBarSlot
	)
}

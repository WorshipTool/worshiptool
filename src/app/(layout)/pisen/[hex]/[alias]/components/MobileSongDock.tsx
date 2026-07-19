'use client'

import SongsOptionsButton from '@/app/(layout)/pisen/[hex]/[alias]/components/components/SongsOptionsButton'
import AddToPlaylistButton from '@/app/(layout)/pisen/[hex]/[alias]/components/components/AddToPlaylistButton/AddToPlaylistButton'
import { ABOVE_TABBAR_SLOT_ID } from '@/common/components/MobileAppTabBar/nav.constants'
import SmartPortalMenuItem from '@/common/components/SmartPortalMenuItem/SmartPortalMenuItem'
import { Box, IconButton, Typography } from '@/common/ui'
import HeartLikeButton from '@/common/ui/SongCard/components/HeartLikeButton'
import useAuth from '@/hooks/auth/useAuth'
import { parseVariantAlias } from '@/tech/song/variant/variant.utils'
import { ExtendedVariantPack } from '@/types/song'
import {
	AddRounded,
	FeaturedPlayList,
	MusicNoteRounded,
	RemoveRounded,
} from '@mui/icons-material'
import { Sheet } from '@pepavlin/sheet-api'
import { useTranslations } from 'next-intl'
import { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import { SongDto } from '../../../../../../api/dtos'

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
 * detached white bar above the tab bar with balanced controls —
 * [chords toggle, like] | [− key +] | [add-to-playlist, options menu].
 * Portalled into the tab bar's slot so it stacks above the bar via layout.
 * The desktop keeps the classic TopPanel; this renders instead of it on
 * phones (outside edit mode).
 */
export default function MobileSongDock(props: MobileSongDockProps) {
	const { user, isLoggedIn } = useAuth()
	const tTranspose = useTranslations('songPage.transpose')
	const tHide = useTranslations('songPage.hideChords')
	const tTopPanel = useTranslations('songPage.topPanel')

	const [tabBarSlot, setTabBarSlot] = useState<HTMLElement | null>(null)
	useEffect(() => {
		setTabBarSlot(document.getElementById(ABOVE_TABBAR_SLOT_ID))
	}, [])

	const hasChords = Boolean(props.sheet?.getKeyChord())
	const keyNote = props.sheet?.getKeyNote() || null

	if (!tabBarSlot) return null

	return createPortal(
		<>
			{/* keeps the presentation item in the options menu (normally added by TopPanel) */}
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
							<MusicNoteRounded
								fontSize="small"
								sx={{ color: props.showChords ? 'primary.main' : 'grey.400' }}
							/>
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

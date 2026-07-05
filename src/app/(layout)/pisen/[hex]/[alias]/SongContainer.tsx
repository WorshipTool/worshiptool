'use client'
import AdditionalSongInfoPanel from '@/app/(layout)/pisen/[hex]/[alias]/components/AdditionalSongInfoPanel'
import DeletedInfoPanel from '@/app/(layout)/pisen/[hex]/[alias]/components/components/DeletedInfoPanel'
import { SONG_OPTIONS_BUTTON_ID } from '@/app/(layout)/pisen/[hex]/[alias]/components/components/SongsOptionsButton'
import DragCorner from '@/app/(layout)/pisen/[hex]/[alias]/components/DragCorner'
import HideChordsButton from '@/app/(layout)/pisen/[hex]/[alias]/components/HideChordsButton'
import SongRightPanel from '@/app/(layout)/pisen/[hex]/[alias]/components/RightPanel/SongRightPanel'
import TopPanel from '@/app/(layout)/pisen/[hex]/[alias]/components/TopPanel'
import UserNotePanel from '@/app/(layout)/pisen/[hex]/[alias]/components/UserNotePanel'
import { InnerPackProvider } from '@/app/(layout)/pisen/[hex]/[alias]/hooks/useInnerPack'
import SheetDisplay from '@/common/components/SheetDisplay/SheetDisplay'
import { SmartPortalMenuProvider } from '@/common/components/SmartPortalMenuItem/SmartPortalMenuProvider'
import { Box, Gap } from '@/common/ui'
import useAuth from '@/hooks/auth/useAuth'
import DraggableSong from '@/hooks/dragsong/DraggableSong'
import { useRerender } from '@/hooks/useRerender'
import { ExtendedVariantPack, VariantPackAlias } from '@/types/song'
import { Sheet } from '@pepavlin/sheet-api'
import { useEffect, useMemo, useState } from 'react'
import { SongDto, VariantPackGuid } from '../../../../../api/dtos'

export type SongPageProps = {
	variant: ExtendedVariantPack
	song: SongDto
	flags: {
		showMedia: boolean
	}
}

export default function SongContainer({
	variant,
	song,
	...props
}: SongPageProps) {
	const sheet = useMemo(() => {
		return new Sheet(variant.sheetData)
	}, [variant.sheetData])

	const title = useMemo(() => {
		return variant.title
	}, [variant.title])

	const [showChords, setShowChords] = useState(true)

	const { user } = useAuth()

	const rerender = useRerender()

	// Current sheet
	const [currentSheet, setCurrentSheet] = useState<Sheet>(sheet)
	useEffect(() => {
		if (sheet) setCurrentSheet(sheet)
	}, [sheet])

	// Current title
	const [editedTitle, setEditedTitle] = useState(title)
	useEffect(() => {
		if (title) setEditedTitle(title)
	}, [title])

	const transpose = (value: number) => {
		if (currentSheet) {
			currentSheet.transpose(value)
			rerender()
		}
	}

	const reload = () => {
		window?.location.reload()
	}

	const [inEditMode, setInEditMode] = useState(false)

	const onEditClick = async (editable: boolean) => {
		setInEditMode(editable)
	}

	const cancelEditing = () => {
		setInEditMode(false)
		setCurrentSheet(sheet)
		if (title) setEditedTitle(title)
	}

	return (
		<InnerPackProvider
			variantAlias={variant.packAlias}
			startData={{
				variant,
				song,
			}}
		>
			<SmartPortalMenuProvider id={SONG_OPTIONS_BUTTON_ID}>
				<Box display={'flex'} flexDirection={'column'}>
					<TopPanel
						transpose={transpose}
						variant={variant}
						reloadSong={reload}
						title={editedTitle}
						editedTitle={editedTitle}
						sheet={currentSheet as Sheet}
						song={song as SongDto}
						onEditClick={onEditClick}
						isInEditMode={inEditMode}
						cancelEditing={cancelEditing}
						hideChords={!showChords}
					/>

					{variant && variant.deleted ? (
						<>
							<Gap value={2} />
							<DeletedInfoPanel variant={variant} reloadSong={reload} />
						</>
					) : (
						currentSheet && (
							<>
								<Gap value={1.5} />
								<Box
									display={'flex'}
									flexDirection={'row'}
									flexWrap={'wrap'}
									alignItems={'flex-start'}
									justifyContent={'center'}
									gap={3}
								>
									{/* SONG SHEET — the “paper” */}
									<Box
										sx={{
											flex: 1,
											minWidth: 0,
											maxWidth: { md: 800 },
											position: 'relative',
											padding: { xs: 2.5, sm: 3.5, md: 5 },
											backgroundColor: 'background.paper',
											boxShadow: '0px 6px 24px rgba(0, 0, 0, 0.08)',
											borderRadius: 3,
											displayPrint: 'none',
										}}
									>
										{Array.from({ length: 4 }).map((_, i) => (
											<DraggableSong
												key={i}
												data={{
													packGuid:
														variant?.packGuid || ('' as VariantPackGuid),
													title: variant?.title || '',
													alias:
														variant?.packAlias || ('' as VariantPackAlias),
												}}
											>
												<DragCorner index={i} />
											</DraggableSong>
										))}

										{currentSheet.getKeyChord() && !inEditMode && (
											<Box display={'flex'} justifyContent={'flex-end'}>
												<HideChordsButton
													hiddenValue={!showChords}
													onChange={(value) => setShowChords(!value)}
												/>
											</Box>
										)}
										<SheetDisplay
											sheet={currentSheet}
											title={editedTitle}
											hideChords={!showChords}
											variant={'default'}
											editMode={inEditMode}
											onChange={(sheet, title) => {
												setCurrentSheet(new Sheet(sheet))
												setEditedTitle(title)
											}}
										/>
									</Box>

									{/* SIDEBAR — note, videos, sources… */}
									{!inEditMode && (
										<Box
											sx={{
												width: { xs: '100%', md: 320 },
												flexShrink: 0,
												display: 'flex',
												flexDirection: 'column',
												gap: 2,
												position: { md: 'sticky' },
												top: { md: 88 },
												displayPrint: 'none',
											}}
										>
											{user && <UserNotePanel />}
											<AdditionalSongInfoPanel
												song={song as SongDto}
												variant={variant}
												showMedia={props.flags.showMedia}
											/>
											<SongRightPanel pack={variant} song={song as SongDto} />
										</Box>
									)}
								</Box>
							</>
						)
					)}
				</Box>
			</SmartPortalMenuProvider>
		</InnerPackProvider>
	)
}

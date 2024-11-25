import HideChordsButton from '@/app/(layout)/pisen/[hex]/[alias]/components/HideChordsButton'
import UserNotePanel from '@/app/(layout)/pisen/[hex]/[alias]/components/UserNotePanel'
import { Box } from '@/common/ui'
import useAuth from '@/hooks/auth/useAuth'
import { Sheet } from '@pepavlin/sheet-api'
import { useEffect, useMemo, useState } from 'react'
import { SongDto, SongVariantDto } from '../../../../../api/dtos'
import SheetDisplay from '../../../../../common/components/SheetDisplay/SheetDisplay'
import { Gap } from '../../../../../common/ui/Gap'
import { useRerender } from '../../../../../hooks/useRerender'
import AdditionalSongInfoPanel from './components/AdditionalSongInfoPanel'
import TopPanel from './components/TopPanel'
import DeletedInfoPanel from './components/components/DeletedInfoPanel'

export type SongPageProps = {
	variant: SongVariantDto
	song: SongDto
}

export default function SongContainer({ variant, song }: SongPageProps) {
	const sheet = useMemo(() => {
		return new Sheet(variant.sheetData)
	}, [variant.sheetData])

	const title = useMemo(() => {
		return variant.preferredTitle
	}, [variant.preferredTitle])

	const [showChords, setShowChords] = useState(true)

	const { user } = useAuth()

	const rerender = useRerender()

	// Current sheet
	const [currentSheet, setCurrentSheet] = useState<Sheet>()
	useEffect(() => {
		if (sheet) setCurrentSheet(sheet)
	}, [sheet])

	// Current title
	const [editedTitle, setEditedTitle] = useState('')
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
		<>
			<Box display={'flex'} flexDirection={'column'}>
				<TopPanel
					transpose={transpose}
					variant={variant as SongVariantDto}
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

				<>
					{variant && variant.deleted ? (
						<>
							<Gap value={2} />
							<DeletedInfoPanel variant={variant} reloadSong={reload} />
						</>
					) : (
						currentSheet && (
							<Box
								display={'flex'}
								flexDirection={'row'}
								flexWrap={'wrap'}
								justifyContent={'space-between'}
							>
								<Box flex={1}>
									<Gap value={0.5} />
									{currentSheet.getKeyChord() && (
										<HideChordsButton
											hiddenValue={!showChords}
											onChange={(value) => setShowChords(!value)}
										/>
									)}
									<Gap value={0.5} />

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
								{!inEditMode && (
									<Box>
										{user && (
											<>
												<Gap />
												<Box
													sx={{
														position: 'sticky',
														top: 80,
														// bottom: 160,
														display: 'flex',
														flexDirection: 'column',
														alignItems: 'flex-end',
													}}
												>
													<UserNotePanel />
												</Box>
											</>
										)}
									</Box>
								)}
							</Box>
						)
					)}
				</>

				{!inEditMode && variant && !variant.deleted && (
					<>
						<Gap value={2} />
						<AdditionalSongInfoPanel
							song={song as SongDto}
							variant={variant as SongVariantDto}
						/>
					</>
				)}
			</Box>
		</>
	)
}

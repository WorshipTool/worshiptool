import { Box } from '@mui/material'
import { Sheet } from '@pepavlin/sheet-api'
import { useEffect, useMemo, useState } from 'react'
import { SongDto, SongVariantDto } from '../../../../api/dtos'
import SheetDisplay from '../../../../common/components/SheetDisplay/SheetDisplay'
import { Gap } from '../../../../common/ui/Gap'
import { useRerender } from '../../../../hooks/useRerender'
import AdditionalSongInfoPanel from './components/AdditionalSongInfoPanel'
import DeletedInfoPanel from './components/components/DeletedInfoPanel'
import TopPanel from './components/TopPanel'

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
			<>
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
				/>
				<Gap value={2} />
				<>
					{variant && variant.deleted ? (
						<>
							<DeletedInfoPanel variant={variant} reloadSong={reload} />
						</>
					) : (
						currentSheet && (
							<>
								<SheetDisplay
									sheet={currentSheet}
									title={editedTitle}
									variant={'default'}
									editMode={inEditMode}
									onChange={(sheet, title) => {
										setCurrentSheet(new Sheet(sheet))
										setEditedTitle(title)
									}}
								/>
							</>
						)
					)}
				</>
				{!inEditMode && variant && !variant.deleted && (
					<AdditionalSongInfoPanel
						song={song as SongDto}
						variant={variant as SongVariantDto}
					/>
				)}
			</>

			<Box displayPrint={'block'} display={'none'}>
				{currentSheet && (
					<>
						<SheetDisplay
							sheet={currentSheet}
							title={editedTitle as string}
							variant={'default'}
						/>
					</>
				)}
			</Box>
		</>
	)
}

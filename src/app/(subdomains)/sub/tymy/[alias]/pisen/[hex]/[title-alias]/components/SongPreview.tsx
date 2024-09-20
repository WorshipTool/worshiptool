import { CreatedType, SongVariantDto } from '@/api/dtos'
import { EditVariantOutDto } from '@/api/generated'
import TransposePanel from '@/app/(layout)/pisen/[hex]/[alias]/components/TransposePanel'
import EditButtonsPanel from '@/app/(subdomains)/sub/tymy/[alias]/pisen/[hex]/[title-alias]/components/EditButtonsPanel'
import useInnerTeam from '@/app/(subdomains)/sub/tymy/hooks/useInnerTeam'
import { TeamPermissions } from '@/app/(subdomains)/sub/tymy/tech'
import SheetDisplay from '@/common/components/SheetDisplay/SheetDisplay'
import { useApi } from '@/hooks/api/useApi'
import { usePermission } from '@/hooks/permissions/usePermission'
import { useSmartParams } from '@/routes/useSmartParams'
import { useApiState } from '@/tech/ApiState'
import { handleApiCall } from '@/tech/handleApiCall'
import { Box } from '@mui/material'
import { Sheet } from '@pepavlin/sheet-api'
import { useRef, useState } from 'react'

type SongPreviewProps = {
	// sheet: Sheet
	variant: SongVariantDto
}

export default function SongPreview({ variant, ...props }: SongPreviewProps) {
	const { guid: teamGuid } = useInnerTeam()

	const { edit } = useSmartParams('teamSong')
	const [inEditMode, setInEditMode] = useState(edit || false)

	const hasPermissionToEdit = usePermission<TeamPermissions>(
		'team.edit_songs',
		{
			teamGuid,
		}
	)

	const [sheet, setSheet] = useState<Sheet>(variant.sheet)

	const [justNumber, setJustNumber] = useState(0)
	const rerender = () => {
		setJustNumber(justNumber + 1)
	}

	const editedSheetData = useRef<string | null>(null)
	const editedTitle = useRef<string | null>(null)
	const onSheetChange = (sheetData: string, title: string) => {
		editedSheetData.current = sheetData
		editedTitle.current = title
	}

	const {
		fetchApiState,
		apiState: { loading: saving },
	} = useApiState<EditVariantOutDto>()
	const { songEditingApi } = useApi()

	const onSave = () => {
		if (editedSheetData.current) {
			const sheet = new Sheet(editedSheetData.current)
			setSheet(sheet)
		}

		const newData = {
			title:
				editedTitle.current !== variant.preferredTitle
					? editedTitle.current
					: undefined,
			sheetData:
				editedSheetData.current !== variant.sheetData
					? editedSheetData.current
					: undefined,
		}

		// Save data
		fetchApiState(
			async () => {
				return handleApiCall(
					songEditingApi.songEditingControllerEditVariant({
						variantAlias: variant.packAlias,
						createdType: CreatedType.Manual,
						title: newData.title || undefined,
						sheetData: newData.sheetData || undefined,
					})
				)
			},
			() => {
				if (newData.title) window.location.reload()
			}
		)
	}

	const onCancel = () => {
		editedSheetData.current = null
		editedTitle.current = null
	}

	return (
		<Box
			sx={{
				padding: 4,
				bgcolor: 'grey.100',
				borderRadius: 2,
				position: 'relative',
				display: 'flex',
				flexDirection: 'row',
				gap: 2,
				flexWrap: 'wrap-reverse',
			}}
		>
			<Box display={'flex'} flexDirection={'column'} flex={1} gap={2}>
				{sheet.getKeyChord() && (
					<Box display={'flex'}>
						<TransposePanel
							disabled={false}
							transpose={function (i: number): void {
								sheet.transpose(i)
								rerender()
								// throw new Error('Function not implemented.')
							}}
						/>
					</Box>
				)}
				<SheetDisplay
					sheet={sheet}
					hideChords={false}
					editMode={inEditMode}
					title={inEditMode ? variant.preferredTitle : undefined}
					onChange={onSheetChange}
				/>
			</Box>
			<Box>
				{hasPermissionToEdit && (
					<EditButtonsPanel
						inEditMode={inEditMode}
						setInEditMode={setInEditMode}
						variant={variant}
						onSave={onSave}
						onCancel={onCancel}
						saving={saving}
					/>
				)}
			</Box>
		</Box>
	)
}

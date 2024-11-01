'use client'
import { CreatedType, SongVariantDto } from '@/api/dtos'
import { EditVariantOutDto } from '@/api/generated'
import TransposePanel from '@/app/(layout)/pisen/[hex]/[alias]/components/TransposePanel'
import UserNotePanel from '@/app/(layout)/pisen/[hex]/[alias]/components/UserNotePanel'
import AddToPlaylistButton from '@/app/(layout)/pisen/[hex]/[alias]/components/components/AddToPlaylistButton/AddToPlaylistButton'
import PrintVariantButton from '@/app/(layout)/pisen/[hex]/[alias]/components/components/PrintButton'
import EditButtonsPanel from '@/app/(submodules)/(teams)/sub/tymy/[alias]/pisen/[hex]/[title-alias]/components/EditButtonsPanel'
import MoreTeamSongButton from '@/app/(submodules)/(teams)/sub/tymy/[alias]/pisen/[hex]/[title-alias]/components/MoreTeamSongButton'
import TeamNotePanel from '@/app/(submodules)/(teams)/sub/tymy/[alias]/pisen/[hex]/[title-alias]/components/TeamNotePanel'
import useInnerTeam from '@/app/(submodules)/(teams)/sub/tymy/hooks/useInnerTeam'
import { TeamPermissions } from '@/app/(submodules)/(teams)/sub/tymy/tech'
import SheetDisplay from '@/common/components/SheetDisplay/SheetDisplay'
import { Button } from '@/common/ui/Button'
import { useApi } from '@/hooks/api/useApi'
import { usePermission } from '@/hooks/permissions/usePermission'
import { useSmartParams } from '@/routes/useSmartParams'
import { useApiState } from '@/tech/ApiState'
import { handleApiCall } from '@/tech/handleApiCall'
import { Box } from '@mui/material'
import { Sheet } from '@pepavlin/sheet-api'
import { useCallback, useRef, useState } from 'react'

type SongPreviewProps = {
	// sheet: Sheet
	variant: SongVariantDto
}

export default function SongPreview({ variant }: SongPreviewProps) {
	const { guid: teamGuid } = useInnerTeam()

	const { edit, 'title-alias': titleAlias, hex } = useSmartParams('teamSong')
	const [inEditMode, setInEditMode] = useState(edit || false)

	const hasPermissionToEdit = usePermission<TeamPermissions>(
		'team.edit_songs',
		{
			teamGuid,
		}
	)

	const [hideChords, setHideChords] = useState(false)

	const [sheet, setSheet] = useState<Sheet>(variant.sheet)

	const [justNumber, setJustNumber] = useState(0)
	const rerender = useCallback(() => {
		setJustNumber(justNumber + 1)
	}, [justNumber])

	const editedSheetData = useRef<string | null>(null)
	const editedTitle = useRef<string | null>(null)
	const onSheetChange = useCallback((sheetData: string, title: string) => {
		editedSheetData.current = sheetData
		editedTitle.current = title
	}, [])

	const {
		fetchApiState,
		apiState: { loading: saving },
	} = useApiState<EditVariantOutDto>()
	const { songEditingApi } = useApi()

	const onSave = useCallback(() => {
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
	}, [editedSheetData, editedTitle, variant])

	const onCancel = useCallback(() => {
		editedSheetData.current = null
		editedTitle.current = null
	}, [])

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
				alignItems: 'start',
			}}
		>
			<Box display={'flex'} flexDirection={'column'} flex={1} gap={2}>
				{!inEditMode ? (
					sheet.getKeyChord() && (
						<Box
							display={'flex'}
							gap={1}
							justifyContent={'space-between'}
							flexWrap={'wrap-reverse'}
						>
							<Box display={'flex'} gap={1}>
								<TransposePanel
									disabled={hideChords}
									transpose={function (i: number): void {
										sheet.transpose(i)
										rerender()
									}}
								/>
								{hideChords ? (
									<Button
										onClick={() => setHideChords(false)}
										variant="text"
										size="small"
									>
										Zobrazit akordy
									</Button>
								) : (
									<Button
										onClick={() => setHideChords(true)}
										variant="text"
										color="grey.600"
										size="small"
									>
										Skrýt akordy
									</Button>
								)}
							</Box>
							<Box display={'flex'} gap={1} maxHeight={'2rem'}>
								<Box>
									<MoreTeamSongButton />
								</Box>
								<AddToPlaylistButton variant={variant} />
								{!inEditMode && (
									<>
										<PrintVariantButton
											params={{
												hex,
												alias: titleAlias,
												hideChords: hideChords,
												key: sheet.getKeyNote() || undefined,
											}}
											size="small"
										/>
									</>
								)}
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
						</Box>
					)
				) : (
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
				)}
				<Box
					display={'flex'}
					justifyContent={'space-between'}
					flexWrap={'wrap'}
					gap={2}
				>
					<Box flex={1}>
						<SheetDisplay
							sheet={sheet}
							hideChords={hideChords}
							editMode={inEditMode}
							title={inEditMode ? variant.preferredTitle : undefined}
							onChange={onSheetChange}
						/>
					</Box>
					{!inEditMode && (
						<Box
							sx={{
								position: 'sticky',
								top: 16,
								alignSelf: 'flex-start',
								display: 'flex',
								flexDirection: 'column',
								gap: 2,
							}}
						>
							<TeamNotePanel />
							<UserNotePanel />
						</Box>
					)}
				</Box>
			</Box>
		</Box>
	)
}

import { CreatedType, VariantPackAlias } from '@/api/dtos'
import { PostCreateVariantOutDto } from '@/api/generated'
import { AdminStepperItem } from '@/app/(layout)/sub/admin/pisen/vytvorit/page'
import SheetDisplay from '@/common/components/SheetDisplay/SheetDisplay'
import SheetEditor from '@/common/components/SheetEditor/SheetEditor'
import { Box, Button, Typography } from '@/common/ui'
import { grey } from '@/common/ui/mui/colors'
import { useApi } from '@/hooks/api/useApi'
import { useSmartNavigate } from '@/routes/useSmartNavigate'
import { useApiState } from '@/tech/ApiState'
import { isSheetDataValid } from '@/tech/sheet.tech'
import { parseVariantAlias } from '@/tech/song/variant/variant.utils'
import { Sheet } from '@pepavlin/sheet-api'
import { useMemo, useState } from 'react'

export const useTextChordAdminSection = (
	existingPackData: PostCreateVariantOutDto | null,
	onSongSave: (data: PostCreateVariantOutDto) => void
): AdminStepperItem => {
	const [sheetData, setSheetData] = useState('')
	const sheet = useMemo(() => {
		return new Sheet(sheetData)
	}, [sheetData])
	const [title, setTitle] = useState('')

	const isSheetValid = useMemo(() => {
		return isSheetDataValid(sheetData)
	}, [sheet])

	const { songManagementApi, songAddingApi } = useApi()
	const { fetchApiState, apiState } = useApiState<PostCreateVariantOutDto>()
	const navigate = useSmartNavigate()

	const saveSong = async (): Promise<PostCreateVariantOutDto> => {
		const result = (await fetchApiState(async () => {
			return songAddingApi.songAddingControllerCreate({
				title,
				sheetData,
				createdType: CreatedType.Manual,
			})
		})) as PostCreateVariantOutDto

		onSongSave(result)

		return result
	}
	const onSaveAndContinue = async (nextStep: () => void) => {
		await saveSong()
		nextStep()
	}

	const onOnlySaveClick = async () => {
		const result_1 = await saveSong()
		if (!result_1) return
		const a = parseVariantAlias(result_1.alias as VariantPackAlias)
		navigate(
			'adminPack',
			{
				hex: a.hex,
				alias: a.alias,
			},
			{
				replace: false,
			}
		)
	}

	return {
		label: 'Text a akordy',
		disabledContinue: !isSheetValid,
		actions: (cont, disabledContinue) => (
			<Box
				sx={{
					display: 'flex',
					gap: 1,
				}}
			>
				<Button
					onClick={onOnlySaveClick}
					variant="outlined"
					disabled={disabledContinue}
					loading={apiState.loading}
				>
					Uložit píseň
				</Button>
				<Button
					onClick={() => onSaveAndContinue(cont)}
					disabled={disabledContinue}
					loading={apiState.loading}
				>
					Uložit a pokračovat
				</Button>
			</Box>
		),
		component: (
			<>
				<Box
					sx={{
						display: 'flex',
						bgcolor: 'grey.100',
						padding: 3,
						backgroundColor: 'grey.100',
						boxShadow: `0px 0px 5px ${grey[400]}`,
						gap: 3,
					}}
				>
					<SheetEditor
						// useExampleData
						onSheetDataChange={(s) => setSheetData(s)}
						onTitleChange={(t) => setTitle(t)}
						startSheetData={sheetData}
						startTitle={title}
					/>
					<Box
						flex={1}
						sx={{
							bgcolor: 'grey.200',
							padding: 3,
							borderRadius: 2,
						}}
					>
						<SheetDisplay sheet={sheet} title={title} hideChords={false} />
					</Box>
				</Box>
				{!isSheetValid && (
					<Typography color="grey.500" strong>
						Píseň není validní.
					</Typography>
				)}
			</>
		),
	}
}

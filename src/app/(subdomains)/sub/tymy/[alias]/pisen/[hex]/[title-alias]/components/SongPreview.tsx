import { SongVariantDto } from '@/api/dtos'
import TransposePanel from '@/app/(layout)/pisen/[hex]/[alias]/components/TransposePanel'
import useInnerTeam from '@/app/(subdomains)/sub/tymy/hooks/useInnerTeam'
import { TeamPermissions } from '@/app/(subdomains)/sub/tymy/tech'
import SheetDisplay from '@/common/components/SheetDisplay/SheetDisplay'
import { Button } from '@/common/ui/Button'
import { usePermission } from '@/hooks/permissions/usePermission'
import { Box } from '@mui/material'
import { Sheet } from '@pepavlin/sheet-api'
import { useState } from 'react'

type SongPreviewProps = {
	// sheet: Sheet
	variant: SongVariantDto
}

export default function SongPreview({ variant, ...props }: SongPreviewProps) {
	const [inEditMode, setInEditMode] = useState(false)
	const { guid } = useInnerTeam()

	const hasPermissionToEdit = usePermission<TeamPermissions>(
		'team.edit_songs',
		{
			teamGuid: guid,
		}
	)

	const [sheet, setSheet] = useState<Sheet>(variant.sheet)

	const [justNumber, setJustNumber] = useState(0)
	const rerender = () => {
		setJustNumber(justNumber + 1)
	}

	return (
		<Box
			sx={{
				padding: 4,
				bgcolor: 'grey.100',
				borderRadius: 2,
				position: 'relative',
				display: 'flex',
				flexDirection: 'column',
				gap: 2,
			}}
		>
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
			{hasPermissionToEdit && (
				<Box
					display={'flex'}
					flexDirection={'row'}
					justifyContent={'end'}
					sx={{
						position: 'absolute',
						right: 4 * 8,
						width: '30%',
					}}
				>
					{!inEditMode ? (
						<Button
							color="secondary"
							size="small"
							onClick={() => setInEditMode(true)}
						>
							Upravit
						</Button>
					) : (
						<Button
							color="secondary"
							size="small"
							onClick={() => setInEditMode(false)}
						>
							Uložit
						</Button>
					)}
				</Box>
			)}
			<SheetDisplay
				sheet={sheet}
				hideChords={false}
				editMode={inEditMode}
				title={inEditMode ? variant.preferredTitle : undefined}
			/>
		</Box>
	)
}

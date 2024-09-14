import { SongVariantDto } from '@/api/dtos'
import SheetDisplay from '@/common/components/SheetDisplay/SheetDisplay'
import { Box } from '@mui/material'
import { Sheet } from '@pepavlin/sheet-api'

type SongPreviewProps = {
	sheet: Sheet
	variant: SongVariantDto
}

export default function SongPreview({ variant, ...props }: SongPreviewProps) {
	return (
		<Box
			sx={{
				padding: 4,
				bgcolor: 'grey.100',
				borderRadius: 2,
			}}
		>
			<SheetDisplay
				sheet={props.sheet}
				hideChords={false}
				title={variant.preferredTitle}
			/>
		</Box>
	)
}

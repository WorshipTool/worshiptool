import { Box, Button, Typography } from '@/common/ui'
import React from 'react'
import { SongVariantDto } from '../../../../../../api/dtos'
import SongSelect from '../../../../../../common/components/songLists/SongSelect/SongSelect'
import useGroupSelection from '../../../../../../hooks/group/useGroupSelection'

interface AddToSelectionProps {
	onChange?: () => void
}

export default function AddToSelection({
	onChange: onChangeCallback,
}: AddToSelectionProps) {
	const selection = useGroupSelection()
	const [selectedVariant, setSelectedVariant] =
		React.useState<SongVariantDto | null>(null)
	const onChange = (v: SongVariantDto | null) => {
		setSelectedVariant(v)
	}

	const onAddClick = async () => {
		if (selectedVariant === null) return

		await selection.addVariant(selectedVariant.packGuid)
		onChangeCallback?.()

		// window.location.reload();
	}
	const filter = (v: SongVariantDto) => {
		return !selection.items.find((s) => s.variant.guid === v.guid)
	}
	return (
		<Box>
			<Typography>Vyber píseň k přídání</Typography>
			<SongSelect onChange={onChange} filter={filter} />
			<Button variant="contained" color="primary" onClick={onAddClick}>
				Přidat do výběru
			</Button>
		</Box>
	)
}

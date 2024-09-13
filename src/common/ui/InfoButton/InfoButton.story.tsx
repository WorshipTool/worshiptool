import { createStory } from '@/app/(layout)/storybook/createStory'
import { InfoButton } from '@/common/ui/InfoButton/InfoButton'
import { Box } from '@mui/material'

export default function InfoButtonStory() {
	return (
		<Box display={'flex'} flexDirection={'row'}>
			Bla bla bla
			<InfoButton>Tady je nějaký text. Je opravdu popisny. Husty</InfoButton>
		</Box>
	)
}

createStory(InfoButton, InfoButtonStory)

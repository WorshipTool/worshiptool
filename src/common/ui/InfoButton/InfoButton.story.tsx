import { createStory } from '@/app/(layout)/storybook/createStory'
import { Box } from '@/common/ui'
import { InfoButton } from '@/common/ui/InfoButton/InfoButton'

export default function InfoButtonStory() {
	return (
		<Box display={'flex'} flexDirection={'row'}>
			Bla bla bla
			<InfoButton>Tady je nějaký text. Je opravdu popisny. Husty</InfoButton>
		</Box>
	)
}

createStory(InfoButton, InfoButtonStory)

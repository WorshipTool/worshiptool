import { createStory } from '../../../app/(layout)/storybook/createStory'
import CustomChip from './CustomChip'

const CustomChipStory = () => {
	return <CustomChip label={'Chip label'} />
}

createStory(CustomChip, CustomChipStory)

import { createStory } from '../../../app/storybook/createStory'
import CustomChip from './CustomChip'

const CustomChipStory = () => {
	return <CustomChip label={'Chip label'} />
}

createStory(CustomChip, CustomChipStory)

import { Box } from '@/common/ui'
import { createStory } from '../../../app/(layout)/storybook/createStory'
import { Checkbox } from './Checkbox'

export default function CheckBoxStory() {
	return (
		<Box>
			<Checkbox />
			<Checkbox color="success" label="Success-colored checkbox" checked />
			<Checkbox color="pink" label="Pinky with label" />
		</Box>
	)
}

createStory(Checkbox, CheckBoxStory)

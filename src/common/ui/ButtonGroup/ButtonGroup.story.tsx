import { Button } from '@ui/Button'
import { ButtonGroup } from '@ui/ButtonGroup'
import { createStory } from '../../../app/storybook/createStory'

const ButtonGroupStory = () => {
	return (
		<ButtonGroup>
			<Button>Button 1</Button>
			<Button color="secondary">Button 2</Button>
			<Button variant="outlined">Button 3</Button>
		</ButtonGroup>
	)
}

createStory(ButtonGroup, ButtonGroupStory)

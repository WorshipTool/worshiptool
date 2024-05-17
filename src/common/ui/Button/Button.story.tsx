import { Button } from '@ui/Button'
import { createStory } from '../../../app/storybook/createStory'
import { Gap } from '../Gap/Gap'

const ButtonStory = () => {
	return (
		<div>
			<Button>Hello Button</Button>
			<Gap />
			<Button size="small" color="secondary" to="home">
				Button with link
			</Button>
			<Gap />
			<Button
				color="green"
				size="small"
				tooltip="Hellou 'Green'"
				to="home"
				variant="outlined"
				tooltipPlacement="right"
			>
				Button with tooltip
			</Button>

			<Gap />
			<Button
				size="small"
				tooltip="Helloo"
				to="home"
				variant="outlined"
				tooltipPlacement="right"
				loading
			>
				Loading Button
			</Button>
		</div>
	)
}

createStory(Button, ButtonStory)

import { TextSnippet } from '@mui/icons-material'
import { IconButton } from '@ui/IconButton'
import { createStory } from '../../../app/storybook/createStory'

const IconButtonStory = () => {
	return (
		<>
			<IconButton>
				<TextSnippet />
			</IconButton>

			<IconButton
				color="inherit"
				tooltip="Yes, document!"
				tooltipPlacement="right"
			>
				<TextSnippet />
			</IconButton>

			<IconButton color="red" tooltip="Custom color string">
				<TextSnippet />
			</IconButton>
		</>
	)
}

createStory(IconButton, IconButtonStory)

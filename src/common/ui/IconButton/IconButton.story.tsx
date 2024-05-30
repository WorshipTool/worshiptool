import { IconButton } from '@/ui/IconButton'
import { TextSnippet } from '@mui/icons-material'
import { createStory } from '../../../app/(layout)/storybook/createStory'

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

import { Button } from '@mui/material'
import { createStory } from '../../../app/(layout)/storybook/createStory'
import Tooltip from './Tooltip'

const CustomToolkipStory = () => (
	<Tooltip title="This is a custom tooltip" placement="top-start">
		<Button>Hover me</Button>
	</Tooltip>
)

createStory(Tooltip, CustomToolkipStory)

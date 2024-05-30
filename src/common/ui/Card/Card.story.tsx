import { Info } from '@mui/icons-material'
import { createStory } from '../../../app/(layout)/storybook/createStory'
import { Typography } from '../Typography/Typography'
import Card from './Card'

const CardStory = () => {
	return (
		<Card title="Ukazka" icon={<Info />}>
			<Typography>
				Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam nec
			</Typography>
		</Card>
	)
}

createStory(Card, CardStory)

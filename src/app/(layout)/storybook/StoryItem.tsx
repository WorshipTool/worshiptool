import { Box, Divider } from '@mui/material'
import { Gap } from '../../../common/ui/Gap'
import { Typography } from '../../../common/ui/Typography/Typography'
import { StoryBookItem } from './createStory'

type StoryItemProps = {
	item: StoryBookItem
}

export default function StoryItem(props: StoryItemProps) {
	return (
		<Box
			sx={{
				justifyContent: 'center',
				alignItems: 'center',
				border: '1px solid black',
				borderColor: 'grey.300',
				borderRadius: 1,
				bgcolor: 'rgba(255,255,255,0.4)',
				backdropFilter: 'blur(6px)',
				padding: 3,
			}}
		>
			<Typography>{props.item.name}</Typography>
			<Divider />
			<Gap />
			<Box
				sx={{
					display: 'flex',
				}}
			>
				{props.item.component()}
			</Box>
		</Box>
	)
}

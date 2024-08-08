import { Typography } from '@/common/ui/Typography'
import { Box } from '@mui/material'

type SectionLabelPillProps = {
	label: string
}

export default function SectionLabelPill(props: SectionLabelPillProps) {
	return (
		<Box
			bgcolor={'secondary.main'}
			sx={{
				padding: 1,
				borderRadius: 2,
			}}
		>
			<Typography size={'small'} strong color="grey.800">
				{props.label.toLocaleUpperCase()}
			</Typography>
		</Box>
	)
}

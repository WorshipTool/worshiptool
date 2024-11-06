import { Box } from '@/common/ui'
import { Typography } from '@/common/ui/Typography'

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

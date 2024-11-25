import TeamCard from '@/app/(submodules)/(teams)/sub/tymy/(teampage)/[alias]/components/TeamCard/TeamCard'
import { Box, Typography } from '@/common/ui'

type TeamStatisticsCardProps = {
	label: string
	rightLabel?: string
	children?: React.ReactNode
}
export default function TeamStatisticsCard(props: TeamStatisticsCardProps) {
	return (
		<TeamCard>
			<Box display={'flex'} justifyContent={'space-between'} flexWrap={'wrap'}>
				<Typography variant="h6" strong>
					{props.label}
				</Typography>
				<Typography small>{props.rightLabel}</Typography>
			</Box>
			{props.children}
		</TeamCard>
	)
}

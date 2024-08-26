'use server'
import Menu from '@/app/(subdomains)/sub/tymy/[team]/components/LeftPanel/components/Menu'
import TeamPanelTitle from '@/app/(subdomains)/sub/tymy/[team]/components/LeftPanel/components/TeamPanelTitle'
import { Box } from '@mui/material'

type TeamLeftPanelProps = {
	teamAlias: string
}

export default async function TeamLeftPanel(props: TeamLeftPanelProps) {
	return (
		<Box
			sx={{
				width: 250,
				height: '100%',
				bgcolor: 'grey.300',
			}}
		>
			<TeamPanelTitle teamAlias={props.teamAlias} />
			<Menu teamAlias={props.teamAlias} />
		</Box>
	)
}

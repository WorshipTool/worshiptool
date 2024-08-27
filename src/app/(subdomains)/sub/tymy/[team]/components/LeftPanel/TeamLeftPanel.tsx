'use server'
import Menu from '@/app/(subdomains)/sub/tymy/[team]/components/LeftPanel/components/Menu'
import TeamPanelTitle from '@/app/(subdomains)/sub/tymy/[team]/components/LeftPanel/components/TeamPanelTitle'
import OnlyAdmin from '@/common/components/OnlyAdmin'
import { Button } from '@/common/ui/Button'
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
				bgcolor: 'grey.100',
				display: 'flex',
				flexDirection: 'column',
			}}
		>
			<TeamPanelTitle teamAlias={props.teamAlias} />
			<Menu teamAlias={props.teamAlias} />
			<Box flex={1} />
			<Box padding={2}>
				<OnlyAdmin>
					<Button to="home" size="small" color="secondary">
						Domů
					</Button>
				</OnlyAdmin>
			</Box>
		</Box>
	)
}

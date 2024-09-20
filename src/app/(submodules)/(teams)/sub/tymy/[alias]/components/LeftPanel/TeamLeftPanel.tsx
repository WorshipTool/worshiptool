'use server'
import Menu from '@/app/(submodules)/(teams)/sub/tymy/[alias]/components/LeftPanel/components/Menu'
import TeamPanelTitle from '@/app/(submodules)/(teams)/sub/tymy/[alias]/components/LeftPanel/components/TeamPanelTitle'
import OnlyAdmin from '@/common/components/OnlyAdmin'
import { Button } from '@/common/ui/Button'
import { Box } from '@mui/material'

type TeamLeftPanelProps = {
	teamAlias: string
}

export default async function TeamLeftPanel(props: TeamLeftPanelProps) {
	const WIDTH = 250
	return (
		<>
			<Box
				sx={{
					minWidth: WIDTH,

					position: 'fixed',
					height: '100%',
					bgcolor: 'grey.100',
					display: 'flex',
					flexDirection: 'column',
				}}
			>
				<TeamPanelTitle />
				<Menu />
				<Box flex={1} />
				<Box padding={2}>
					<OnlyAdmin>
						<Button to="home" size="small" color="secondary">
							Domů
						</Button>
					</OnlyAdmin>
				</Box>
			</Box>
			<Box
				sx={{
					minWidth: WIDTH,
					maxWidth: WIDTH,
				}}
			></Box>
		</>
	)
}

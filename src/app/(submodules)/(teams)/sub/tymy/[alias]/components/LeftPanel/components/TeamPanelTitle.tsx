'use client'
import { useTeamSideBar } from '@/app/(submodules)/(teams)/sub/tymy/[alias]/components/SmartTeamPage/hooks/useTeamSideBar'
import useInnerTeam from '@/app/(submodules)/(teams)/sub/tymy/hooks/useInnerTeam'
import { Clickable } from '@/common/ui/Clickable'
import { Link } from '@/common/ui/Link/Link'
import { Typography } from '@/common/ui/Typography'
import { Box } from '@mui/material'

type TeamPanelTitleProps = {
	collapsed: boolean
}

export default function TeamPanelTitle(props: TeamPanelTitleProps) {
	const { name, alias } = useInnerTeam()
	const { darkMode } = useTeamSideBar()
	return (
		<Box
			display={'flex'}
			flexDirection={'column'}
			justifyContent={'center'}
			alignItems={'center'}
			padding={3}
			gap={1}
			sx={{
				opacity: props.collapsed ? 0 : 1,
				transition: 'all 0.1s',
			}}
		>
			<Typography color={darkMode ? 'grey.300' : 'grey.800'} noWrap>
				Chválící tým
			</Typography>
			<Link
				to="team"
				params={{
					alias,
				}}
			>
				<Clickable>
					<Box
						display={'flex'}
						flexDirection={'row'}
						justifyContent={'center'}
						alignItems={'center'}
						gap={1}
						minWidth={'13rem'}
					>
						{/* <Box
							width={'3rem'}
							sx={{
								aspectRatio: '2/1',
							}}
							position={'relative'}
						>
							<Image
								src={'/assets/13ka-icon.png'}
								alt={'Logo skupiny'}
								fill
								objectFit={'contain'}
							/>
						</Box> */}
						<Typography variant="h4">{name}</Typography>
					</Box>
				</Clickable>
			</Link>
		</Box>
	)
}

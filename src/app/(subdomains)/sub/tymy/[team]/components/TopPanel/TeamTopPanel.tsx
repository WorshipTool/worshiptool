'use server'
import TeamPageTitleContainer from '@/app/(subdomains)/sub/tymy/[team]/components/TopPanel/components/TeamPageTitleContainer'
import RightAccountPanel from '@/common/components/Toolbar/components/RightAccountPanel/RightAccountPanel'
import { Box } from '@mui/material'

export default async function TeamTopPanel() {
	return (
		<Box
			sx={{
				// height: 60,
				// bgcolor: 'grey.400',
				paddingX: 4,
				paddingY: 3,
			}}
			display={'flex'}
			flexDirection={'row'}
			alignItems={'center'}
		>
			<TeamPageTitleContainer />
			<RightAccountPanel />
		</Box>
	)
}

'use server'
import TeamLeftPanel from '@/app/(subdomains)/sub/tymy/[team]/components/LeftPanel/TeamLeftPanel'
import TeamTopPanel from '@/app/(subdomains)/sub/tymy/[team]/components/TopPanel/TeamTopPanel'
import { LayoutProps } from '@/common/types'
import { Box } from '@mui/material'
import { notFound } from 'next/navigation'

export default async function TeamLayout(layout: LayoutProps<'team'>) {
	const team = layout.params.team
	if (team !== '13ka') notFound()

	return (
		<Box display={'flex'} flexDirection={'row'} height={'100vh'}>
			<TeamLeftPanel teamAlias={team} />
			<Box display={'flex'} flexDirection={'column'} flex={1}>
				<TeamTopPanel />
				<Box paddingX={4}>{layout.children}</Box>
			</Box>
		</Box>
	)
}

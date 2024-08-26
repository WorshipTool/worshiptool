'use server'
import TeamLeftPanel from '@/app/(subdomains)/sub/tymy/[team]/components/LeftPanel/TeamLeftPanel'
import { LayoutProps } from '@/common/types'
import { Box } from '@mui/material'
import { notFound } from 'next/navigation'

export default async function TeamLayout(layout: LayoutProps<'team'>) {
	const team = layout.params.team
	if (team !== '13ka') notFound()

	return (
		<Box display={'flex'} flexDirection={'row'} height={'100vh'}>
			<TeamLeftPanel teamAlias={team} />
			{layout.children}
		</Box>
	)
}

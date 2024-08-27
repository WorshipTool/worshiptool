'use server'
import { TeamGettingApi } from '@/api/generated'
import TeamLeftPanel from '@/app/(subdomains)/sub/tymy/[alias]/components/LeftPanel/TeamLeftPanel'
import TeamTopPanel from '@/app/(subdomains)/sub/tymy/[alias]/components/TopPanel/TeamTopPanel'
import { LayoutProps, MetadataProps } from '@/common/types'
import { generateMetadataTitle } from '@/hooks/window-title/tech'
import { Box } from '@mui/material'
import { notFound } from 'next/navigation'
import { handleApiCall } from '../../../../../tech/handleApiCall'

const getTeamInfo = async (teamAlias: string) => {
	const gettingApi = new TeamGettingApi()
	try {
		const team = await handleApiCall(
			gettingApi.teamGettingControllerGetTeamBasicInfo(teamAlias)
		)
		return team
	} catch (e) {
		return null
	}
}

export const generateMetadata = async ({ params }: MetadataProps<'team'>) => {
	const info = await getTeamInfo(params.alias)
	const teamName = 'Třináctka'

	const title = info ? `Tým ${teamName}` : 'Tým'

	return {
		title: await generateMetadataTitle(title, 'team', params),
	}
}

export default async function TeamLayout(layout: LayoutProps<'team'>) {
	const info = await getTeamInfo(layout.params.alias)
	if (!info) notFound()

	const team = layout.params.alias

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

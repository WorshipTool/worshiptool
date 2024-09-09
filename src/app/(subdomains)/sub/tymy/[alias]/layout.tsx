'use server'
import {
	IsUserMemberOfTeamOutDto,
	TeamGettingApi,
	TeamMembersApiAxiosParamCreator,
} from '@/api/generated'
import { BASE_PATH } from '@/api/generated/base'
import TeamLeftPanel from '@/app/(subdomains)/sub/tymy/[alias]/components/LeftPanel/TeamLeftPanel'
import TeamTopPanel from '@/app/(subdomains)/sub/tymy/[alias]/components/TopPanel/TeamTopPanel'
import { InnerTeamProvider } from '@/app/(subdomains)/sub/tymy/hooks/useInnerTeam'
import { LayoutProps, MetadataProps } from '@/common/types'
import { AUTH_COOKIE_NAME } from '@/hooks/auth/auth.constants'
import { useServerPathname } from '@/hooks/pathname/useServerPathname'
import { generateMetadataTitle } from '@/hooks/window-title/tech'
import { UserDto } from '@/interfaces/user'
import { smartRedirect } from '@/routes/routes.tech.server'
import { Box } from '@mui/material'
import { cookies } from 'next/headers'
import { notFound } from 'next/navigation'
import { handleApiCall } from '../../../../../tech/handleApiCall'

const getTeamInfo = async (teamAlias: string) => {
	const gettingApi = new TeamGettingApi()
	try {
		const team = await handleApiCall(
			gettingApi.teamGettingControllerGetTeamBasicInfo(teamAlias)
		)
		return team
	} catch (e: any) {
		return null
	}
}

const checkUserMembership = async (
	teamAlias: string
): Promise<boolean | null> => {
	const cookie = cookies()
	const cookieData = cookie.get(AUTH_COOKIE_NAME)
	const user: UserDto | undefined = cookieData
		? JSON.parse(cookieData.value)
		: undefined

	if (!user) {
		return null
	}

	const creator = TeamMembersApiAxiosParamCreator({
		isJsonMime: () => true,
		accessToken: user.token,
	})

	try {
		const fetchData = await creator.teamMemberControllerIsUserMemberOfTeam(
			teamAlias
		)
		const url = BASE_PATH + fetchData.url
		const result = await fetch(url, { ...(fetchData.options as any) })

		const data: IsUserMemberOfTeamOutDto = await result.json()

		if (data.isMember) {
			return true
		}
	} catch (e) {}

	return false
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
	const pathname = useServerPathname()
	const info = await getTeamInfo(layout.params.alias)
	if (!info) notFound()

	const membershipCheck = await checkUserMembership(info.alias)
	if (!membershipCheck) {
		if (membershipCheck === null) {
			smartRedirect('login', {
				previousPage: pathname,
				message: 'Pro vstup do týmu se musíte přihlásit',
			})
		} else {
			smartRedirect('teams', {})
		}
	}

	const team = layout.params.alias

	return (
		<Box display={'flex'} flexDirection={'row'} height={'100vh'}>
			<InnerTeamProvider teamAlias={layout.params.alias}>
				<TeamLeftPanel teamAlias={team} />
				<Box display={'flex'} flexDirection={'column'} flex={1} height={'100%'}>
					<TeamTopPanel />
					<Box paddingX={4} flex={1}>
						{layout.children}
					</Box>
				</Box>
			</InnerTeamProvider>
		</Box>
	)
}

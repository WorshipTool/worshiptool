'use server'
import {
	IsUserMemberOfTeamOutDto,
	TeamGettingApi,
	TeamMembersApiAxiosParamCreator,
} from '@/api/generated'
import { BASE_PATH } from '@/api/generated/base'
import { getImageUrl } from '@/api/urls'
import TeamLeftPanel from '@/app/(submodules)/(teams)/sub/tymy/[alias]/components/LeftPanel/TeamLeftPanel'
import TeamPageProviders from '@/app/(submodules)/(teams)/sub/tymy/[alias]/components/Providers/TeamPageProviders'
import TeamTopPanel from '@/app/(submodules)/(teams)/sub/tymy/[alias]/components/TopPanel/TeamTopPanel'
import TeamClientProviders from '@/app/(submodules)/(teams)/sub/tymy/[alias]/TeamClientProviders'
import { InnerTeamProvider } from '@/app/(submodules)/(teams)/sub/tymy/hooks/useInnerTeam'
import { LayoutProps } from '@/common/types'
import { Box } from '@/common/ui'
import { AUTH_COOKIE_NAME } from '@/hooks/auth/auth.constants'
import { useServerPathname } from '@/hooks/pathname/useServerPathname'
import { UserDto } from '@/interfaces/user'
import { smartRedirect } from '@/routes/routes.tech.server'
import { handleApiCall } from '@/tech/handleApiCall'
import { generateSmartMetadata } from '@/tech/metadata/metadata'
import { cookies } from 'next/headers'
import { notFound } from 'next/navigation'

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

export const generateMetadata = generateSmartMetadata(
	'team',
	async ({ params }) => {
		const info = await getTeamInfo(params.alias)
		const teamName = info?.name

		const title = info ? `Tým ${teamName}` : 'Tým'
		const imageUrl = info?.logoGuid ? getImageUrl(info.logoGuid) : null

		return {
			title,

			...(imageUrl
				? {
						icons: {
							icon: imageUrl,
						},
				  }
				: {}),
		}
	}
)

export default async function TeamLayout(layout: LayoutProps<'team'>) {
	const pathname = await useServerPathname()
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

	return (
		<Box
			display={'flex'}
			flexDirection={'row'}
			height={'100vh'}
			position={'relative'}
		>
			<InnerTeamProvider teamAlias={layout.params.alias}>
				<TeamClientProviders>
					<TeamPageProviders>
						<TeamLeftPanel />
						<Box
							display={'flex'}
							flexDirection={'column'}
							flex={1}
							height={'100%'}
						>
							<TeamTopPanel />
							<Box flex={1} paddingBottom={4}>
								{layout.children}
							</Box>
						</Box>
					</TeamPageProviders>
				</TeamClientProviders>
			</InnerTeamProvider>
		</Box>
	)
}

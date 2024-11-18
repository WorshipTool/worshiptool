'use server'
import { getImageUrl } from '@/api/urls'
import { TeamTopBarProvider } from '@/app/(submodules)/(teams)/sub/tymy/(teampage)/[alias]/components/SmartTeamPage/hooks/useTeamTopBar'
import TeamTopPanel from '@/app/(submodules)/(teams)/sub/tymy/(teampage)/[alias]/components/TopPanel/TeamTopPanel'
import TeamClientProviders from '@/app/(submodules)/(teams)/sub/tymy/(teampage)/[alias]/TeamClientProviders'
import { InnerTeamProvider } from '@/app/(submodules)/(teams)/sub/tymy/(teampage)/hooks/useInnerTeam'
import {
	checkLayoutUserMembership,
	getLayoutTeamInfo,
	getLayoutTeamPayload,
} from '@/app/(submodules)/(teams)/sub/tymy/(teampage)/tech/layout.tech'
import JoinTeamPublicPanel from '@/app/(submodules)/(teams)/sub/tymy/(teampage)/v/[alias]/components/JoinTeamPublicPanel'
import { LayoutProps } from '@/common/types'
import { Box } from '@/common/ui'
import { useServerPathname } from '@/hooks/pathname/useServerPathname'
import { smartRedirect } from '@/routes/routes.tech.server'
import { generateSmartMetadata } from '@/tech/metadata/metadata'
import { notFound } from 'next/navigation'

export const generateMetadata = generateSmartMetadata(
	'team',
	async ({ params }) => {
		const info = await getLayoutTeamInfo(params.alias)
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

export default async function TeamPublicLayout(
	props: LayoutProps<'teamPublic'>
) {
	const alias = props.params.alias
	const pathname = await useServerPathname()
	const info = await getLayoutTeamInfo(alias)
	if (!info) notFound()

	const payload = await getLayoutTeamPayload(info.guid)

	const membershipCheck = await checkLayoutUserMembership(alias)

	if (!payload.showSongbookForNotMembers || membershipCheck) {
		smartRedirect('team', { alias })
	}

	return (
		<Box
			display={'flex'}
			flexDirection={'row'}
			height={'100vh'}
			position={'relative'}
		>
			<InnerTeamProvider teamAlias={props.params.alias}>
				<TeamClientProviders>
					<TeamTopBarProvider>
						<Box
							display={'flex'}
							flexDirection={'column'}
							sx={{
								width: '100%',
							}}
						>
							<TeamTopPanel />
							<Box
								display={'flex'}
								flexDirection={'column'}
								gap={2}
								sx={{
									paddingX: 4,
									paddingBottom: 4,
								}}
							>
								<JoinTeamPublicPanel />
								{props.children}
							</Box>
						</Box>
					</TeamTopBarProvider>
				</TeamClientProviders>
			</InnerTeamProvider>
		</Box>
	)
}

import TeamKickOutOnSignout from '@/app/(subdomains)/sub/tymy/[alias]/lide/components/TeamKickOutOnSignout'
import { LayoutProps, MetadataProps } from '@/common/types'
import { generateMetadataTitle } from '@/hooks/window-title/tech'

export const generateMetadata = async ({
	params,
}: MetadataProps<'teamPeople'>) => {
	return {
		title: await generateMetadataTitle('Lidé', 'teamPeople', params),
	}
}

export default function TeamPeopleLayout(props: LayoutProps<'teamPeople'>) {
	return (
		<>
			<TeamKickOutOnSignout />
			{props.children}
		</>
	)
}

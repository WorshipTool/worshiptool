import TeamKickOutOnSignout from '@/app/(submodules)/(teams)/sub/tymy/[alias]/lide/components/TeamKickOutOnSignout'
import { LayoutProps, MetadataProps } from '@/common/types'
import { generateSmartMetadata } from '../../../../../../../tech/metadata/metadata'

export const generateMetadata = generateSmartMetadata(
	'teamPeople',
	async ({ params }: MetadataProps<'teamPeople'>) => {
		return {
			title: 'Lidé',
		}
	}
)

export default function TeamPeopleLayout(props: LayoutProps<'teamPeople'>) {
	return (
		<>
			<TeamKickOutOnSignout />
			{props.children}
		</>
	)
}

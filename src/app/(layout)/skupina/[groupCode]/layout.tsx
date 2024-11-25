import { generateSmartMetadata } from '@/tech/metadata/metadata'
import { GroupApi } from '../../../../api/generated'
import { LayoutProps, MetadataProps } from '../../../../common/types'
import { handleApiCall } from '../../../../tech/handleApiCall'

export const generateMetadata = generateSmartMetadata(
	'group',
	async (props: MetadataProps<'group'>) => {
		const api = new GroupApi()
		try {
			const group = await handleApiCall(
				api.groupControllerGetGroupInfo(undefined, props.params.groupCode)
			)

			const title = group ? group.name + ' (Skupina)' : 'Skupina'
			return {
				title: title,
			}
		} catch (e) {
			return {
				title: 'Skupina',
			}
		}
	}
)

export default function GroupScreen(props: LayoutProps) {
	return <>{props.children}</>
}

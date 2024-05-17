import { GroupApi } from '../../../api/generated'
import { LayoutProps, MetadataProps } from '../../../common/types'
import { generateMetadataTitle } from '../../../hooks/window-title/tech'
import { handleApiCall } from '../../../tech/handleApiCall'

export const generateMetadata = async (props: MetadataProps<'group'>) => {
	const api = new GroupApi()
	try {
		const group = await handleApiCall(
			api.groupControllerGetGroupInfo(undefined, props.params.groupCode)
		)

		const title = group ? group.name + ' (Skupina)' : 'Skupina'
		return {
			title: await generateMetadataTitle(title, 'group', props.params),
		}
	} catch (e) {
		return {
			title: await generateMetadataTitle('Skupina', 'group', props.params),
		}
	}
}

export default function GroupScreen(props: LayoutProps) {
	return <>{props.children}</>
}

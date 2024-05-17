import { LayoutProps, MetadataProps } from '../../../../common/types'
import { generateMetadataTitle } from '../../../../hooks/window-title/tech'

export const generateMetadata = async ({
	params,
}: MetadataProps<'playlistCards'>) => {
	return {
		title: await generateMetadataTitle('💻', 'playlistCards', params),
	}
}

export default function layout(props: LayoutProps) {
	return <div>{props.children}</div>
}

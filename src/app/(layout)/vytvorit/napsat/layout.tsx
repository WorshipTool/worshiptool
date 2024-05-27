import { LayoutProps } from '../../../../common/types'
import { generateMetadataTitle } from '../../../../hooks/window-title/tech'

export const generateMetadata = async () => ({
	title: await generateMetadataTitle('Napsat píseň', 'writeSong', {}),
})

export default function layout(props: LayoutProps) {
	return props.children
}

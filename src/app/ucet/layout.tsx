import { LayoutProps } from '../../common/types'
import { generateMetadataTitle } from '../../hooks/window-title/tech'

export const generateMetadata = async () => {
	return {
		title: await generateMetadataTitle('Můj účet', 'account', {}),
	}
}

export default function layout(props: LayoutProps) {
	return props.children
}

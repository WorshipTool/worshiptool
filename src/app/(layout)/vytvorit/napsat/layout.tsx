import { generateSmartMetadata } from '@/tech/metadata/metadata'
import { LayoutProps } from '../../../../common/types'

export const generateMetadata = generateSmartMetadata(
	'writeSong',
	async () => ({
		title: 'Napsat píseň',
	})
)

export default function layout(props: LayoutProps) {
	return props.children
}

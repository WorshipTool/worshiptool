import { LayoutProps } from '../../../../common/types'
import { generateSmartMetadata } from '../../../../tech/metadata/metadata'

export const generateMetadata = generateSmartMetadata(
	'usersSongs',
	async () => {
		return {
			title: 'Moje písně',
		}
	}
)

export default function layout(props: LayoutProps) {
	return props.children
}

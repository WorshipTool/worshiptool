import { LayoutProps } from '@/common/types'
import { generateSmartMetadata } from '@/tech/metadata/metadata'

export const generateMetadata = generateSmartMetadata(
	'usersFavourites',
	async () => {
		return {
			title: 'Mé oblíbené',
		}
	}
)

export default function Layout(props: LayoutProps<'usersFavourites'>) {
	return props.children
}

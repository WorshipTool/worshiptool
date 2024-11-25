import { generateSmartMetadata } from '@/tech/metadata/metadata'
import { LayoutProps } from '../../../common/types'

export const generateMetadata = generateSmartMetadata('account', () => {
	return {
		title: 'Můj účet',
	}
})

export default function layout(props: LayoutProps) {
	return props.children
}

import { LayoutProps } from '../../../common/types'
import { generateSmartMetadata } from '../../../tech/metadata/metadata'

export const generateMetadata = generateSmartMetadata('login', async () => {
	return {
		title: 'Přihlášení',
	}
})

export default function layout(props: LayoutProps) {
	return props.children
}

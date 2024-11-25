import { generateSmartMetadata } from '@/tech/metadata/metadata'
import { LayoutProps } from '../../../common/types'

export const generateMetadata = generateSmartMetadata('addMenu', async () => ({
	title: 'Vytvořit',
}))

export default function layout({ children }: LayoutProps) {
	return children
}

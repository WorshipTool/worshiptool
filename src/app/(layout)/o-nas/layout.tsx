import { LayoutProps } from '@/common/types'
import { generateSmartMetadata } from '@/tech/metadata/metadata'

export const generateMetadata = generateSmartMetadata('about', () => ({
	title: 'O aplikaci',
}))

export default function AboutLayout({ children }: LayoutProps) {
	return children
}

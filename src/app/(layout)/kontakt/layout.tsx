import { LayoutProps } from '@/common/types'
import { generateSmartMetadata } from '@/tech/metadata/metadata'

export const generateMetadata = generateSmartMetadata('contact', () => ({
	title: 'Kontakt',
}))

export default function ContactLayout({ children }: LayoutProps) {
	return children
}

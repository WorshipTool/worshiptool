'use server'
import { LayoutProps } from '@/common/types'
import { generateSmartMetadata } from '@/tech/metadata/metadata'

export const generateMetadata = generateSmartMetadata('about', () => ({
	title: 'O aplikaci',
}))

export default async function AboutLayout({ children }: LayoutProps) {
	return children
}

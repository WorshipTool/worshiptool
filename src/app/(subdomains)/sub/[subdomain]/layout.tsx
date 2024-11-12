'use server'
import { LayoutProps } from '@/common/types'

export default async function SubdomainLayout({
	children,
}: LayoutProps<'subdomain'>) {
	return <>{children}</>
}

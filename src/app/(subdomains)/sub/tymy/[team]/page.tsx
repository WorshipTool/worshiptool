'use client'
import { PageProps } from '@/common/types'
import { useClientPathname } from '@/hooks/pathname/useClientPathname'

export default function TeamPage(props: PageProps<'team'>) {
	const pathname = useClientPathname()
	return (
		<div>
			ahojj {props.params.team} {pathname}
		</div>
	)
}

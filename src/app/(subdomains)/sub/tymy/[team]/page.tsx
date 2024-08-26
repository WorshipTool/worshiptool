'use client'
import { TeamPageTitle } from '@/app/(subdomains)/sub/tymy/[team]/components/TopPanel/components/TeamPageTitle'
import { PageProps } from '@/common/types'
import { useClientPathname } from '@/hooks/pathname/useClientPathname'

export default function TeamPage(props: PageProps<'team'>) {
	const pathname = useClientPathname()
	return (
		<div>
			<TeamPageTitle>Přehled</TeamPageTitle>
			ahojj {props.params.team} {pathname}
		</div>
	)
}

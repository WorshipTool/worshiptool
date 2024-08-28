'use client'
import { TeamPageTitle } from '@/app/(subdomains)/sub/tymy/[alias]/components/TopPanel/components/TeamPageTitle'
import useInnerTeam from '@/app/(subdomains)/sub/tymy/hooks/useInnerTeam'

export default function TeamSongsPage() {
	const { selectionGuid } = useInnerTeam()
	return (
		<div>
			<TeamPageTitle>Zpěvník</TeamPageTitle>
			pisnee <i>{selectionGuid}</i>
		</div>
	)
}

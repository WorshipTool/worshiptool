'use client'
import { TeamPageTitle } from '@/app/(subdomains)/sub/tymy/[alias]/components/TopPanel/components/TeamPageTitle'
import useInnerTeam from '@/app/(subdomains)/sub/tymy/hooks/useInnerTeam'
import usePlaylist from '@/hooks/playlist/usePlaylist'

export default function TeamSongsPage() {
	const { selectionGuid } = useInnerTeam()
	const { items } = usePlaylist(selectionGuid)
	return (
		<div>
			<TeamPageTitle>Zpěvník</TeamPageTitle>
			pisnee <i>{selectionGuid}</i>
			{items.map((item) => (
				<div key={item.guid}>{item.variant.preferredTitle}</div>
			))}
		</div>
	)
}

import { SmartTeamPage } from '@/app/(submodules)/(teams)/sub/tymy/[alias]/components/SmartTeamPage/SmartTeamPage'
import { TeamPageTitle } from '@/app/(submodules)/(teams)/sub/tymy/[alias]/components/TopPanel/components/TeamPageTitle'
export default SmartTeamPage(TeamStatistikyPage)

function TeamStatistikyPage() {
	return (
		<div>
			<TeamPageTitle>Statistiky</TeamPageTitle>
			Grafy tu budou
		</div>
	)
}

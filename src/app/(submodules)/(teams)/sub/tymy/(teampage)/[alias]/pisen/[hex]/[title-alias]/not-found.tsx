import TeamCard from '@/app/(submodules)/(teams)/sub/tymy/(teampage)/[alias]/components/TeamCard/TeamCard'
import { TeamPageTitle } from '@/app/(submodules)/(teams)/sub/tymy/(teampage)/[alias]/components/TopPanel/components/TeamPageTitle'
import { Typography } from '@/common/ui/Typography'

export default function NotFound() {
	return (
		<TeamCard>
			<TeamPageTitle>Chyba 😞</TeamPageTitle>
			<Typography variant="normal">Píseň nebyla nalezena...</Typography>
		</TeamCard>
	)
}

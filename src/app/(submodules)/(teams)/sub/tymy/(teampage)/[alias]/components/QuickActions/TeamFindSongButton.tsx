'use client'
import TeamQuickActionButton from '@/app/(submodules)/(teams)/sub/tymy/(teampage)/[alias]/components/QuickActions/TeamQuickActionButton'
import { Link } from '@/common/ui/Link/Link'
import { useSmartParams } from '@/routes/useSmartParams'
import { Search } from '@mui/icons-material'

export default function TeamFindSongButton() {
	const { alias } = useSmartParams('team')

	return (
		<Link to="teamSongbook" params={{ alias }}>
			<TeamQuickActionButton
				color="white"
				label={'Vyhledat píseň'}
				tooltip={'Vyhledat píseň ve zpěvníku'}
				icon={<Search />}
			/>
		</Link>
	)
}

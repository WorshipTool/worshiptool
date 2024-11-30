'use client'
import TeamQuickActionButton from '@/app/(submodules)/(teams)/sub/tymy/(teampage)/[alias]/components/QuickActions/TeamQuickActionButton'
import { useSmartParams } from '@/routes/useSmartParams'
import { Search } from '@mui/icons-material'

export default function TeamFindSongButton() {
	const { alias } = useSmartParams('team')

	return (
		<TeamQuickActionButton
			color="white"
			label={'Vyhledat píseň'}
			tooltip={'Vyhledat píseň ve zpěvníku'}
			icon={<Search />}
			to="teamSongbook"
			toParams={{ alias }}
		/>
	)
}

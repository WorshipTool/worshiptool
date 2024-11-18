import TeamCard from '@/app/(submodules)/(teams)/sub/tymy/(teampage)/[alias]/components/TeamCard/TeamCard'
import { useTeamPayload } from '@/app/(submodules)/(teams)/sub/tymy/(teampage)/hooks/payload/useTeamPayload'
import useInnerTeam from '@/app/(submodules)/(teams)/sub/tymy/(teampage)/hooks/useInnerTeam'
import { Checkbox } from '@/common/ui'
import { useEffect, useState } from 'react'

export default function AdvancedSettings() {
	const { guid: teamGuid } = useInnerTeam()
	const [_value, _setValue, loading] = useTeamPayload(teamGuid)

	const [value, setValue] = useState<boolean>(false)

	const onChange = (e: any, value: boolean) => {
		setValue(value)
		_setValue({
			showSongbookForNotMembers: value,
		})
	}

	useEffect(() => {
		setValue(_value.showSongbookForNotMembers)
	}, [_value.showSongbookForNotMembers])
	return (
		<TeamCard title="Pokročilé nastavení">
			<Checkbox
				label={'Zobrazit seznam písní pro nečleny'}
				checked={value}
				onChange={onChange}
				disabled={loading}
			/>
		</TeamCard>
	)
}

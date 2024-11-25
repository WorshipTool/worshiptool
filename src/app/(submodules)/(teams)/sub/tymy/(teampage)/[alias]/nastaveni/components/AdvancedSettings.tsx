import TeamCard from '@/app/(submodules)/(teams)/sub/tymy/(teampage)/[alias]/components/TeamCard/TeamCard'
import { useTeamPayload } from '@/app/(submodules)/(teams)/sub/tymy/(teampage)/hooks/payload/useTeamPayload'
import useInnerTeam from '@/app/(submodules)/(teams)/sub/tymy/(teampage)/hooks/useInnerTeam'
import { Box, Checkbox, Typography } from '@/common/ui'
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
		<TeamCard>
			<Box
				display={'flex'}
				justifyContent={'space-between'}
				flexDirection={'column'}
				flexWrap={'wrap'}
				gap={1}
			>
				<Box maxWidth={500}>
					<Typography variant={'h6'} strong>
						Co se má zobrazit lidem, kteří nejsou členy?
					</Typography>
					<Typography color="grey.600">
						Lidé mimo tým, mohou být rovnou přesměrováni pryč, nebo jim může být
						zobrazen alespoň seznam písní.
					</Typography>
				</Box>
				<Checkbox
					label={'Zobrazit seznam písní pro lidi mimo tým'}
					checked={value}
					onChange={onChange}
					disabled={loading}
				/>
			</Box>
		</TeamCard>
	)
}

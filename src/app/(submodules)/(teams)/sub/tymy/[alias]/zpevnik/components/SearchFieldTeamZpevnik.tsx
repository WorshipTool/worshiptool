import useInnerTeam from '@/app/(submodules)/(teams)/sub/tymy/hooks/useInnerTeam'
import { Box } from '@/common/ui'
import { SearchBar } from '@/common/ui/SearchBar/SearchBar'
import { useChangeDelayer } from '@/hooks/changedelay/useChangeDelayer'
import { useState } from 'react'

type SearchFieldTeamZpevnikProps = {
	onSearch: (value: string) => void
}

export default function SearchFieldTeamZpevnik(
	props: SearchFieldTeamZpevnikProps
) {
	const [value, setValue] = useState('')

	const { selection } = useInnerTeam()

	useChangeDelayer(
		value,
		(value) => {
			selection.search(value)
			props.onSearch(value)
		},
		[]
	)

	const onChange = (value: string) => {
		setValue(value)
	}
	return (
		<Box maxWidth={500} flex={1}>
			<SearchBar value={value} onChange={onChange} />
		</Box>
	)
}

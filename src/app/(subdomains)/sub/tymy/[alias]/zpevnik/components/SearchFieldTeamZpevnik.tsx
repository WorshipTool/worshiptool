import useInnerTeam from '@/app/(subdomains)/sub/tymy/hooks/useInnerTeam'
import SearchBar from '@/common/ui/SearchBar/SearchBar'
import { useChangeDelayer } from '@/hooks/changedelay/useChangeDelayer'
import { Box } from '@mui/material'
import { useState } from 'react'

export default function SearchFieldTeamZpevnik() {
	const [value, setValue] = useState('')

	const { selection } = useInnerTeam()

	useChangeDelayer(
		value,
		(value) => {
			selection.search(value)
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

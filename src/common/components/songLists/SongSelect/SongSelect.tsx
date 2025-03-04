import { Box, Button, Typography } from '@/common/ui'
import { TextField } from '@/common/ui/mui'
import { SearchKey } from '@/types/song/search.types'
import React from 'react'
import { BasicVariantPack, SongVariantDto } from '../../../../api/dtos'
import useSongSearch from '../../../../hooks/song/useSongSearch'
import normalizeSearchText from '../../../../tech/string/normalizeSearchText'
import OnChangeDelayer from '../../../providers/ChangeDelayer/ChangeDelayer'
import SongListCards from '../SongListCards/SongListCards'

interface SongSelectProps {
	onChange?: (a: BasicVariantPack | null) => void
	filter?: (a: BasicVariantPack) => boolean
}

export default function SongSelect({ onChange, filter }: SongSelectProps) {
	const search = useSongSearch()
	const [value, setValue] = React.useState<string>('')

	const [data, setData] = React.useState<BasicVariantPack[]>([])

	const [open, setOpen] = React.useState(false)

	const [chosen, setChosen] = React.useState<SongVariantDto | undefined>(
		undefined
	)

	const searchCallback = () => {
		search(value as SearchKey, { page: 0 }).then((data) => {
			//TODO: Fix this
			const d = data.filter((v) => (filter ? filter(v.found[0]) : true))
			setData(d.map((v) => v.found[0]))
			setOpen(data.length > 0)
		})
	}

	const onEmptyClick = () => {
		setChosen(undefined)
		onChange?.(null)
	}

	return (
		<Box>
			<OnChangeDelayer
				value={normalizeSearchText(value)}
				onChange={searchCallback}
			/>

			<TextField
				value={value}
				onChange={(e) => setValue(e.target.value)}
				variant="outlined"
				onFocus={() => setOpen(data.length > 0)}
			/>

			<Button onClick={onEmptyClick}>Smazat</Button>
			{data.length > 0 ? (
				<>
					{chosen ? (
						<Typography>Zvoleno: {chosen?.preferredTitle}</Typography>
					) : (
						<Typography>Není zvoleno</Typography>
					)}
				</>
			) : (
				<>
					<Typography>Nic jsme nenašli</Typography>
				</>
			)}

			{open && <SongListCards data={data} />}
		</Box>
	)
}

import { Box, Button, TextField, Typography } from '@mui/material'
import React from 'react'
import { SongVariantDto } from '../../../../api/dtos'
import useSongSearch from '../../../../hooks/song/useSongSearch'
import normalizeSearchText from '../../../../tech/normalizeSearchText'
import OnChangeDelayer from '../../../providers/ChangeDelayer/ChangeDelayer'
import SongListCards from '../SongListCards/SongListCards'

interface SongSelectProps {
	onChange?: (a: SongVariantDto | null) => void
	filter?: (a: SongVariantDto) => boolean
}

export default function SongSelect({ onChange, filter }: SongSelectProps) {
	const search = useSongSearch()
	const [value, setValue] = React.useState<string>('')

	const [data, setData] = React.useState<SongVariantDto[]>([])

	const [open, setOpen] = React.useState(false)

	const [chosen, setChosen] = React.useState<SongVariantDto | undefined>(
		undefined
	)

	const searchCallback = () => {
		search({ searchKey: value, page: 0 }).then((data) => {
			const d = data.filter((v) => (filter ? filter(v) : true))
			setData(d)
			setOpen(data.length > 0)
		})
	}

	const onSongClick = (variant: SongVariantDto) => {
		setChosen(variant)
		onChange?.(variant)
		setOpen(false)
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

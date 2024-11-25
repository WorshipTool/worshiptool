import Menu from '@/common/components/Menu/Menu'
import { Box } from '@/common/ui'
import { Typography } from '@/common/ui/Typography'
import { ArrowDropDown } from '@mui/icons-material'
import { useState } from 'react'

export type PlaylistOrderOptions =
	| 'createdAt'
	| 'updatedAt'
	| 'openedAt'
	| 'title'

type Item = {
	label: string
	type: PlaylistOrderOptions
}

export type PlaylistsOrderSelectProps = {
	onChange: (type: PlaylistOrderOptions) => void
	startValue?: PlaylistOrderOptions
}
export default function PlaylistsOrderSelect(props: PlaylistsOrderSelectProps) {
	const [open, setOpen] = useState(false)
	const [anchor, setAnchor] = useState<null | HTMLElement>(null)

	const items: Item[] = [
		{ label: 'Data vytvoření', type: 'createdAt' },
		{ label: 'Data úpravy', type: 'updatedAt' },
		// { label: 'Posledního otevření', type: 'openedAt' },
		{ label: 'Názvu', type: 'title' },
	]
	const [selected, setSelected] = useState<Item>(
		props.startValue
			? items.find((a) => a.type === props.startValue) || items[0]
			: items[0]
	)

	return (
		<Box display={'flex'} gap={1}>
			<Typography color="grey.500" thin>
				Seřadit podle:
			</Typography>
			<Typography
				strong
				onClick={(e) => {
					setAnchor(e.currentTarget)
					setOpen(true)
				}}
				sx={{ cursor: 'pointer', display: 'flex', alignItems: 'center' }}
			>
				{selected.label}
				<ArrowDropDown />
			</Typography>
			<Menu
				open={open}
				onClose={() => setOpen(false)}
				anchor={anchor}
				items={items.map((a) => {
					return {
						title: a.label,
						onClick: () => {
							setOpen(false)
							setSelected(a)
							props.onChange(a.type)
						},
						selected: a.label === selected.label,
					}
				})}
			/>
		</Box>
	)
}

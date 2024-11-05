import Menu from '@/common/components/Menu/Menu'
import { MenuItemObjectType } from '@/common/components/Menu/MenuItem'
import { Add } from '@mui/icons-material'
import { Box, Chip } from '@mui/material'
import { useState } from 'react'
export type MySongFilterOption = 'private' | 'public'

type Item = {
	label: string
	type: MySongFilterOption
}

const filterOptios: Item[] = [
	{ label: 'Veřejné', type: 'public' },
	{ label: 'Soukromé', type: 'private' },
]

type MySongsFilterPanelProps = {
	addedFilters: MySongFilterOption[]
	onChange: (types: MySongFilterOption[]) => void
}

export default function MySongsFilterPanel(props: MySongsFilterPanelProps) {
	const [open, setOpen] = useState(false)
	const [anchor, setAnchor] = useState<null | HTMLElement>(null)

	const onClick = (e: React.MouseEvent<HTMLElement>) => {
		setAnchor(e.currentTarget)
		setOpen(true)
	}

	const items: MenuItemObjectType[] = filterOptios
		.filter((a) => {
			return !props.addedFilters.includes(a.type)
		})
		.map((a) => {
			return {
				title: a.label,
				onClick: () => {
					props.onChange([...props.addedFilters, a.type])
					setOpen(false)
				},
			}
		})
	return (
		<Box display={'flex'} gap={1}>
			<Chip
				label={'Přidat filtr'}
				icon={<Add />}
				// onDelete={onClick}
				onClick={onClick}
				size="small"
				disabled={items.length === 0}
				// color="primary"
			/>

			{props.addedFilters.map((a) => {
				return (
					<Chip
						key={a}
						label={filterOptios.find((b) => b.type === a)?.label}
						onDelete={() => {
							props.onChange(props.addedFilters.filter((b) => b !== a))
						}}
						size="small"
						color="primary"
					/>
				)
			})}

			<Menu
				open={open}
				onClose={() => setOpen(false)}
				anchor={anchor}
				items={items}
			/>
		</Box>
	)
}

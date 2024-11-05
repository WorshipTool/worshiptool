import { ListItemIcon, ListItemText, MenuItem as MIt } from '@mui/material'
import { ReactElement } from 'react'

export type MenuItemObjectType = {
	onClick?: (e: React.MouseEvent<HTMLElement>) => any
	title: string | ReactElement
	subtitle?: string
	icon?: ReactElement
	disabled?: boolean
	selected?: boolean
	hidden?: boolean
}

export default function MenuItem(item: MenuItemObjectType) {
	return item.hidden ? null : (
		<MIt
			onClick={item.onClick}
			disabled={item.disabled}
			selected={item.selected}
		>
			{item.icon && (
				<ListItemIcon>
					{/* <MoreHoriz fontSize="small" /> */}

					{/* // set size to icon ... {item.icon} */}

					{item.icon}
				</ListItemIcon>
			)}
			<ListItemText secondary={item.subtitle}>{item.title}</ListItemText>
		</MIt>
	)
}

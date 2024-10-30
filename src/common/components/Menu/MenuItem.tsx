import { ListItemIcon, ListItemText, MenuItem as MIt } from '@mui/material'
import { ReactElement } from 'react'

export type MenuItemObjectType = {
	onClick?: (e: React.MouseEvent<HTMLElement>) => void
	title: string | ReactElement
	subtitle?: string
	icon?: ReactElement
	disabled?: boolean
}

export default function MenuItem(item: MenuItemObjectType) {
	return (
		<MIt onClick={item.onClick} disabled={item.disabled}>
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

import {
	ListItemIcon,
	ListItemText,
	MenuItem,
	Menu as MuiMenu,
} from '@mui/material'
import { ComponentProps, ReactElement, ReactNode } from 'react'

type MenuItemObjectType = {
	onClick?: (e: React.MouseEvent<HTMLElement>) => void
	title: string
	subtitle?: string
	icon?: ReactElement
}

type MenuProps = {
	open: boolean
	onClose: () => void
	anchor: HTMLElement | null
	anchorOrigin?: ComponentProps<typeof MuiMenu>['anchorOrigin']
	transformOrigin?: ComponentProps<typeof MuiMenu>['transformOrigin']

	items?: MenuItemObjectType[]
	children?: ReactNode[]
}

export default function Menu({ ...props }: MenuProps) {
	const onClose = () => {
		props.onClose?.()
	}

	return (
		<MuiMenu
			anchorEl={props.anchor}
			open={props.open}
			onClose={onClose}
			anchorOrigin={{
				vertical: 'bottom',
				horizontal: 'left',
				...props.anchorOrigin,
			}}
			transformOrigin={{
				vertical: 'top',
				horizontal: 'left',
				...props.transformOrigin,
			}}
			MenuListProps={{
				'aria-labelledby': 'basic-button',
			}}
		>
			{props.children}
			{props.items?.map((item, index) => {
				return (
					<MenuItem key={item.title} onClick={item.onClick}>
						{item.icon && (
							<ListItemIcon>
								{/* <MoreHoriz fontSize="small" /> */}

								{/* // set size to icon ... {item.icon} */}

								{item.icon}
							</ListItemIcon>
						)}
						<ListItemText secondary={item.subtitle}>{item.title}</ListItemText>
					</MenuItem>
				)
			})}
		</MuiMenu>
	)
}

import MenuItem, { MenuItemObjectType } from '@/common/components/Menu/MenuItem'
import { Menu as MuiMenu } from '@mui/material'
import { ComponentProps, ReactNode } from 'react'

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
				return <MenuItem key={index} {...item} />
			})}
		</MuiMenu>
	)
}

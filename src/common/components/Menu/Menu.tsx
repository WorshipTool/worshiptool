import MenuItem, { MenuItemObjectType } from '@/common/components/Menu/MenuItem'
import { Menu as MuiMenu } from '@/common/ui/mui'
import { ComponentProps, ReactNode } from 'react'

type MenuProps = {
	open: boolean
	onClose: () => void
	anchor: Element | null
	anchorOrigin?: ComponentProps<typeof MuiMenu>['anchorOrigin']
	transformOrigin?: ComponentProps<typeof MuiMenu>['transformOrigin']

	items?: MenuItemObjectType[]
	children?: ReactNode
	id?: string

	keepMounted?: boolean
}

export default function Menu({ ...props }: MenuProps) {
	const onClose = () => {
		props.onClose?.()
	}

	return (
		<MuiMenu
			id={props.id}
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
			disablePortal
			disableScrollLock
			keepMounted={props.keepMounted}
		>
			{props.children}
			{props.items?.map((item, index) => {
				return (
					<MenuItem
						key={index}
						{...item}
						onClick={async (e) => {
							const r = await item.onClick?.(e)
							if (r !== false) onClose()
						}}
					/>
				)
			})}
		</MuiMenu>
	)
}

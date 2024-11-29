import { CommonLinkProps, Link } from '@/common/ui/Link/Link'
import {
	ListItemIcon,
	ListItemText,
	MenuItem as MIt,
	SxProps,
} from '@/common/ui/mui'
import { RoutesKeys } from '@/routes'
import { ReactElement } from 'react'

type LinkProps = CommonLinkProps<RoutesKeys>

export type MenuItemObjectType = {
	onClick?: (e: React.MouseEvent<HTMLElement>) => any
	title: string | ReactElement
	subtitle?: string
	icon?: ReactElement
	disabled?: boolean
	selected?: boolean
	hidden?: boolean
	to?: LinkProps['to']
	toParams?: LinkProps['params']
	sx?: SxProps
}

export default function MenuItem(item: MenuItemObjectType) {
	const LinkEnvelope = (props: { children: React.ReactNode }) => {
		return item.to && item.toParams ? (
			<Link to={item.to} params={item.toParams} disabled={!item.to}>
				{props.children}
			</Link>
		) : (
			<>{props.children}</>
		)
	}

	return item.hidden ? null : (
		<LinkEnvelope>
			<MIt
				onClick={item.onClick}
				disabled={item.disabled}
				selected={item.selected}
				sx={item.sx}
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
		</LinkEnvelope>
	)
}

import { SxProps } from '@mui/material'
import { useMemo } from 'react'
import useAuth from '../../../../../../hooks/auth/useAuth'
import { RoutesKeys } from '../../../../../../routes'
import { useSmartNavigate } from '../../../../../../routes/useSmartNavigate'
import { isDevelopment } from '../../../../../../tech/development.tech'
import { isMobile, isTablet } from '../../../../../../tech/device.tech'
import { LinkProps } from '../../../../../ui/Link/CustomLink'

export type MenuItemProps<T extends RoutesKeys> = {
	title: string
	image: string
	action?: () => void
	to?: LinkProps<T>['to']
	toParams?: LinkProps<T>['params']
	disabled?: boolean
	hidden?: boolean
	sx?: SxProps
}

export const searchGroupsEvent = new Event('searchGroups')

export default function useToolsMenuItems() {
	const navigate = useSmartNavigate()

	const { isAdmin, isLoggedIn } = useAuth()

	const items: MenuItemProps<any>[] = useMemo(() => {
		return [
			{
				title: 'Playlisty',
				image: 'https://cdn-icons-png.flaticon.com/512/636/636224.png',
				to: 'usersPlaylists',
				disabled: isMobile && !isTablet,
			},
			{
				title: 'Moje',
				image: 'https://cdn-icons-png.flaticon.com/512/10627/10627120.png',
				to: 'usersSongs',
				disabled: isMobile && !isTablet,
			},

			{
				title: '13ka',
				image: '/assets/13ka-icon.png',
				to: 'group',
				toParams: { groupCode: '13ka' },
				disabled: isMobile && !isTablet,
			},
			{
				title: 'Hledat skupinu',
				image: 'https://static.thenounproject.com/png/79376-200.png',
				action: () => {
					dispatchEvent(searchGroupsEvent)
				},
				sx: {
					filter: 'invert(1) brightness(0.1)',
				},
				disabled: isMobile && !isTablet,
			},
			...(isDevelopment
				? [
						{
							title: 'Test',
							image: 'https://cdn-icons-png.flaticon.com/512/5334/5334823.png',
							to: 'test',
							hidden: !isAdmin(),
						},
						{
							title: 'Components',
							image:
								'https://icons.veryicon.com/png/o/miscellaneous/tymon/basic-components.png',
							to: 'testComponents',
							hidden: !isAdmin(),
						},
				  ]
				: []),
		]
	}, [isAdmin, isLoggedIn])

	return {
		items,
	}
}

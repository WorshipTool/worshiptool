import { LinkProps } from '@/common/ui/Link/Link'
import useAuth from '@/hooks/auth/useAuth'
import { RoutesKeys } from '@/routes'
import { useSmartNavigate } from '@/routes/useSmartNavigate'
import { isDevelopment } from '@/tech/development.tech'
import { SxProps } from '@mui/material'
import { useMemo } from 'react'
import useUserTeams from '../../../../../../../app/(submodules)/(teams)/sub/tymy/hooks/useUserTeams'

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

	const { teams } = useUserTeams()

	const teamsItems: MenuItemProps<any>[] = useMemo(() => {
		if (!teams) return []
		return teams.map((team) => ({
			title: team.name,
			image:
				'https://cdn0.iconfinder.com/data/icons/social-media-glyph-1/64/Facebook_Social_Media_User_Interface-38-512.png',
			to: 'team',
			toParams: {
				alias: team.alias,
			},
		}))
	}, [teams])

	const items: MenuItemProps<any>[] = useMemo(() => {
		return [
			{
				title: 'Playlisty',
				image: 'https://cdn-icons-png.flaticon.com/512/636/636224.png',
				to: 'usersPlaylists',
			},
			{
				title: 'Moje písně',
				image: 'https://cdn-icons-png.flaticon.com/512/10627/10627120.png',
				to: 'usersSongs',
			},

			// {
			// 	title: '13ka',
			// 	image: '/assets/13ka-icon.png',
			// 	to: 'group',
			// 	toParams: { groupCode: '13ka' },
			// },
			{
				title: 'Hledat tým',
				image: 'https://static.thenounproject.com/png/79376-200.png',
				action: () => {
					dispatchEvent(searchGroupsEvent)
				},
				sx: {
					filter: 'invert(1) brightness(0.1)',
				},
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
			...teamsItems,
		]
	}, [isAdmin, isLoggedIn, teamsItems])

	return {
		items,
	}
}

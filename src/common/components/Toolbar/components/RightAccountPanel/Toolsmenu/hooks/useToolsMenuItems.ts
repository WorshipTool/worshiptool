import { BACKEND_URL } from '@/api/constants'
import { ImagesApiAxiosParamCreator } from '@/api/generated'
import { LinkProps } from '@/common/ui/Link/Link'
import { SxProps } from '@/common/ui/mui'
import useAuth from '@/hooks/auth/useAuth'
import { RoutesKeys } from '@/routes'
import { useSmartNavigate } from '@/routes/useSmartNavigate'
import { isDevelopment } from '@/tech/development.tech'
import { getIconUrl } from '@/tech/paths.tech'
import { useMemo } from 'react'
import useUserTeams from '../../../../../../../app/(submodules)/(teams)/sub/tymy/hooks/useUserTeams'

export type MenuItemProps<T extends RoutesKeys> = {
	title: string
	image: string
	asyncImage?: () => Promise<string>
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

	const imagesApi = ImagesApiAxiosParamCreator({
		isJsonMime: () => true,
	})

	const teamsItems: MenuItemProps<any>[] = useMemo(() => {
		if (!teams) return []
		return teams.map((team) => {
			const hasLogo = team.logoGuid !== null

			return {
				title: team.name,
				image: getIconUrl('team-default.webp'),
				asyncImage: hasLogo
					? async () => {
							const url =
								BACKEND_URL +
								(await imagesApi.imagesControllerGetImage(team.logoGuid!)).url
							return url
					  }
					: undefined,
				to: 'team',
				toParams: {
					alias: team.alias,
				},
			}
		})
	}, [teams])

	const items: MenuItemProps<any>[] = useMemo(() => {
		return [
			{
				title: 'Playlisty',
				image: getIconUrl('playlists.png'),
				to: 'usersPlaylists',
			},
			{
				title: 'Moje písně',
				image: getIconUrl('users_song_list.png'),
				to: 'usersSongs',
			},

			// {
			// 	title: '13ka',
			// 	image: '/assets/13ka-icon.png',
			// 	to: 'group',
			// 	toParams: { groupCode: '13ka' },
			// },
			// {
			// 	title: 'Hledat tým',
			// 	image: 'https://static.thenounproject.com/png/79376-200.png',
			// 	action: () => {
			// 		dispatchEvent(searchGroupsEvent)
			// 	},
			// 	sx: {
			// 		filter: 'invert(1) brightness(0.1)',
			// 	},
			// },
			...(isDevelopment
				? [
						{
							title: 'Test',
							image: getIconUrl('test.png'),
							to: 'test',
							hidden: !isAdmin(),
						},
						{
							title: 'Components',
							image: getIconUrl('components.png'),
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

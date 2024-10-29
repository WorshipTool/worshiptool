import useInnerTeam from '@/app/(submodules)/(teams)/sub/tymy/hooks/useInnerTeam'
import { useUsersPlaylists } from '@/hooks/playlist/useUsersPlaylists'
import { useMemo } from 'react'

export default function useUsersTeamPlaylists() {
	const { guid: teamGuid } = useInnerTeam()
	const { playlists: allUsersPlaylists, ...d } = useUsersPlaylists()

	const playlists = useMemo(() => {
		return (
			allUsersPlaylists?.filter((p, i) => {
				return p.teamGuid === teamGuid
			}) || []
		)
	}, [allUsersPlaylists])
	return {
		...d,
		playlists,
	}
}

'use client'
import { Add, Edit, PushPin, Search } from '@mui/icons-material'
import { Box } from '@mui/material'
import { useState } from 'react'
import useGroup from '../../../../hooks/group/useGroup'
import useCurrentPlaylist from '../../../../hooks/playlist/useCurrentPlaylist'
import usePlaylists from '../../../../hooks/playlist/usePlaylists'
import { useSmartNavigate } from '../../../../routes/useSmartNavigate'
import { useApiStateEffect } from '../../../../tech/ApiState'
import GroupToolbarActionButton from './GroupToolbarActionButton'

interface QuickActionsProps {
	visible?: boolean
}

export default function QuickActions({ visible }: QuickActionsProps) {
	const { createPlaylist, getPlaylistByGuid } = usePlaylists()
	const { turnOn, isOn, guid, playlist } = useCurrentPlaylist()

	const navigate = useSmartNavigate()

	const { guid: groupGuid, payload } = useGroup()

	const pinnedPlaylistGuid = payload?.pinnedPlaylist
	const [pinnedState] = useApiStateEffect(async () => {
		if (!pinnedPlaylistGuid) return
		return await getPlaylistByGuid(pinnedPlaylistGuid)
	}, [pinnedPlaylistGuid])

	const [createSongLoading, setCreateSongLoading] = useState(false)
	const [createPlaylistLoading, setCreatePlaylistLoading] = useState(false)

	const onCreatePlaylist = () => {
		setCreatePlaylistLoading(true)
		createPlaylist().then((r) => {
			const guid = r.guid
			turnOn(guid)
			navigate('playlist', {
				guid,
			})
			setCreatePlaylistLoading(false)
		})
	}

	const onSearchSong = () => {
		window.dispatchEvent(new Event('searchBarFocus'))
	}

	return (
		<Box>
			<Box display={'flex'} flexDirection={'row'} gap={1}>
				<GroupToolbarActionButton
					label="Vytvořit playlist"
					variant="primary"
					icon={
						<Add
							sx={{
								strokeWidth: 2,
							}}
						/>
					}
					onClick={onCreatePlaylist}
					visible={visible}
					id={0}
					loading={createPlaylistLoading}
				/>
				<GroupToolbarActionButton
					label="Vyhledat píseň"
					icon={
						<Search
							sx={{
								strokeWidth: 1,
							}}
						/>
					}
					onClick={onSearchSong}
					visible={visible}
					id={1}
				/>
				{/* <GroupToolbarActionButton
                    label="Vytvořit novou píseň"
                    icon={
                        <Add
                            sx={{
                                strokeWidth: 2
                            }}
                        />
                    }
                    onClick={onNewSong}
                    visible={visible}
                    id={2}
                    loading={createSongLoading}
                /> */}
				{pinnedState.data && (
					<>
						<GroupToolbarActionButton
							label={pinnedState.data?.title}
							secondaryLabel="Připnuté"
							variant="secondary"
							icon={<PushPin />}
							to={'playlist'}
							toParams={{
								guid: pinnedState.data.guid,
							}}
							visible={visible}
							id={4}
						/>
					</>
				)}
				{isOn ? (
					<GroupToolbarActionButton
						label="Editovat playlist"
						secondaryLabel={playlist?.title}
						variant="secondary"
						icon={<Edit></Edit>}
						to="playlist"
						toParams={{ guid }}
						visible={visible}
						id={3}
					/>
				) : (
					<></>
				)}
			</Box>
		</Box>
	)
}

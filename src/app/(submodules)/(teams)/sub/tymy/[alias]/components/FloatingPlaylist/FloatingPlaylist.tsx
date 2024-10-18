'use client'
import useInnerTeam from '@/app/(submodules)/(teams)/sub/tymy/hooks/useInnerTeam'
import { Typography } from '@/common/ui/Typography'
import { useChangeDelayer } from '@/hooks/changedelay/useChangeDelayer'
import SongDropContainer from '@/hooks/dragsong/SongDropContainer'
import useSongDrag from '@/hooks/dragsong/useSongDrag'
import useCurrentPlaylist from '@/hooks/playlist/useCurrentPlaylist'
import { useSmartNavigate } from '@/routes/useSmartNavigate'
import { Check, OpenInNew, PlaylistAdd } from '@mui/icons-material'
import { Box } from '@mui/material'
import { useCallback, useEffect, useMemo, useState } from 'react'

export default function FloatingPlaylist() {
	const { isDragging } = useSongDrag()

	const [afterDropped, setAfterDropped] = useState(false)

	const [dropped, setDropped] = useState(false)

	const {
		isOn,
		title,
		addPacks,
		guid: playlistGuid,
		playlist,
	} = useCurrentPlaylist()

	const { alias } = useInnerTeam()

	const [isMouseOver, setIsOver] = useState(false)

	useChangeDelayer(
		dropped,
		() => {
			setDropped(false)
		},
		[],
		1700
	)

	useEffect(() => {
		if (dropped) setAfterDropped(true)
	}, [dropped])

	useChangeDelayer(
		dropped,
		(v) => {
			if (!v) setAfterDropped(v)
		},
		[]
	)

	const navigate = useSmartNavigate()
	const openPlaylist = useCallback(() => {
		navigate('teamPlaylist', {
			alias,
			guid: playlistGuid,
		})
	}, [])

	const width = useMemo(() => {
		return Math.max(200, 100 + (title?.length || 0) * 8)
	}, [title])

	return !isOn ||
		!playlist?.teamAlias ||
		playlist.teamAlias !== alias ? null : (
		<SongDropContainer
			onDrop={(song) => {
				addPacks([song.packGuid])
				setDropped(true)
			}}
		>
			{(over) => {
				return (
					<Box
						sx={{
							padding: '1rem',
							position: 'fixed',
							bottom: isDragging || dropped || isMouseOver ? 16 : -100,
							// bottom: 0,
							right: '50%',
							transform: `translateX(50%) scale(${over ? 1.05 : 1})`,
							transition: 'all 0.3s',

							borderRadius: 4,
							display: 'flex',
							flexDirection: 'row',
							alignItems: 'center',
							justifyContent: 'center',
							gap: 1,
							userSelect: 'none',
							cursor: 'pointer',

							// borderColor: 'grey.900',
							// borderStyle: 'solid',
							// borderWidth: afterDropped ? 2 : 0,
							// borderBottomWidth: 0,

							boxShadow: '0px 2px 10px 0px rgba(0,0,0,0.1)',

							bgcolor: over ? 'secondary.dark' : 'secondary.main',
							width,
						}}
						onMouseEnter={() => setIsOver(true)}
						onMouseLeave={() => setIsOver(false)}
						onClick={openPlaylist}
					>
						{!afterDropped || over ? (
							isMouseOver ? (
								<>
									<OpenInNew />
									<Box display={'flex'} flexDirection={'row'} gap={0.5}>
										<Typography strong noWrap>
											Otevřít
										</Typography>
									</Box>
								</>
							) : (
								<>
									<PlaylistAdd />
									<Box display={'flex'} flexDirection={'row'} gap={0.5}>
										<Typography strong noWrap>
											Přidat do
										</Typography>
										<Typography noWrap>{title}</Typography>
									</Box>
								</>
							)
						) : (
							<>
								<Check fontSize="small" />
								<Typography>Píseň byla přidána</Typography>
							</>
						)}
					</Box>
				)
			}}
		</SongDropContainer>
	)
}

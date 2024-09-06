'use client'
import useInnerPlaylist from '@/app/(layout)/playlist/[guid]/hooks/useInnerPlaylist'
import { Typography } from '@/common/ui/Typography'
import SongDropContainer from '@/hooks/dragsong/SongDropContainer'
import { DragSongDto } from '@/hooks/dragsong/tech'
import { Box } from '@mui/material'
import React, { useCallback } from 'react'

type SongDropPlaylistContainerProps = {
	children: React.ReactNode
}

export default function SongDropPlaylistContainer(
	props: SongDropPlaylistContainerProps
) {
	const { addItem } = useInnerPlaylist()

	const onDrop = useCallback(
		(song: DragSongDto, e: React.DragEvent<HTMLDivElement>) => {
			addItem(song.packGuid)
		},
		[addItem]
	)

	return (
		<SongDropContainer onDrop={onDrop}>
			{(isOver) => (
				<>
					{props.children}

					<Box
						sx={{
							position: 'fixed',
							left: 0,
							right: 0,
							bottom: 0,
							top: 0,
							bgcolor: 'rgba(0,0,0,0.5)',
							display: isOver ? 'flex' : 'none',
							justifyContent: 'center',
							alignItems: 'center',
						}}
					>
						<Typography variant="h6" color="grey.100">
							Pro přidání písně přetáhněte sem
						</Typography>
					</Box>
				</>
			)}
		</SongDropContainer>
	)
}

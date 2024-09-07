'use client'
import useInnerPlaylist from '@/app/(layout)/playlist/[guid]/hooks/useInnerPlaylist'
import PopupContainer from '@/common/components/Popup/PopupContainer'
import { Typography } from '@/common/ui/Typography'
import SongDropContainer from '@/hooks/dragsong/SongDropContainer'
import { DragSongDto } from '@/hooks/dragsong/tech'
import { PlaylistAdd } from '@mui/icons-material'
import { Box } from '@mui/material'
import { AnimatePresence, motion } from 'framer-motion'
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

					<AnimatePresence>
						{isOver && (
							<PopupContainer>
								<motion.div
									initial={{
										opacity: 0,
									}}
									animate={{
										opacity: 1,
									}}
									exit={{
										opacity: 0,
									}}
									transition={{
										duration: 0.2,
									}}
								>
									<Box
										sx={{
											position: 'absolute',
											left: 0,
											right: 0,
											bottom: 0,
											top: 0,
											bgcolor: 'rgba(0,0,0,0.7)',
											display: 'flex',
											flexDirection: 'column',
											justifyContent: 'center',
											alignItems: 'center',
										}}
									>
										<Box
											color="white"
											display={'flex'}
											flexDirection={'column'}
											justifyContent={'center'}
											alignItems={'center'}
											sx={{
												// border: '2px solid',
												// borderColor: 'grey.900',
												padding: 5,
												borderRadius: 2,
												// bgcolor: alpha(grey[100], 1),
											}}
										>
											<Box fontSize={'3rem'}>
												<PlaylistAdd fontSize="inherit" color="inherit" />
											</Box>
											<Typography variant="h4" strong={100}>
												Pro přidání písně
											</Typography>
											<Typography variant="h4" strong>
												přetáhněte sem
											</Typography>
										</Box>
									</Box>
								</motion.div>
							</PopupContainer>
						)}
					</AnimatePresence>
				</>
			)}
		</SongDropContainer>
	)
}

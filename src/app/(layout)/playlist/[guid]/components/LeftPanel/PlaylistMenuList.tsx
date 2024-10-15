'use client'
import { OPEN_PLAYLIST_ADD_SONG_POPUP_EVENT_NAME } from '@/app/(layout)/playlist/[guid]/components/LeftPanel/AddSongToPlaylistButton'
import PanelItem from '@/app/(layout)/playlist/[guid]/components/LeftPanel/PanelItem'
import useInnerPlaylist from '@/app/(layout)/playlist/[guid]/hooks/useInnerPlaylist'
import { Button } from '@/common/ui/Button'
import { Gap } from '@/common/ui/Gap'
import { Typography } from '@/common/ui/Typography'
import { PlaylistItemGuid } from '@/interfaces/playlist/playlist.types'
import { Add } from '@mui/icons-material'
import { Box } from '@mui/material'
import { Reorder } from 'framer-motion'
import { useCallback, useEffect, useRef, useState } from 'react'

type PlaylistMenuListProps = {}

export default function PlaylistMenuList(props: PlaylistMenuListProps) {
	const { items, loading, setItems, canUserEdit } = useInnerPlaylist()

	const [innerGuids, setInnerGuids] = useState<PlaylistItemGuid[]>(
		items?.map((i) => i.guid) || []
	)

	const startReordering = useRef(false)

	useEffect(() => {
		if (items) {
			setInnerGuids(items.map((i) => i.guid))
		}
	}, [items])

	useEffect(() => {
		const handleMouseUp = () => {
			if (startReordering.current) {
				const itemsCopy = [...items]
				const newItems = innerGuids.map((guid, i) => {
					const rawItem = itemsCopy.find((i) => i.guid === guid)!
					const item = { ...rawItem }

					item.order = i

					return item
				})
				setItems(newItems)

				startReordering.current = false
			}
		}

		document.addEventListener('mouseup', handleMouseUp)

		return () => {
			document.removeEventListener('mouseup', handleMouseUp)
		}
	}, [innerGuids, items, setItems, startReordering])

	const onReorder = (values: PlaylistItemGuid[]) => {
		setInnerGuids(values)
		startReordering.current = true
	}

	const openSelectSongPopup = useCallback(() => {
		const event = new CustomEvent(OPEN_PLAYLIST_ADD_SONG_POPUP_EVENT_NAME)
		document.dispatchEvent(event)
	}, [])

	return (
		<>
			{loading || !items ? (
				<>
					<Typography>Načítání...</Typography>
				</>
			) : (
				<>
					{items.length === 0 && (
						<>
							<Gap />
							<Typography color="grey.500" align="center">
								V playlistu nejsou žádné písně...
							</Typography>
							<Gap value={1} />
							{/* {<Box
								display={'flex'}
								flexDirection={'row'}
								justifyContent={'center'}
							>
								<Button
									startIcon={<Add />}
									size="small"
									variant="outlined"
									color="grey.800"
									onClick={openSelectSongPopup}
								>
									Přidat píseň
								</Button>
							</Box> } */}
						</>
					)}
					{canUserEdit ? (
						<>
							{items.length > 0 && (
								<Reorder.Group
									values={innerGuids}
									onReorder={(values) => onReorder(values)}
									axis="y"
									style={{
										padding: 0,
										position: 'relative',
										width: '100%',
										gap: '8px',
										display: 'flex',
										flexDirection: 'column',
									}}
								>
									{innerGuids?.map((item, index) => {
										return (
											<Reorder.Item
												key={item}
												value={item}
												as="div"
												style={{
													paddingLeft: 5,
													paddingRight: 5,
												}}
											>
												<PanelItem
													itemGuid={item}
													key={item}
													itemIndex={index}
												/>
											</Reorder.Item>
										)
									})}
								</Reorder.Group>
							)}

							{
								<Box
									display={'flex'}
									flexDirection={'row'}
									justifyContent={'center'}
								>
									<Button
										startIcon={<Add />}
										size="small"
										variant="text"
										color={items.length === 0 ? 'grey.800' : 'grey.500'}
										onClick={openSelectSongPopup}
										sx={{
											paddingX: 1,
										}}
									>
										Přidat píseň
									</Button>
								</Box>
							}
						</>
					) : (
						<Box
							sx={{
								padding: 0,
								paddingTop: 1,
								position: 'relative',
								width: '100%',
								gap: '8px',
								display: 'flex',
								flexDirection: 'column',
							}}
						>
							{innerGuids?.map((item, index) => {
								return (
									<Box
										key={item}
										sx={{
											paddingX: 0.5,
										}}
									>
										<PanelItem itemGuid={item} key={item} itemIndex={index} />
									</Box>
								)
							})}
						</Box>
					)}
					{/* <Box
						display={'flex'}
						justifyContent={'center'}
						alignItems={'center'}
						gap={0.5}
						color={'grey.600'}
					>
						<Add
							fontSize="inherit"
							sx={{
								fontSize: '1rem',
							}}
						/>
						<Typography size={'small'} strong>
							Přidat píseň
						</Typography>
					</Box> */}
				</>
			)}
		</>
	)
}

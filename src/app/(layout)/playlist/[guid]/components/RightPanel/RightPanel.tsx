import { Box, Typography, styled, useTheme } from '@mui/material'
import { useMemo, useState } from 'react'
import SongSearch from '../../../../../../common/components/songLists/SongSearch/SongSearch'
import { Gap } from '../../../../../../common/ui/Gap/Gap'
import SearchBar from '../../../../../../common/ui/SearchBar/SearchBar'
import useGroup from '../../../../../../hooks/group/useGroup'
import useGroupSelection from '../../../../../../hooks/group/useGroupSelection'
import Playlist from '../../../../../../interfaces/playlist/playlist.types'
import { isMobile } from '../../../../../../tech/device.tech'
import useRecommendedSongs from '../../../../../components/components/RecommendedSongsList/hooks/useRecommendedSongs'
import useInnerPlaylist from '../../hooks/useInnerPlaylist'
import PlaylistSearchList from './PlaylistSearchList'

const Container = styled(Box)(({ theme }) => ({
	width: 300,
	// position:"relative",
	height: 'calc(100vh - 56px)',
	// top:56,
	overflowY: 'auto',
	boxShadow: `0px 0px 3px ${theme.palette.grey[400]}`,
	displayPrint: 'none',
	userSelect: 'none',
	pointerEvents: 'auto',

	position: 'sticky',
	top: 56,
}))

interface RightPanelProps {}
export default function RightPanel({}: RightPanelProps) {
	const theme = useTheme()
	const [searchString, setSearchString] = useState('')
	const { data } = useRecommendedSongs()
	const { isOn } = useGroup()
	const { items: selectionItems } = useGroupSelection()
	const { items, playlist } = useInnerPlaylist()

	const ideaArr = useMemo(() => {
		return (
			isOn
				? selectionItems
						.filter((s) => !items.map((v) => v.guid).includes(s.guid))
						.map((v) => v.variant)
				: data.filter((s) => !items.map((v) => v.variant.guid).includes(s.guid))
		).filter((v) => playlist?.items.every((s) => s.variant.guid != v.guid))
	}, [data, selectionItems, isOn, items, playlist])

	const idea = useMemo(() => {
		const arr = ideaArr
		if (arr.length == 0) return ''
		const index = Math.floor(Math.random() * arr.length)
		return arr[index]?.preferredTitle
	}, [ideaArr])
	return isMobile ? (
		<></>
	) : (
		<>
			<Container>
				<Box padding={1} paddingTop={0}>
					<Box
						position={'sticky'}
						top={0}
						paddingTop={1}
						sx={{
							// backdropFilter: "blur(20px)",
							zIndex: 1,
						}}
					>
						<SearchBar onChange={(v) => setSearchString(v)} />
					</Box>
					<Gap />
					<SongSearch
						searchString={searchString}
						component={(v, searchString) => {
							const filtered = v.filter((v) => {
								return !items.find((s) => s.variant.guid == v.guid)
							})
							if (filtered.length == 0)
								return (
									<>
										{searchString !== '' ? (
											<>
												<Typography>Nic jsme nenašli...</Typography>
												<Gap />
												<Gap />
											</>
										) : (
											<></>
										)}
										<Typography fontWeight={900}>Nějaké návrhy:</Typography>
										<Gap value={0.5} />
										<PlaylistSearchList
											variants={ideaArr}
											playlist={playlist as Playlist}
										/>
									</>
								)
							return (
								<PlaylistSearchList
									variants={filtered}
									playlist={playlist as Playlist}
								/>
							)
						}}
					/>

					{idea != '' ? (
						<>
							<Typography fontWeight={500}>Nemáte nápad? </Typography>
							<Typography>
								Zkuste třeba: <i>{idea}</i>
							</Typography>
						</>
					) : (
						<>
							<Typography>O-ou, došli nám nápady</Typography>
						</>
					)}
				</Box>
			</Container>
			<Box width={300} displayPrint={'none'}></Box>
		</>
	)
}

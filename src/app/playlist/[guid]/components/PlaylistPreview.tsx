import {
	Box,
	Button,
	LinearProgress,
	Skeleton,
	Typography,
	styled,
} from '@mui/material'
import { useMemo } from 'react'
import { Gap } from '../../../../common/ui/Gap'
import useAuth from '../../../../hooks/auth/useAuth'
import useInnerPlaylist from '../hooks/useInnerPlaylist'
import SidePanel from './LeftPanel/SidePanel'
import { PlaylistItem } from './PlaylistItem'
import RightPanel from './RightPanel/RightPanel'

const Container = styled(Box)(({ theme }) => ({
	padding: 30,
}))

export default function PlaylistPreview() {
	const { playlist, items, guid, loading } = useInnerPlaylist()
	const { isLoggedIn, user } = useAuth()

	const isOwner = useMemo(() => {
		if (!playlist || !user) return false
		if (!isLoggedIn()) return false
		// return true;
		return playlist.ownerGuid === user.guid
	}, [playlist, user])

	const onSearchClick = () => {
		window.dispatchEvent(new Event('searchBarFocus'))
	}

	return (
		<>
			<Box display={'flex'} flexDirection={'row'}>
				<SidePanel />

				{loading ? (
					<Box
						sx={{
							width: '100%',
							height: '100%',
							display: 'flex',
							flexDirection: 'column',
							justifyContent: 'center',
							alignItems: 'center',
							padding: 4,
							gap: 2,
						}}
					>
						<LinearProgress sx={{ width: '100%' }} color="inherit" />

						<Skeleton
							variant="rectangular"
							width="100%"
							height={300}
							sx={{
								borderRadius: 1,
							}}
						/>
						<Skeleton
							variant="rectangular"
							width="100%"
							height={300}
							sx={{
								borderRadius: 1,
							}}
						/>
					</Box>
				) : (
					<>
						{
							<Container flex={1}>
								{items.length == 0 && (
									<Box display={'flex'} flexDirection={'column'}>
										<Typography variant="subtitle1">
											V playlistu namáš zatím jedinou píseň.
										</Typography>
										<Typography variant="subtitle1">
											Aby jsi mohl přidat píseň do playlistu, je třeba nejdřív
											nějakou najít...
										</Typography>
										<Gap />
										<Box>
											<Button
												variant="contained"
												color="primary"
												onClick={onSearchClick}
											>
												Hledat
											</Button>
										</Box>
									</Box>
								)}
								{items.map((item) => {
									return <PlaylistItem item={item} key={item.guid} />
								})}
							</Container>
						}

						{isOwner && (
							<Box
								displayPrint={'none'}
								display={{
									md: 'none',
									lg: 'block',
								}}
							>
								<RightPanel playlist={playlist} />
							</Box>
						)}
					</>
				)}
			</Box>
		</>
	)
}

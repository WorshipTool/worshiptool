import { Typography as Tp } from '@/ui/Typography'
import { Info, Print } from '@mui/icons-material'
import {
	Box,
	LinearProgress,
	Skeleton,
	Typography,
	styled,
} from '@mui/material'
import { useMemo } from 'react'
import { Button } from '../../../../../common/ui/Button'
import Card from '../../../../../common/ui/Card/Card'
import { Gap } from '../../../../../common/ui/Gap'
import { IconButton } from '../../../../../common/ui/IconButton'
import useAuth from '../../../../../hooks/auth/useAuth'
import { isMobile } from '../../../../../tech/device.tech'
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
							<Box
								flex={1}
								padding={{
									xs: 2,
									md: 2,
									lg: 4,
								}}
							>
								<Box
									display={{
										xs: 'block',
										sm: 'none',
										lg: 'none',
									}}
								>
									<Box
										display={'flex'}
										flexDirection={'row'}
										justifyContent={'space-between'}
										alignItems={'center'}
										gap={1}
										flexWrap={'wrap'}
									>
										<Box>
											<Tp>Název playlistu</Tp>
											<Tp variant="h5" strong>
												{playlist?.title}
											</Tp>
										</Box>
										<Box display={'flex'} flexDirection={'row'} gap={1}>
											{items.length > 0 && (
												<Button
													variant="outlined"
													to="playlistCards"
													toParams={{ guid: playlist?.guid || '' }}
													color={'inherit'}
												>
													Prezentace
												</Button>
											)}
											<IconButton
												onClick={() => window.print()}
												sx={{ pointerEvents: 'auto', flex: 1 }}
												color="inherit"
											>
												<Print />
											</IconButton>
										</Box>
									</Box>
									<Gap />
									{isMobile ? (
										<>
											<Card
												title="Playlist nelze na telefonu editovat. Pro editaci použij
                                            prosím počítač."
												icon={<Info />}
											></Card>
											<Gap />
										</>
									) : (
										<Box>
											<Card
												title="Abys mohl playlist upravovat, zvětši prosím okno prohlížeče."
												icon={<Info />}
											></Card>
											<Gap />
										</Box>
									)}
								</Box>

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
							</Box>
						}

						{isOwner && (
							<Box
								displayPrint={'none'}
								display={{
									xs: 'none',
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

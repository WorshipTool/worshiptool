import { Box, Typography } from '@/common/ui'
import { styled } from '@/common/ui/mui'
import useCurrentPlaylist from '../../../../../hooks/playlist/useCurrentPlaylist'
import usePlaylistsGeneral from '../../../../../hooks/playlist/usePlaylistsGeneral'
import { useSmartNavigate } from '../../../../../routes/useSmartNavigate'

const Container = styled(Box)(({ theme }) => ({
	background: `linear-gradient(2800deg, ${theme.palette.primary.main}, ${theme.palette.primary.dark})`,
	height: 80,
	borderRadius: 10,
	color: 'white',
	display: 'flex',
	alignItems: 'center',
	justifyContent: 'center',
	boxShadow: `0px 4px 4px #00000040`,
	transition: 'all ease 0.2s',
	'&:hover': {
		boxShadow: '0px 0px 4px #00000040',
		filter: 'brightness(90%)',
		transform: 'scale(101%)',
	},
}))

export default function CreatePlaylistButton() {
	const { createPlaylist } = usePlaylistsGeneral()
	const { turnOn } = useCurrentPlaylist()

	const navigate = useSmartNavigate()

	const onClick = () => {
		createPlaylist().then((guid) => {
			turnOn(guid)
			navigate('playlist', { guid })
		})
	}
	return (
		<Container onClick={onClick}>
			<Typography variant="h6" strong={900} sx={{ userSelect: 'none' }}>
				Vytvořit playlist
			</Typography>
		</Container>
	)
}

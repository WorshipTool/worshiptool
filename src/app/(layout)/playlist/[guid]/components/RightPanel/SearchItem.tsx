import { LoadingButton } from '@mui/lab'
import {
	Box,
	Divider,
	Skeleton,
	Typography,
	styled,
	useTheme,
} from '@mui/material'
import { Sheet } from '@pepavlin/sheet-api'
import { useState } from 'react'
import { SongVariantDto } from '../../../../../../api/dtos'
import { Button } from '../../../../../../common/ui/Button'
import { Link } from '../../../../../../common/ui/Link/CustomLink'
import useAuth from '../../../../../../hooks/auth/useAuth'
import useCurrentPlaylist from '../../../../../../hooks/playlist/useCurrentPlaylist'
import Playlist from '../../../../../../interfaces/playlist/PlaylistDTO'
import { parseVariantAlias } from '../../../../../../routes'
import { useSmartNavigate } from '../../../../../../routes/useSmartNavigate'
import { useApiState } from '../../../../../../tech/ApiState'
import useInnerPlaylist from '../../hooks/useInnerPlaylist'

const StyledContainer = styled(Box)(({ theme }) => ({
	backgroundColor: theme.palette.grey[100],

	borderRadius: '0.5rem',
	'&:hover': {
		backgroundColor: theme.palette.grey[200],
		boxShadow: `0px 0px 10px ${theme.palette.grey[400]}`,
	},
	cursor: 'pointer',
	borderWidth: 1.4,
	borderStyle: 'solid',
}))

const StyledBox = styled(Typography)(({ theme }) => ({
	maxWidth: 'calc(100vw - 3rem)',
	overflow: 'hidden',
}))

interface SearchItemProps {
	variant: SongVariantDto
	onClick?: (variant: SongVariantDto) => void
	playlist: Playlist
}
export default function SearchItem({
	variant,
	onClick: onClickCallback,
	playlist,
}: SearchItemProps) {
	const [bottomPanelOpen, setBottomPanelOpen] = useState(false)

	const { addVariant, reload, items } = useInnerPlaylist()

	const sheet = new Sheet(variant.sheetData)

	const {
		fetchApiState,
		apiState: { loading },
	} = useApiState()

	const { turnOn } = useCurrentPlaylist()
	const onSongClick = () => {
		onClickCallback?.(variant)
		setBottomPanelOpen(true)
	}

	const addToPlaylist = async () => {
		fetchApiState(
			async () => {
				return await addVariant(variant.packGuid)
			},
			() => {
				reload()
				turnOn(playlist.guid)
			}
		)
	}

	const navigate = useSmartNavigate()

	const { user } = useAuth()
	const theme = useTheme()

	const variantParams = {
		...parseVariantAlias(variant.alias),
		title: variant.preferredTitle,
	}

	return (
		<Link to="variant" params={variantParams} onlyWithShift>
			<Box>
				{false ? (
					<Box
						justifyContent={'center'}
						display={'flex'}
						flexDirection={'column'}
					>
						<Skeleton variant="text" width={'100%'}></Skeleton>
						{Array(2)
							.fill(1)
							.map((a, index) => {
								return (
									<Skeleton
										variant="text"
										width={Math.round(Math.random() * 80) + '%'}
										key={variant.guid + 's' + index}
									></Skeleton>
								)
							})}
					</Box>
				) : (
					<StyledContainer
						onClick={onSongClick}
						sx={{
							borderColor:
								variant.verified || variant.createdByLoader
									? 'transparent'
									: 'grey',
						}}
					>
						<Box padding={'1rem'}>
							{variant.createdBy == user?.guid && (
								<Typography variant="subtitle2">Vytvořeno vámi.</Typography>
							)}

							<Box display={'flex'}>
								<Typography fontWeight={'bold'} flex={1}>
									{variant.preferredTitle}
								</Typography>
								{!variant.verified ? (
									<>
										{variant.createdByLoader ? (
											<Typography variant="caption">
												Nahráno programem
											</Typography>
										) : (
											<>
												<Typography variant="caption">Neověřeno</Typography>
											</>
										)}
									</>
								) : (
									<></>
								)}
							</Box>

							<StyledBox>
								{sheet
									.getSections()[0]
									?.text?.split('\n')
									.slice(0, 4)
									.map((line, index) => {
										return (
											<Typography noWrap key={'SearchItemText' + line}>
												{line}
											</Typography>
										)
									})}
							</StyledBox>
						</Box>

						{bottomPanelOpen && (
							<Box display={'flex'} flexDirection={'column'}>
								<Divider />
								<Button
									variant="text"
									to="variant"
									toParams={variantParams}
									sx={{
										width: '100%',
									}}
								>
									Otevřít
								</Button>
								<LoadingButton
									variant="contained"
									onClick={addToPlaylist}
									loading={loading}
								>
									Přidat do playlistu
								</LoadingButton>
							</Box>
						)}
					</StyledContainer>
				)}
			</Box>
		</Link>
	)
}

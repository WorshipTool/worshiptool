'use client'
import { Box, Button, CircularProgress, Typography } from '@mui/material'
import { Gap } from '../../../common/ui/Gap'
import { useSmartNavigate } from '../../../routes/useSmartNavigate'
import MySongItem from './components/MySongItem'
import useMySongs from './hooks/useMySongs'

export default function MySongsList() {
	const { variants, loaded } = useMySongs()
	const navigate = useSmartNavigate()
	return (
		<>
			<Box
				sx={{
					display: 'flex',
					flexDirection: 'column',
					alignItems: 'center',
				}}
			>
				<Box
					sx={{
						width: 500,
						marginTop: 5,
						marginBottom: 5,
					}}
				>
					<Typography variant="h5" fontWeight={600}>
						Moje písně:
					</Typography>
					<Gap value={2} />
					{!loaded ? (
						<Box
							sx={{
								display: 'flex',
								flexDirection: 'row',
								justifyContent: 'center',
								alignItems: 'center',
								flex: 1,
								color: 'black',
							}}
						>
							<Typography>Načítání...</Typography>
							<Gap value={2} horizontal />
							<CircularProgress size={'2rem'} color="inherit" />
						</Box>
					) : (
						<>
							{variants.map((variant, index) => {
								return (
									<MySongItem
										variant={variant}
										index={index}
										key={`mysong${variant.guid}`}
									></MySongItem>
								)
							})}

							{variants.length == 0 && (
								<Box
									sx={{
										display: 'flex',
										flexDirection: 'row',
										alignItems: 'center',
										gap: 2,
									}}
								>
									<Typography>Nemáš žádné vytvořené písně.</Typography>
									<Button
										onClick={() => {
											navigate('addMenu', {})
										}}
										variant="contained"
									>
										Vytvořit
									</Button>
								</Box>
							)}
						</>
					)}
				</Box>
			</Box>
		</>
	)
}

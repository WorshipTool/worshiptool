'use client'
import RowSongPackCard from '@/common/components/song/RowSongPackCard'
import { Box, Divider, Gap, Typography } from '@/common/ui'
import { styled } from '@/common/ui/mui'
import { grey } from '@/common/ui/mui/colors'

const Container = styled(Box)(({ theme }) => ({
	backgroundColor: grey[200],
	borderStyle: 'solid',
	borderWidth: 1,
	borderColor: grey[300],
	borderRadius: theme.spacing(1),
	padding: theme.spacing(2),
	boxShadow: '0px 1px 2px 1px rgba(0, 0, 0, 0.05)',
}))

export default function SongRightPanel() {
	return (
		<Box
			sx={{
				width: '300px',
				// position: 'sticky',
				// top: 56 + 16,
				gap: 2,
				display: 'flex',
				flexDirection: 'column',
				// paddingTop: 10,
			}}
		>
			<Container>
				<Box
					display={'flex'}
					flexDirection={'row'}
					alignItems={'center'}
					gap={1}
				>
					<Divider
						sx={{
							flex: 1,
						}}
					/>
					<Typography small>Překlady</Typography>
					<Divider
						sx={{
							flex: 1,
						}}
					/>
				</Box>

				<Gap />
				<Box
					sx={{
						display: 'flex',
						flexDirection: 'column',
						gap: 0.5,
					}}
				>
					{['Ocean1', 'Ocean2'].map((title, index) => (
						<RowSongPackCard
							key={title}
							data={{ title: title, packAlias: title + '-baf' } as any}
						/>
					))}
				</Box>
			</Container>

			<Container
				sx={{
					bgcolor: 'grey.100',
					boxShadow: '0px 1px 10px 1px rgba(0, 0, 0, 0.1)',
				}}
			>
				<Typography
					variant="h6"
					align="center"
					sx={
						{
							// color: 'primary.main',
						}
					}
				>
					Podpořte ChvalOtce.cz
				</Typography>
				<Gap />
				<Typography align="center">
					Ahoj! Tento zpěvník tvoříme pro vás ve svém volném čase.
				</Typography>
				<Gap />
				<Typography align="center">
					Podpořte nás, abychom mohli tvořit dál, přidat další vylepšení a
					odladit všechny chybičky.
				</Typography>
			</Container>

			<Container>
				<Typography variant="h6">Podobné chvály</Typography>
				{['Ocean1', 'Ocean2', 'Ocean1', 'Ocean2', 'Ocean1'].map(
					(title, index) => (
						<Typography key={index}>
							{index + 1}. {title}
						</Typography>
					)
				)}
			</Container>
		</Box>
	)
}

'use client'
import { Typography } from '@/common/ui/Typography'
import { useChangeDelayer } from '@/hooks/changedelay/useChangeDelayer'
import SongDropContainer from '@/hooks/dragsong/SongDropContainer'
import useSongDrag from '@/hooks/dragsong/useSongDrag'
import { Check, PlaylistAdd } from '@mui/icons-material'
import { Box } from '@mui/material'
import { useEffect, useState } from 'react'

export default function FloatingPlaylist() {
	const { isDragging } = useSongDrag()

	const [afterDropped, setAfterDropped] = useState(false)

	const [dropped, setDropped] = useState(false)

	useChangeDelayer(
		dropped,
		() => {
			setDropped(false)
		},
		[],
		1700
	)

	useEffect(() => {
		if (dropped) setAfterDropped(true)
	}, [dropped])

	useChangeDelayer(
		dropped,
		(v) => {
			if (!v) setAfterDropped(v)
		},
		[]
	)

	return (
		<SongDropContainer
			onDrop={() => {
				setDropped(true)
			}}
		>
			{(over) => {
				return (
					<Box
						sx={{
							padding: '1rem',
							position: 'fixed',
							bottom: isDragging || dropped ? 16 : -100,
							// bottom: 0,
							right: '50%',
							transform: `translateX(50%) scale(${over ? 1.05 : 1})`,
							transition: 'all 0.3s',

							borderRadius: 4,
							display: 'flex',
							flexDirection: 'row',
							alignItems: 'center',
							justifyContent: 'center',
							gap: 1,

							// borderColor: 'grey.900',
							// borderStyle: 'solid',
							// borderWidth: afterDropped ? 2 : 0,
							// borderBottomWidth: 0,

							boxShadow: '0px 2px 10px 0px rgba(0,0,0,0.1)',

							bgcolor: over ? 'secondary.dark' : 'secondary.main',
							width: 200,
						}}
					>
						{!afterDropped || over ? (
							<>
								<PlaylistAdd />
								<Box display={'flex'} flexDirection={'row'} gap={0.5}>
									<Typography strong>Přidat do</Typography>
									<Typography>Neděle 21.7.</Typography>
								</Box>
							</>
						) : (
							<>
								<Check fontSize="small" />
								<Typography>Píseň byla přidána</Typography>
							</>
						)}
					</Box>
				)
			}}
		</SongDropContainer>
	)
}

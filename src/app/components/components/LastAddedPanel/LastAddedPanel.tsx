'use client'

import useLastAddedSongs from '@/app/components/components/LastAddedSongsList/hooks/useLastAddedSongs'
import { Box, Clickable, Typography, useTheme } from '@/common/ui'
import { Link } from '@/common/ui/Link/Link'
import { Skeleton } from '@/common/ui/mui/Skeleton'
import { parseVariantAlias } from '@/tech/song/variant/variant.utils'
import { useEffect, useState } from 'react'

export default function LastAddedPanel() {
	const theme = useTheme()
	const { data, isLoading, isError, isSuccess } = useLastAddedSongs()

	// const navigate = useSmartNavigate()
	const [init, setInit] = useState(false)
	useEffect(() => {
		setInit(true)
	}, [])

	const ideasCount = 4

	return (
		<Box position={'relative'}>
			<Box
				sx={{
					bgcolor: 'grey.100',
					borderRadius: 2,
					padding: 2,
					boxShadow: '0px 0px 5px 0px rgba(0,0,0,0.2)',
					display: 'flex',
					flexDirection: 'column',
					gap: 1,
				}}
			>
				<Typography variant="h5" strong>
					Poslední přidané
				</Typography>

				<Box
					sx={{
						display: 'flex',
						flexDirection: 'column',
						gap: 1,
						width: 250,
					}}
				>
					{isLoading || !init ? (
						<>
							{Array.from({ length: ideasCount }).map((_, i) => (
								<Skeleton
									key={i}
									variant="rounded"
									sx={{
										width: '100%',
										height: 40,
										borderRadius: 2,
										bgcolor: theme.palette.grey[300],
									}}
								/>
							))}
						</>
					) : (
						data.slice(0, ideasCount).map((s) => (
							<Clickable key={s.packAlias}>
								<Link to="variant" params={parseVariantAlias(s.packAlias)}>
									<Box
										sx={{
											padding: 1,
											paddingX: 1.5,
											bgcolor: 'grey.100',
											borderRadius: 2,
											border: `2px solid ${theme.palette.grey[300]}`,
											display: 'flex',
											justifyContent: 'space-between',
										}}
									>
										<Typography>{s.title}</Typography>

										{/* {s.publishedAt && (
											<Chip
												label={getSmartDateAgoString(s.publishedAt)}
												size="small"
											/>
										)} */}
									</Box>
								</Link>
							</Clickable>
						))
					)}
				</Box>
			</Box>
		</Box>
	)
}

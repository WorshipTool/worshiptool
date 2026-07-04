import ContainerGrid from '@/common/components/ContainerGrid'
import { Box } from '@/common/ui'
import { Skeleton } from '@/common/ui/mui/Skeleton'

// Deterministic line widths so the skeleton resembles song lyrics
// (random widths would cause a hydration mismatch).
const VERSES = [
	['52%', '68%', '60%', '45%'],
	['66%', '50%', '72%', '58%', '44%'],
	['56%', '64%', '48%', '61%'],
]

export default function Loading() {
	return (
		<Box sx={{ display: 'flex', position: 'relative' }}>
			<ContainerGrid
				sx={{
					marginTop: 2,
					marginBottom: 2,
					gap: 2,
					alignItems: 'start',
				}}
			>
				<Box
					sx={{
						padding: 3,
						backgroundColor: 'grey.200',
						borderStyle: 'solid',
						borderWidth: 1,
						borderColor: 'grey.300',
						borderRadius: 1,
						flex: 1,
						display: 'flex',
						flexDirection: 'column',
					}}
				>
					<Skeleton variant="text" width="45%" sx={{ fontSize: '2.5rem' }} />
					<Skeleton variant="text" width="22%" sx={{ fontSize: '1rem' }} />

					{VERSES.map((verse, i) => (
						<Box
							key={i}
							sx={{ display: 'flex', flexDirection: 'column', marginTop: 3 }}
						>
							{verse.map((width, j) => (
								<Skeleton
									key={j}
									variant="text"
									width={width}
									sx={{ fontSize: '1.25rem' }}
								/>
							))}
						</Box>
					))}
				</Box>

				<Box
					sx={{
						width: 280,
						display: { xs: 'none', md: 'flex' },
						flexDirection: 'column',
						gap: 2,
					}}
				>
					<Skeleton variant="rounded" height={48} />
					<Skeleton variant="rounded" height={140} />
					<Skeleton variant="rounded" height={200} />
				</Box>
			</ContainerGrid>
		</Box>
	)
}

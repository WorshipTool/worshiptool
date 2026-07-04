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
		<Box
			sx={{
				display: 'flex',
				justifyContent: 'center',
				width: '100%',
				position: 'relative',
			}}
		>
			<ContainerGrid
				sx={{
					width: '100%',
					marginTop: 3,
					marginBottom: 6,
					paddingX: { xs: 2, md: 3 },
					alignItems: 'start',
				}}
			>
				<Box
					sx={{
						flex: 1,
						minWidth: 0,
						display: 'flex',
						flexDirection: 'row',
						flexWrap: 'wrap',
						alignItems: 'flex-start',
						justifyContent: 'center',
						gap: 3,
					}}
				>
					<Box
						sx={{
							padding: { xs: 2.5, sm: 3.5, md: 5 },
							backgroundColor: 'background.paper',
							boxShadow: '0px 6px 24px rgba(0, 0, 0, 0.08)',
							borderRadius: 3,
							flex: 1,
							minWidth: 0,
							maxWidth: { md: 800 },
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
							width: 320,
							flexShrink: 0,
							display: { xs: 'none', md: 'flex' },
							flexDirection: 'column',
							gap: 2,
						}}
					>
						<Skeleton variant="rounded" height={120} sx={{ borderRadius: 3 }} />
						<Skeleton variant="rounded" height={220} sx={{ borderRadius: 3 }} />
						<Skeleton variant="rounded" height={96} sx={{ borderRadius: 3 }} />
					</Box>
				</Box>
			</ContainerGrid>
		</Box>
	)
}

import { Box } from '@/common/ui'
import { Skeleton } from '@/common/ui/mui/Skeleton'

const ROW_COUNT = 6

export default function Loading() {
	return (
		<Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, padding: 2 }}>
			<Box
				sx={{
					display: 'flex',
					flexDirection: 'row',
					alignItems: 'center',
					gap: 2,
				}}
			>
				<Skeleton variant="text" width="30%" sx={{ fontSize: '2rem' }} />
				<Box sx={{ flex: 1 }} />
				<Skeleton variant="rounded" width={110} height={36} />
				<Skeleton variant="rounded" width={110} height={36} />
			</Box>

			<Box sx={{ display: 'flex', flexDirection: 'row', gap: 2 }}>
				<Box
					sx={{
						width: 300,
						display: { xs: 'none', md: 'flex' },
						flexDirection: 'column',
						gap: 1,
					}}
				>
					{Array.from({ length: ROW_COUNT }).map((_, i) => (
						<Skeleton key={i} variant="rounded" height={48} />
					))}
				</Box>
				<Skeleton
					variant="rounded"
					sx={{ flex: 1, height: '60vh' }}
				/>
			</Box>
		</Box>
	)
}

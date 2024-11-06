import { Box } from '@/common/ui'
import Skeleton from '@mui/lab/Skeleton'

export default function Loading() {
	const height = '2rem'
	return (
		<>
			<Box display={'flex'} flexDirection={'row'} gap={1} height={'3rem'}>
				{/* <Skeleton sx={{ flex: 1 }} />
				<Box sx={{ flex: 3 }} />
				<Skeleton sx={{ flex: 1 }} />
				<Skeleton sx={{ flex: 1 }} />
				<Skeleton sx={{ flex: 0.7 }} /> */}
			</Box>
			<Box display={'flex'} flexDirection={'row'} gap={1}>
				{/* <Skeleton height={'3rem'} sx={{ flex: 0.7 }} /> */}
				<Box sx={{ flex: 2 }} />
			</Box>

			{Array.from({ length: 30 }).map((_, i) => (
				<Skeleton key={i} height={height} width={40 + '%'} />
			))}
		</>
	)
}

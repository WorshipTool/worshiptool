import { Box } from '@/common/ui'
import { Skeleton } from '@/common/ui/mui/Skeleton'

export default function SongCardSkeleton() {
	return (
		<Box
			sx={{
				height: 200,
				backgroundColor: 'background.paper',
				borderRadius: '0.75rem',
				boxShadow: '0px 2px 10px rgba(0, 0, 0, 0.05)',
				padding: 2,
			}}
		>
			<Skeleton width={'60%'} height={'2rem'} />

			{/* <Gap value={0.5} /> */}

			{Array.from({ length: 5 }).map((_, i) => (
				<Skeleton key={i} width={80 + '%'} height={'1.5rem'} />
			))}
		</Box>
	)
}

import { Box } from '@/common/ui'
import { Skeleton } from '@/common/ui/mui/Skeleton'

export default function SongCardSkeleton() {
	return (
		<Box
			sx={{
				height: 200,
				backgroundColor: 'grey.200',
				borderRadius: 2,
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

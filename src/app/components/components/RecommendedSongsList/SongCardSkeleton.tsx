import { Box } from '@/common/ui'
import { Skeleton } from '@/common/ui/mui/Skeleton'

export default function SongCardSkeleton() {
	return (
		<Box
			sx={{
				height: 200,
				backgroundColor: 'background.paper',
				borderRadius: '0.75rem',
				borderStyle: 'solid',
				borderWidth: 1,
				borderColor: 'grey.200',
				boxShadow: '0px 1px 6px rgba(0, 0, 0, 0.04)',
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

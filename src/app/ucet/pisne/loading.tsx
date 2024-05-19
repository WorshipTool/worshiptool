import { Box, Skeleton } from '@mui/material'

export default function Loading() {
	return (
		<Box display={'flex'} flexDirection={'column'} gap={1}>
			{Array.from({ length: 8 }).map((_, i) => (
				<Skeleton key={i} width={100 + '%'} height={'6rem'} />
			))}
		</Box>
	)
}

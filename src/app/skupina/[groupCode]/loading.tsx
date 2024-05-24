import { Box, Skeleton } from '@mui/material'
import { Gap } from '../../../common/ui/Gap'

export default function Loading() {
	return (
		<Box
			sx={{
				position: 'fixed',
				top: 0,
				left: 0,
				right: 0,
			}}
		>
			<Skeleton height={250} variant="rectangular" />
			<Box
				display={'flex'}
				flexDirection={'row'}
				gap={1}
				sx={{
					marginTop: '-4rem',
				}}
			>
				<Box width={90} />
				<Skeleton
					width={180}
					height={'8rem'}
					variant="rectangular"
					sx={{
						borderRadius: 2,
					}}
				/>
				<Skeleton
					width={180}
					height={'8rem'}
					variant="rectangular"
					sx={{
						borderRadius: 2,
					}}
				/>
				<Skeleton
					width={180}
					height={'8rem'}
					variant="rectangular"
					sx={{
						borderRadius: 2,
					}}
				/>
			</Box>
			<Box
				sx={{
					paddingX: 5,
				}}
			>
				<Box
					display={'flex'}
					flexDirection={'row'}
					gap={1}
					justifyContent={'end'}
				>
					<Skeleton width={100} height={'2rem'} variant="rectangular" />
				</Box>
				<Gap />
				<Box display={'flex'} flexDirection={'column'} gap={1}>
					{Array.from({ length: 5 }).map((_, i) => (
						<Skeleton height={100} variant="rectangular" key={i} />
					))}
				</Box>
			</Box>
		</Box>
	)
}

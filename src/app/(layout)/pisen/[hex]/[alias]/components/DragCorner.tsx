import { Box } from '@/common/ui'
import { DragIndicator } from '@mui/icons-material'

type DragCornerProps = {
	index: number
}

export default function DragCorner({ index: i }: DragCornerProps) {
	return (
		<Box
			width={30}
			height={40}
			sx={{
				position: 'absolute',
				top: i < 2 ? 0 : undefined,
				bottom: i >= 2 ? 0 : undefined,
				left: i === 0 || i === 3 ? 0 : undefined,
				right: i === 1 || i === 2 ? 0 : undefined,
				opacity: 0,
				'&:hover': {
					opacity: 0.15,
				},
				transition: 'all 0.3s',
			}}
			display={'flex'}
			justifyContent={'center'}
			alignItems={'center'}
		>
			<DragIndicator />
		</Box>
	)
}

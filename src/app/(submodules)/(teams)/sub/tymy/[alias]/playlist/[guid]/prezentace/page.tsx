import { Box } from '@/common/ui'
import { PlaylistCards } from './../../../../../../../../(layout)/playlist/[guid]/prezentace/page'

export default function Page() {
	return (
		<Box
			sx={{
				position: 'fixed',
				left: 0,
				right: 0,
				top: 0,
				bottom: 0,
				zIndex: 2,
			}}
		>
			<PlaylistCards />
		</Box>
	)
}

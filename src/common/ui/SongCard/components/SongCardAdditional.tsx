import { SongVariantDto } from '@/api/dtos'
import { Box } from '@/common/ui/Box'
import HeartLikeButton from '@/common/ui/SongCard/components/HeartLikeButton'

type SongCardAdditionalProps = {
	isOver?: boolean
	data: SongVariantDto
}

export default function SongCardAdditional(props: SongCardAdditionalProps) {
	return (
		<Box display={'flex'} flexDirection={'column'} justifyContent={'end'}>
			<HeartLikeButton isOver={props.isOver} packGuid={props.data.packGuid} />
		</Box>
	)
}

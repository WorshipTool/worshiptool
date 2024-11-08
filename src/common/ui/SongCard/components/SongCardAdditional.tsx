import { SongVariantDto } from '@/api/dtos'
import { Box } from '@/common/ui/Box'
import HeartLikeButton from '@/common/ui/SongCard/components/HeartLikeButton'

type SongCardAdditionalProps = {
	isOver?: boolean
	data: SongVariantDto
}

export default function SongCardAdditional(props: SongCardAdditionalProps) {
	const moveOffset = '0.5rem'
	return (
		<Box display={'flex'} flexDirection={'column'} justifyContent={'end'}>
			<Box
				sx={
					{
						// transform: `translateY(${moveOffset}) translateX(${moveOffset})`,
					}
				}
			>
				<HeartLikeButton
					// hideIfNot={!props.isOver}
					hideIfNot
					// interactable
					packGuid={props.data.packGuid}
				/>
			</Box>
		</Box>
	)
}

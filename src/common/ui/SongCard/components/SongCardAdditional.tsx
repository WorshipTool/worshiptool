import { BasicVariantPack } from '@/api/dtos'
import { Box } from '@/common/ui/Box'
import HeartLikeButton from '@/common/ui/SongCard/components/HeartLikeButton'
import { SongVariantCard } from '@/common/ui/SongCard/SongVariantCard'
import { ComponentProps, useMemo } from 'react'

type SongCardAdditionalProps = {
	isOver?: boolean
	data: BasicVariantPack
	icons: ComponentProps<typeof SongVariantCard>['icons']
}

export default function SongCardAdditional(props: SongCardAdditionalProps) {
	const icons = useMemo(() => {
		if (!props.icons) return []
		return props.icons(props.data, props.isOver || false)
	}, [props.data, props.icons, props.isOver])

	const moveOffset = '0.5rem'
	return (
		<Box
			display={'flex'}
			flexDirection={'column'}
			justifyContent={'end'}
			gap={0.5}
		>
			{icons.map((icon, i) => (
				<Box
					key={i}
					sx={{
						color: 'grey.500',
					}}
				>
					{icon.icon}
				</Box>
			))}
			<HeartLikeButton
				// hideIfNot={!props.isOver}
				hideIfNot
				// interactable
				packGuid={props.data.packGuid}
				unmountIfNotVisible
			/>
		</Box>
	)
}

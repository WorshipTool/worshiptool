import { Box } from '@/common/ui/Box'
import { Tooltip } from '@/common/ui/CustomTooltip'
import { getTranslationData } from '@/common/ui/SongCard/components/tech'
import { PackTranslationType, SongLanguage } from '@/types/song'

type Props = {
	language?: SongLanguage
	translationType: PackTranslationType
}

export default function VariantCardColorPoint(props: Props) {
	const enabled = true

	const { color, message } = getTranslationData(
		props.translationType,
		props.language
	)

	const SIZE = 12

	return !color || !enabled ? null : (
		<Box
			component={'span'}
			sx={{
				bgcolor: color,
				width: SIZE,
				height: SIZE,
				borderRadius: '35%',
				display: 'inline-block',
				marginRight: 1,
			}}
		>
			<Tooltip title={message} component={'span'}>
				<Box
					component={'span'}
					sx={{
						width: SIZE,
						height: SIZE,
					}}
				></Box>
			</Tooltip>
		</Box>
	)
}

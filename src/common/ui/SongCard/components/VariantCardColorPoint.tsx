import { Box } from '@/common/ui/Box'
import { Tooltip } from '@/common/ui/CustomTooltip'
import { PackTranslationType, SongLanguage } from '@/types/song'

type Props = {
	language?: SongLanguage
	translationType: PackTranslationType
}

export default function VariantCardColorPoint({
	language,
	translationType: type,
}: Props) {
	const getColor = (): {
		color?: string
		message?: string
	} => {
		switch (language) {
			case 'cs':
				switch (type) {
					case PackTranslationType.Original:
						return {
							color: 'success.main',
							message: 'Český originál',
						}
					case PackTranslationType.OfficialTranslation:
						return {
							color: 'warning.main',
							message: 'Oficiální český překlad',
						}
					case PackTranslationType.Translation:
						return {
							color: 'secondary.main',
							message: 'Český překlad',
						}
				}
			default:
				switch (type) {
					case PackTranslationType.Original:
						return {
							color: 'primary.main',
							message: 'Originál',
						}
					case PackTranslationType.OfficialTranslation:
					case PackTranslationType.Translation:
						return {
							color: 'primary.light',
							message: 'Překlad',
						}
					default:
						return {}
				}
		}
	}

	const enabled = true

	const { color, message } = getColor()

	const SIZE = 12
	return !color || !enabled ? null : (
		<Box
			sx={{
				bgcolor: color,
				width: SIZE,
				height: SIZE,
				borderRadius: '35%',
				display: 'inline-block',
				marginRight: 1,
			}}
		>
			<Tooltip title={message}>
				<Box
					sx={{
						width: SIZE,
						height: SIZE,
					}}
				></Box>
			</Tooltip>
		</Box>
	)
}

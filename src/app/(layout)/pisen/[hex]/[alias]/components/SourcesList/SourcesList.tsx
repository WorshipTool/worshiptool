import { Box, Typography } from '@/common/ui'
import { SongVariantDto } from '../../../../../../../api/dtos'
import { Gap } from '../../../../../../../common/ui/Gap'
import SourceListItem from './SourceListItem'

export type SongPageProps = {
	variant: SongVariantDto
}
export function SourcesList({ variant }: SongPageProps) {
	return (
		<Box>
			<Typography>Zdroje:</Typography>
			<Gap value={0.25} />
			<Box display={'flex'} flexWrap={'wrap'} gap={1}>
				{variant.sources?.map((source, index) => (
					<SourceListItem key={source.value} source={source} />
				))}
			</Box>
		</Box>
	)
}

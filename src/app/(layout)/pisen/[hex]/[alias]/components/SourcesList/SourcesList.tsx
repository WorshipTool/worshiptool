'use client'

import { Box } from '@/common/ui'
import { ExtendedVariantPack } from '@/types/song'
import SourceListItem from './SourceListItem'

export type SongPageProps = {
	variant: ExtendedVariantPack
}

// Rendered inside a SideSection card that provides the section title.
export function SourcesList({ variant }: SongPageProps) {
	return (
		<Box display={'flex'} flexWrap={'wrap'} gap={1}>
			{variant.sources?.map((source, index) => (
				<SourceListItem key={source.value} source={source} />
			))}
		</Box>
	)
}

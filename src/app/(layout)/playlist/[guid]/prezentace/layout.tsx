import { generateSmartMetadata } from '@/tech/metadata/metadata'
import { Box } from '@mui/material'
import { LayoutProps, MetadataProps } from '../../../../../common/types'

export const generateMetadata = generateSmartMetadata(
	'playlistCards',
	({ params }: MetadataProps<'playlistCards'>) => {
		return {
			title: '💻',
		}
	}
)

export default function layout(props: LayoutProps) {
	return <Box>{props.children}</Box>
}

import { Box } from '@/common/ui'
import { generateSmartMetadata } from '@/tech/metadata/metadata'
import { LayoutProps, MetadataProps } from '../../../../../common/types'

export const generateMetadata = generateSmartMetadata(
	'playlistCards',
	({ params }: MetadataProps<'playlistCards'>) => {
		return {
			// title: '💻',
			icons: {
				icon: '/assets/icons/presentation-favicon.png',
			},
		}
	}
)

export default function layout(props: LayoutProps) {
	return <Box>{props.children}</Box>
}

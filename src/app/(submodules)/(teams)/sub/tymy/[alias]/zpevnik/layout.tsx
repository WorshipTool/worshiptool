import { LayoutProps, MetadataProps } from '@/common/types'
import { generateSmartMetadata } from '../../../../../../../tech/metadata/metadata'

export const generateMetadata = generateSmartMetadata(
	'teamSongbook',
	async ({ params }: MetadataProps<'teamSongbook'>) => {
		return {
			title: 'Zpěvník',
		}
	}
)

export default function TeamSongbookLayout(props: LayoutProps<'teamSongbook'>) {
	return props.children
}

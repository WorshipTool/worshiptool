import { LayoutProps, MetadataProps } from '@/common/types'
import { generateMetadataTitle } from '@/hooks/window-title/tech'

export const generateMetadata = async ({
	params,
}: MetadataProps<'teamSongbook'>) => {
	return {
		title: await generateMetadataTitle('Zpěvník', 'teamSongbook', params),
	}
}

export default function TeamSongbookLayout(props: LayoutProps<'teamSongbook'>) {
	return props.children
}

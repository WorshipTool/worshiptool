import { LayoutProps, MetadataProps } from '@/common/types'
import { generateMetadataTitle } from '@/hooks/window-title/tech'

export const generateMetadata = async ({
	params,
}: MetadataProps<'teamStatistics'>) => {
	return {
		title: await generateMetadataTitle('Statistiky', 'teamStatistics', params),
	}
}

export default function TeamStatisticsLayout(
	props: LayoutProps<'teamStatistics'>
) {
	return props.children
}

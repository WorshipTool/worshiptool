import { LayoutProps, MetadataProps } from '@/common/types'
import { generateSmartMetadata } from '../../../../../../../../tech/metadata/metadata'

export const generateMetadata = generateSmartMetadata(
	'teamStatistics',
	async ({ params }: MetadataProps<'teamStatistics'>) => {
		return {
			title: 'Statistiky',
		}
	}
)

export default function TeamStatisticsLayout(
	props: LayoutProps<'teamStatistics'>
) {
	return props.children
}

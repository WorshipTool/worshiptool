import { LayoutProps, MetadataProps } from '@/common/types'
import { generateSmartMetadata } from '../../../../../../../tech/metadata/metadata'

export const generateMetadata = generateSmartMetadata(
	'teamSettings',
	async ({ params }: MetadataProps<'teamSettings'>) => {
		return {
			title: 'Nastavení',
		}
	}
)

export default function TeamSettingsLayout(props: LayoutProps<'teamSettings'>) {
	return props.children
}

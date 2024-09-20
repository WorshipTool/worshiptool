import {
	getVariantAliasFromParams,
	getVariantByAlias,
} from '@/app/(layout)/pisen/[hex]/[alias]/tech'
import { LayoutProps, MetadataProps } from '@/common/types'
import { generateSmartMetadata } from '../../../../../../../../../tech/metadata/metadata'

export const generateMetadata = generateSmartMetadata(
	'teamSong',
	async ({ params }: MetadataProps<'teamSong'>) => {
		const alias = getVariantAliasFromParams(params.hex, params['title-alias'])
		try {
			const variantData = await getVariantByAlias(alias)
			const variant = variantData.variants[0]
			const songTitle = variant.prefferedTitle

			const title = songTitle
			// songTitle + ` (${sheet.getKeyChord() ? 'Píseň s akordy' : 'Text písně'})`
			return {
				title: title,
			}
		} catch (e) {
			return {
				title: 'Píseň',
			}
		}
	}
)

export default function TeamPisenLayout(props: LayoutProps) {
	return props.children
}

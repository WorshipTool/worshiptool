import { Sheet } from '@pepavlin/sheet-api'
import { LayoutProps, MetadataProps } from '../../../../../common/types'
import { generateMetadataTitle } from '../../../../../hooks/window-title/tech'
import { getVariantAliasFromParams, getVariantByAlias } from './tech'

export const generateMetadata = async ({
	params,
}: MetadataProps<'variant'>) => {
	const alias = getVariantAliasFromParams(params.hex, params.alias)
	try {
		const variantData = await getVariantByAlias(alias)
		const variant = variantData.variants[0]
		const songTitle = variant.prefferedTitle

		const sheet = new Sheet(variant.sheetData)

		const title =
			songTitle + ` (${sheet.getKeyChord() ? 'Píseň s akordy' : 'Text písně'})`
		return {
			title: await generateMetadataTitle(title, 'variant', params),
		}
	} catch (e) {
		return {
			title: await generateMetadataTitle('Text písně', 'variant', params),
		}
	}
}

export default function layout(props: LayoutProps) {
	return props.children
}

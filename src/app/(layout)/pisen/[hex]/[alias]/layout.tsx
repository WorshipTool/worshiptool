import { generateSmartMetadata } from '@/tech/metadata/metadata'
import { Sheet } from '@pepavlin/sheet-api'
import { notFound } from 'next/navigation'
import { LayoutProps } from '../../../../../common/types'
import { getVariantAliasFromParams, getVariantByAlias } from './tech'

export const generateMetadata = generateSmartMetadata(
	'variant',
	async ({ params }) => {
		const alias = getVariantAliasFromParams(params.hex, params.alias)
		try {
			const variantData = await getVariantByAlias(alias)
			const variant = variantData.variants[0]
			const songTitle = variant.prefferedTitle

			const sheet = new Sheet(variant.sheetData)

			const title =
				songTitle +
				` (${sheet.getKeyChord() ? 'Píseň s akordy' : 'Text písně'})`
			return {
				title: title,
			}
		} catch (e) {
			notFound()
		}
	}
)

export default function layout(props: LayoutProps) {
	return props.children
}

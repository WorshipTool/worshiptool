'use server'
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
			const variant = variantData.main
			const songTitle = variant.title

			const sheet = new Sheet(variant.sheetData)

			const title =
				songTitle + ` (${sheet.getKeyNote() ? 'Píseň s akordy' : 'Text písně'})`
			return {
				title: title,
			}
		} catch (e) {
			notFound()
		}
	}
)

export default async function layout(props: LayoutProps<'variant'>) {
	return props.children
}

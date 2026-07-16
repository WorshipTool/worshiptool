'use server'
import { HIDE_TOPBAR_ON_MOBILE_CSS } from '@/common/components/MobileAppTabBar/nav.constants'
import { getRouteUrlWithParams } from '@/routes/tech/transformer.tech'
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
				description: sheet.getText(),
				openGraph: {
					images: [getRouteUrlWithParams('variantPreviewImage', params)],
				},
			}
		} catch (e) {
			console.error('Error generating metadata for variant:', e)
			notFound()
		}
	}
)

export default async function layout(props: LayoutProps<'variant'>) {
	// Hide the top bar on phones from the first paint — this layout renders
	// immediately and wraps the loading fallback, so the bar never flashes in
	// while the song data is fetched on the server.
	return (
		<>
			<style>{HIDE_TOPBAR_ON_MOBILE_CSS}</style>
			{props.children}
		</>
	)
}

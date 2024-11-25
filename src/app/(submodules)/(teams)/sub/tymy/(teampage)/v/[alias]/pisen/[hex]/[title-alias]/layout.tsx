import { InnerSongProvider } from '@/app/(layout)/pisen/[hex]/[alias]/hooks/useInnerSong'
import {
	getVariantAliasFromParams,
	getVariantByAlias,
} from '@/app/(layout)/pisen/[hex]/[alias]/tech'
import { LayoutProps, MetadataProps } from '@/common/types'
import { generateSmartMetadata } from '@/tech/metadata/metadata'
import { notFound } from 'next/navigation'

export const generateMetadata = generateSmartMetadata(
	'teamPublicSong',
	async ({ params }: MetadataProps<'teamPublicSong'>) => {
		const alias = getVariantAliasFromParams(params.hex, params['title-alias'])
		try {
			const variantData = await getVariantByAlias(alias)
			const variant = variantData.variants[0]
			const songTitle = variant.prefferedTitle

			const title = songTitle
			return {
				title: title,
			}
		} catch (e) {
			notFound()
		}
	}
)

export default function TeamPisenLayout(props: LayoutProps<'teamPublicSong'>) {
	return (
		<InnerSongProvider
			variantAlias={getVariantAliasFromParams(
				props.params.hex,
				props.params['title-alias']
			)}
		>
			{props.children}
		</InnerSongProvider>
	)
}

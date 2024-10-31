import { InnerSongProvider } from '@/app/(layout)/pisen/[hex]/[alias]/hooks/useInnerSong'
import {
	getVariantAliasFromParams,
	getVariantByAlias,
} from '@/app/(layout)/pisen/[hex]/[alias]/tech'
import { LayoutProps, MetadataProps } from '@/common/types'
import { notFound } from 'next/navigation'
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
			notFound()
		}
	}
)

export default function TeamPisenLayout(props: LayoutProps<'teamSong'>) {
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

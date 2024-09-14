import {
	getVariantAliasFromParams,
	getVariantByAlias,
} from '@/app/(layout)/pisen/[hex]/[alias]/tech'
import { LayoutProps, MetadataProps } from '@/common/types'
import { generateMetadataTitle } from '@/hooks/window-title/tech'

export const generateMetadata = async ({
	params,
}: MetadataProps<'teamSong'>) => {
	const alias = getVariantAliasFromParams(params.hex, params['title-alias'])
	try {
		const variantData = await getVariantByAlias(alias)
		const variant = variantData.variants[0]
		const songTitle = variant.prefferedTitle

		const title = songTitle
		// songTitle + ` (${sheet.getKeyChord() ? 'Píseň s akordy' : 'Text písně'})`
		return {
			title: await generateMetadataTitle(title, 'teamSong', params),
		}
	} catch (e) {
		return {
			title: await generateMetadataTitle('Píseň', 'teamSong', params),
		}
	}
}

export default function TeamPisenLayout(props: LayoutProps) {
	return props.children
}

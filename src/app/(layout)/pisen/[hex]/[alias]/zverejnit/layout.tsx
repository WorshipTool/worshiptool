import { InnerSongProvider } from '@/app/(layout)/pisen/[hex]/[alias]/hooks/useInnerSong'
import { getVariantAliasFromParams } from '@/app/(layout)/pisen/[hex]/[alias]/tech'
import { LayoutProps } from '@/common/types'

export default function Layout(props: LayoutProps<'variantPublish'>) {
	const alias = getVariantAliasFromParams(props.params.hex, props.params.alias)
	return (
		<InnerSongProvider variantAlias={alias}>{props.children}</InnerSongProvider>
	)
}

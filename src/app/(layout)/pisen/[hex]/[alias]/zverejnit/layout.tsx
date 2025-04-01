'use client'
import { InnerPackProvider } from '@/app/(layout)/pisen/[hex]/[alias]/hooks/useInnerPack'
import { getVariantAliasFromParams } from '@/app/(layout)/pisen/[hex]/[alias]/tech'
import { LayoutProps } from '@/common/types'

export default function Layout(props: LayoutProps<'variantPublish'>) {
	const alias = getVariantAliasFromParams(props.params.hex, props.params.alias)
	return (
		<InnerPackProvider variantAlias={alias}>{props.children}</InnerPackProvider>
	)
}

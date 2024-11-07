import { MetadataProps } from '@/common/types'
import { RoutesKeys } from '@/routes'
import { WINDOW_TITLE_DIVIDER } from '@/tech/metadata/constants'
import { Metadata, ResolvingMetadata } from 'next'

export const generateSmartMetadata = <T extends RoutesKeys>(
	route: T,
	generateFunction: (params: MetadataProps<T>) => Promise<Metadata> | Metadata
) => {
	return async (params: MetadataProps<T>, parent: ResolvingMetadata) => {
		const data = await generateFunction(params)
		const parentData = await parent
		const parentTitle = parentData.title?.absolute

		const combinedTitle = parentTitle
			? data.title
				? data.title + WINDOW_TITLE_DIVIDER + parentTitle
				: parentTitle
			: data.title
		return {
			...data,
			title: combinedTitle,
		}
	}
}

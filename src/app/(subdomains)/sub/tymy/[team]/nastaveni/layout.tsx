import { LayoutProps, MetadataProps } from '@/common/types'
import { generateMetadataTitle } from '@/hooks/window-title/tech'

export const generateMetadata = async ({
	params,
}: MetadataProps<'teamSettings'>) => {
	return {
		title: await generateMetadataTitle('Nastavení', 'teamSettings', params),
	}
}

export default function TeamSettingsLayout(props: LayoutProps<'teamSettings'>) {
	return props.children
}

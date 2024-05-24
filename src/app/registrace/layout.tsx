import { LayoutProps, MetadataProps } from '../../common/types'
import { generateMetadataTitle } from '../../hooks/window-title/tech'

export const generateMetadata = async ({ params }: MetadataProps<'signup'>) => {
	return {
		title: await generateMetadataTitle('Vytvoření účtu', 'signup', params),
	}
}

export default function layout(props: LayoutProps) {
	return <>{props.children}</>
}

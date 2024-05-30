import { LayoutProps } from '../../../common/types'
import { generateMetadataTitle } from '../../../hooks/window-title/tech'

export const generateMetadata = async () => ({
	title: await generateMetadataTitle('Vytvořit', 'addMenu', {}),
})

export default function layout({ children }: LayoutProps) {
	return children
}

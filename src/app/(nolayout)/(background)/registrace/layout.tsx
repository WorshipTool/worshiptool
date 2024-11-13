import { LayoutProps, MetadataProps } from '../../../../common/types'
import { generateSmartMetadata } from '../../../../tech/metadata/metadata'

export const generateMetadata = generateSmartMetadata(
	'signup',

	async ({ params }: MetadataProps<'signup'>) => {
		return {
			title: 'Vytvoření účtu',
		}
	}
)

export default function layout(props: LayoutProps) {
	return <>{props.children}</>
}

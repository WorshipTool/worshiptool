import { LayoutProps } from '../../../../common/types'
import { generateSmartMetadata } from '../../../../tech/metadata/metadata'

export const generateMetadata = generateSmartMetadata(
	'usersPlaylists',
	async () => {
		return {
			title: 'Playlisty',
		}
	}
)

export default function layout(props: LayoutProps) {
	return props.children
}

import { TeamPisenPage } from '@/app/(submodules)/(teams)/sub/tymy/(teampage)/[alias]/pisen/[hex]/[title-alias]/page'
import { PageProps } from '@/common/types'

export default function Page(props: PageProps<'teamPublicSong'>) {
	return <TeamPisenPage {...props} />
}

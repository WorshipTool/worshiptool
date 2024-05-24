'use client'
import { Link } from '../../common/ui/Link/CustomLink'

export default function page() {
	return (
		<div>
			<Link
				to="uploadParse"
				params={{
					files: ['file1/1', 'file2/2'],
				}}
			>
				Test
				{process.env.NEXT_PUBLIC_BACKEND_URL}a
			</Link>
		</div>
	)
}

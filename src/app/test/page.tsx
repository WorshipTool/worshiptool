'use client'
import { Link } from '../../common/ui/Link/CustomLink'

export default function page() {
	console.log('BACKEND_URL', process.env.NEXT_PUBLIC_BACKEND_URL)
	console.log('FRONTEND_URL', process.env.NEXT_PUBLIC_FRONTEND_URL)
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

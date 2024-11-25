import { theme } from '@/common/constants/theme'
import { Typography } from '@/common/ui/Typography'

type NoteContentProps = {
	content?: string
	children?: string
}
export default function NoteContent(props: NoteContentProps) {
	const content = props.content || props.children || ''

	const urlRegex = /(\bhttps?:\/\/\S+\b)/g
	const parts = content.split(urlRegex)
	return (
		<Typography sx={{ whiteSpace: 'pre-line' }} color="grey.600">
			{parts.map((part, index) =>
				urlRegex.test(part) ? (
					<a
						key={index}
						href={part}
						target="_blank"
						rel="noopener noreferrer"
						style={{
							color: theme.palette.primary.main,
							textDecoration: 'underline',
						}}
					>
						{part}
					</a>
				) : (
					part
				)
			)}
		</Typography>
	)
}

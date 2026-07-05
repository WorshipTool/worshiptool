import { Box, Chip, Clickable, Typography } from '@/common/ui'
import { Link } from '@/common/ui/Link/Link'
import { grey } from '@/common/ui/mui/colors'
import { getSmartDateAgoString } from '@/tech/date/date.tech'
import { parseVariantAlias } from '@/tech/song/variant/variant.utils'
import { BasicVariantPack } from '@/types/song'

type Props = {
	data: BasicVariantPack
}

export default function RowSongPackCard({ data: s }: Props) {
	return (
		<Clickable key={s.packAlias}>
			<Link to="variant" params={parseVariantAlias(s.packAlias)}>
				<Box
					sx={{
						padding: 1,
						paddingX: 1.5,
						bgcolor: 'background.paper',
						borderRadius: 2,
						border: `1px solid ${grey[200]}`,
						boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.05)',
						display: 'flex',
						justifyContent: 'space-between',
					}}
				>
					<Typography>{s.title}</Typography>

					{s.publishedAt && (
						<Chip
							label={getSmartDateAgoString(s.publishedAt)}
							size="small"
							variant="filled"
						/>
					)}
				</Box>
			</Link>
		</Clickable>
	)
}

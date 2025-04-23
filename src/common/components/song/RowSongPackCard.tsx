import { Box, Clickable, Typography } from '@/common/ui'
import { Link } from '@/common/ui/Link/Link'
import { grey } from '@/common/ui/mui/colors'
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
						bgcolor: 'grey.100',
						borderRadius: 2,
						border: `2px solid ${grey[300]}`,
						display: 'flex',
						justifyContent: 'space-between',
					}}
				>
					<Typography>{s.title}</Typography>

					{/* {s.publishedAt && (
                                                <Chip
                                                    label={getSmartDateAgoString(s.publishedAt)}
                                                    size="small"
                                                />
                                            )} */}
				</Box>
			</Link>
		</Clickable>
	)
}

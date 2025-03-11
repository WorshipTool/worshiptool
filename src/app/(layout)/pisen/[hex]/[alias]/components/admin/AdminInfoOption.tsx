import { useInnerSong } from '@/app/(layout)/pisen/[hex]/[alias]/hooks/useInnerSong'
import AdminOption from '@/common/components/admin/AdminOption'
import Popup from '@/common/components/Popup/Popup'
import { Box, Typography } from '@/common/ui'
import { Info } from '@mui/icons-material'
import { useState } from 'react'

const Item = ({ title, value }: { title: string; value: string }) => (
	<Box display={'flex'} gap={1}>
		<Typography strong>{title}</Typography>
		<Typography>{value}</Typography>
	</Box>
)
export default function AdminAdvancedInfoOption() {
	const [popupOpen, setPopupOpen] = useState(false)

	const { variant } = useInnerSong()

	return (
		<>
			<AdminOption
				title="Zobrazit detaily"
				icon={<Info />}
				onClick={() => setPopupOpen(true)}
			/>

			<Popup
				open={popupOpen}
				onClose={() => setPopupOpen(false)}
				title="Detaily"
				subtitle="Pokročilé informace"
				width={500}
			>
				<Box
					maxHeight={700}
					sx={{
						overflowY: 'auto',
						overflowX: 'hidden',
					}}
				>
					<Item title="PackGuid" value={variant.packGuid} />
					<Item title="PackAlias" value={variant.packAlias} />
					<Item title="SongGuid" value={variant.songGuid} />
				</Box>
			</Popup>
		</>
	)
}

import useInnerPlaylist from '@/app/(layout)/playlist/[guid]/hooks/useInnerPlaylist'
import Tooltip from '@/common/ui/CustomTooltip/Tooltip'
import TextField from '@/common/ui/TextField/TextField'
import { grey } from '@mui/material/colors'
import './TitleBox.styles.css'

export default function TitleBox() {
	const { title, rename } = useInnerPlaylist()

	return (
		<div>
			<Tooltip label="Přejmenovat" placement="bottom">
				<TextField
					sx={{
						borderColor: `${grey[400]}`,
						outlineColor: `${grey[400]}`,
						fontSize: '1.5rem',
						fontWeight: 600,
					}}
					placeholder="Název playlistu"
					value={title}
					className={'playlist-title-box'}
					onChange={rename}
				/>
			</Tooltip>
		</div>
	)
}

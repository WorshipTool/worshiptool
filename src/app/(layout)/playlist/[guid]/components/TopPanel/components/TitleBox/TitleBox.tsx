import useInnerPlaylist from '@/app/(layout)/playlist/[guid]/hooks/useInnerPlaylist'
import { Box, Tooltip, useTheme } from '@/common/ui'
import { TextField } from '@/common/ui/TextField/TextField'
import { Typography } from '@/common/ui/Typography'
import { grey } from '@mui/material/colors'
import './TitleBox.styles.css'

export default function TitleBox() {
	const { title, rename, canUserEdit } = useInnerPlaylist()

	const theme = useTheme()
	return (
		<div>
			{canUserEdit ? (
				<>
					<Tooltip label="Přejmenovat" placement="bottom">
						<TextField
							sx={{
								borderColor: `${grey[400]}`,
								outlineColor: `${grey[400]}`,
								fontSize: '1.5rem',
								fontWeight: 600,
								[theme.breakpoints.down('md')]: {
									display: 'none',
								},
							}}
							placeholder="Název playlistu"
							value={title}
							className={'playlist-title-box'}
							onChange={rename}
						/>
					</Tooltip>

					<Box
						padding={0.5}
						paddingLeft={1}
						display={{
							sx: 'block',
							sm: 'block',
							md: 'none',
						}}
					>
						<Typography strong={600} size={'1.5rem'}>
							{title}
						</Typography>
					</Box>
				</>
			) : (
				<Box padding={0.5} paddingLeft={1}>
					<Typography strong={600} size={'1.5rem'}>
						{title}
					</Typography>
				</Box>
			)}
		</div>
	)
}

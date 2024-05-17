import { Box, Button, Typography } from '@mui/material'

interface UploadedSongLinkProps {
	title: string
	guid: string
	index: number
}

export default function UploadedSongLink(props: UploadedSongLinkProps) {
	const open = () => {
		window?.open('/song/' + props.guid, '_blank')
	}
	return (
		<div onClick={open}>
			<Box
				sx={{
					display: 'flex',
					flexDirection: 'row',
					gap: 2,
					alignItems: 'center',
					padding: 2,
					paddingLeft: 5,
					paddingRight: 5,
					backgroundColor: '#e0e0e0',
					borderRadius: 1,
					cursor: 'pointer',
					'&:hover': {
						backgroundColor: '#d0d0d0',
					},
				}}
			>
				<Button onClick={open}>Otevřít</Button>
				<Typography variant="subtitle2" flex={1}>
					{props.title}
				</Typography>
				<Typography variant="caption">{props.index}</Typography>
			</Box>
		</div>
	)
}

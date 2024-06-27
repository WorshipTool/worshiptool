import { Public, PublicOff } from '@mui/icons-material'
import { Box, IconButton, Tooltip, Typography, useTheme } from '@mui/material'

export type VisibilityLabelProps = {
	public: boolean
	right?: boolean
}

export default function VisibilityLabel(props: VisibilityLabelProps) {
	const theme = useTheme()
	return (
		<Box
			sx={{
				display: 'flex',
				flexDirection: 'row',
				alignItems: 'center',
				gap: 0.5,
				color: 'grey.700',
				[theme.breakpoints.down('md')]: !props.right
					? {
							display: 'none',
					  }
					: {},
				[theme.breakpoints.up('md')]: props.right
					? {
							display: 'none',
					  }
					: {},
			}}
		>
			<Tooltip
				title={props.public ? 'Píseň je veřejná' : 'Píseň vídíte jen vy'}
			>
				<IconButton>{props.public ? <Public /> : <PublicOff />}</IconButton>
			</Tooltip>
			<Typography
				sx={{
					[theme.breakpoints.down('md')]: {
						display: 'none',
					},
				}}
			>
				{props.public ? 'Píseň je veřejná' : 'Píseň vídíte jen vy'}
			</Typography>
		</Box>
	)
}

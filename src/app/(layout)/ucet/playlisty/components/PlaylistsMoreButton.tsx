import { IconButton } from '@/common/ui/IconButton'
import { MoreHoriz } from '@mui/icons-material'

export default function PlaylistsMoreButton() {
	return (
		<>
			<IconButton variant="contained" color="grey.300" squared>
				<MoreHoriz />
			</IconButton>
			{/* <Button
				sx={{
					minWidth: 0,
					width: 36,
					height: 36,
				}}
				// color="grey.800"
			>
				<MoreHoriz />
			</Button> */}
		</>
	)
}

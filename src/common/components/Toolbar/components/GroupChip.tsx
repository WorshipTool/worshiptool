import { Box, Chip } from '@mui/material'
import { ReactElement } from 'react'
import useGroup from '../../../../hooks/group/useGroup'
import { useSmartNavigate } from '../../../../routes/useSmartNavigate'

interface GroupChipProps {
	avatar?: ReactElement
}

export default function GroupChip({ avatar }: GroupChipProps) {
	const { isOn, name, turnOff } = useGroup()
	const navigate = useSmartNavigate()

	const onDelete = () => {
		turnOff()
		// if (window.location.pathname.startsWith(GROUP_URL)) navigate("/");
	}

	return (
		<Box sx={{ pointerEvents: 'auto' }}>
			{isOn ? (
				<Chip
					label={name}
					onDelete={onDelete}
					color="secondary"
					avatar={avatar}
				/>
			) : (
				<></>
			)}
		</Box>
	)
}

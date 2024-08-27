import { Box } from '@mui/material'

export const POPUP_DIV_CONTAINER_ID = 'popup-div-container'
export default function PopupProvider() {
	return (
		<Box
			id={POPUP_DIV_CONTAINER_ID}
			sx={{
				position: 'absolute',
				top: 0,
				left: 0,
				right: 0,
				bottom: 0,
				pointerEvents: 'none',
			}}
		></Box>
	)
}

import { Box } from '@/common/ui'

export const POPUP_DIV_CONTAINER_ID = 'popup-div-container'
export const POPUP_CONTAINER_Z_INDEX = 1360
export default function PopupProvider() {
	return (
		<Box
			id={POPUP_DIV_CONTAINER_ID}
			sx={{
				position: 'fixed',
				top: 0,
				left: 0,
				right: 0,
				bottom: 0,
				pointerEvents: 'none',
				// zIndex: 10,
				zIndex: POPUP_CONTAINER_Z_INDEX,
			}}
		></Box>
	)
}

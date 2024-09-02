'use client'
import PopupContainer from '@/common/components/Popup/PopupContainer'
import { POPUP_DIV_CONTAINER_ID } from '@/common/components/Popup/PopupProvider'
import { Box, alpha, useTheme } from '@mui/material'
import { AnimatePresence, motion } from 'framer-motion'
import { useEffect, useRef, useState } from 'react'

type PopupProps = {
	open?: boolean
	onClose?: () => void
	children?: React.ReactNode
}
export default function Popup({ children, open = true, onClose }: PopupProps) {
	const ref = useRef<HTMLDivElement | null>(null)

	const [mounted, setMounted] = useState(false)

	useEffect(() => {
		ref.current = document.querySelector(`#${POPUP_DIV_CONTAINER_ID}`)
		setMounted(true)
		return () => setMounted(false)
	}, [])

	const onCloseHandle = (e: React.MouseEvent) => {
		if (onClose) {
			onClose()
		}

		e.stopPropagation()
	}

	const theme = useTheme()

	return ref.current && mounted ? (
		<PopupContainer>
			(
			<AnimatePresence>
				{open && (
					<motion.div
						style={{
							width: '100%',
							height: '100%',
							display: 'flex',
							justifyContent: 'center',
							alignItems: 'center',
							backdropFilter: 'blur(2px)',
							backgroundColor: alpha('#000', 0.5),
							pointerEvents: 'auto',
						}}
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						exit={{ opacity: 0 }}
						transition={{ duration: 0.2 }}
						onClick={onCloseHandle}
					>
						<Box
							sx={{
								pointerEvents: 'auto',
								padding: 3,
								borderRadius: 3,
								bgcolor: 'white',
								boxShadow: '0px 0px 4px  rgba(0,0,0,0.1)',
							}}
							onClick={(e) => e.stopPropagation()}
						>
							{children}
						</Box>
					</motion.div>
				)}
			</AnimatePresence>
		</PopupContainer>
	) : null
}

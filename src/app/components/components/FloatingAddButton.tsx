import { Add } from '@mui/icons-material'
import { Box, Fab, Tooltip } from '@mui/material'
import { AnimatePresence, motion } from 'framer-motion'
import { Link } from '../../../common/ui/Link/CustomLink'
import useAuth from '../../../hooks/auth/useAuth'
import { useSmartNavigate } from '../../../routes/useSmartNavigate'

interface FloatingAddButtonProps {
	extended?: boolean
}

export default function FloatingAddButton({
	extended,
}: FloatingAddButtonProps) {
	const { isLoggedIn } = useAuth()
	const navigate = useSmartNavigate()

	const transition = 'all 0.2s ease'
	const titleWidth = '90px'
	return (
		<Link to="addMenu" params={{}}>
			<AnimatePresence>
				{isLoggedIn() && (
					<motion.div
						initial={{
							opacity: 0,
						}}
						animate={{
							opacity: 1,
						}}
						exit={{
							opacity: 0,
						}}
					>
						<Tooltip title={'Přidat novou píseň'} placement="left">
							<Fab
								sx={{
									position: 'fixed',
									bottom: 30,
									right: 30,
									transition,
									...(extended
										? {
												width: `calc( ${titleWidth} + 56px)`,
										  }
										: {
												width: 56,
										  }),
								}}
								color="primary"
								variant={extended ? 'extended' : 'circular'}
							>
								<Add
									sx={{
										position: 'absolute',
										transition,
										...(extended
											? {
													mr: titleWidth,
											  }
											: {
													mr: 0,
											  }),
									}}
								/>
								<Add sx={{ opacity: 0 }} />
								<Box
									sx={{
										transition,
										overflowWrap: 'none',
										overflow: 'hidden',
										...(extended
											? {
													width: titleWidth,
											  }
											: {
													width: 0,
													opacity: 0,
											  }),
									}}
								>
									Vytvořit
								</Box>
							</Fab>
						</Tooltip>
					</motion.div>
				)}
			</AnimatePresence>
		</Link>
	)
}

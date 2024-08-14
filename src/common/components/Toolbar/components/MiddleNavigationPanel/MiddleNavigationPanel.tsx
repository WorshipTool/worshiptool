import MobileNavigationItem from '@/common/components/Toolbar/components/MiddleNavigationPanel/MobileNavigationItem'
import NavigationItem from '@/common/components/Toolbar/components/MiddleNavigationPanel/NavigationItem'
import { MOBILE_NAVIGATION_PANEL_ID } from '@/common/components/Toolbar/components/MiddleNavigationPanel/NavigationMobilePanel'
import { useToolbar } from '@/common/components/Toolbar/hooks/useToolbar'
import { Button } from '@/common/ui/Button'
import { IconButton } from '@/common/ui/IconButton'
import { RoutesKeys } from '@/routes'
import { ArrowDropUp, Menu } from '@mui/icons-material'
import { Box, Divider } from '@mui/material'
import { useState } from 'react'
import { createPortal } from 'react-dom'

const navigationItems: { title: string; to: RoutesKeys | undefined }[] = [
	{ title: 'O nás', to: 'about' },
	{ title: 'Chválící týmy', to: 'teams' },
	{ title: 'Kontakt', to: 'contact' },
]
export default function MiddleNavigationPanel() {
	const { hideMiddleNavigation } = useToolbar()

	const [showMobileMenu, setShowMobileMenu] = useState(false)
	return (
		<Box
			sx={{
				opacity: hideMiddleNavigation ? 0 : 1,
				transition: 'all 0.3s ease',
			}}
			position={'relative'}
		>
			{/* <NavigationItem title="Hledat" /> */}
			<Box
				display={{
					xs: 'none',
					sm: 'flex',
				}}
				flexDirection={'row'}
				gap={4}
			>
				{navigationItems.map((item) => (
					<NavigationItem title={item.title} to={item.to} key={item.title} />
				))}
			</Box>

			<Box
				display={{
					xs: 'block',
					sm: 'none',
				}}
			>
				<IconButton
					color="inherit"
					onClick={() => {
						setShowMobileMenu(!showMobileMenu)
					}}
				>
					<Menu />
				</IconButton>
			</Box>

			{showMobileMenu &&
				createPortal(
					<Box
						display={{
							xs: 'flex',
							sm: 'none',
						}}
						flexDirection={'column'}
						justifyContent={'space-around'}
						flexWrap={'wrap'}
						position={'fixed'}
						top={56}
						left={0}
						right={0}
						zIndex={1}
						boxShadow={2}
						bgcolor={'grey.200'}
					>
						{navigationItems.map((item) => (
							<MobileNavigationItem
								title={item.title}
								to={item.to}
								key={item.title}
								onClick={() => {
									setShowMobileMenu(false)
								}}
							/>
						))}
						<Divider />
						<Box
							display={'flex'}
							flexDirection={'row'}
							justifyContent={'center'}
							paddingY={1}
						>
							<Button
								size="small"
								variant="text"
								endIcon={<ArrowDropUp />}
								color="inherit"
								onClick={() => {
									setShowMobileMenu(false)
								}}
							>
								Zavřít menu
							</Button>
						</Box>
					</Box>,
					document.querySelector(`#${MOBILE_NAVIGATION_PANEL_ID}`)!
				)}
		</Box>
	)
}

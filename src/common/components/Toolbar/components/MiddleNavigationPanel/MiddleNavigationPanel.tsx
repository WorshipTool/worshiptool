import NavigationItem from '@/common/components/Toolbar/components/MiddleNavigationPanel/NavigationItem'
import { useToolbar } from '@/common/components/Toolbar/hooks/useToolbar'
import { Box } from '@mui/material'

export default function MiddleNavigationPanel() {
	const { hideMiddleNavigation } = useToolbar()
	return (
		<Box
			display={'flex'}
			flexDirection={'row'}
			gap={4}
			sx={{
				opacity: hideMiddleNavigation ? 0 : 1,
				transition: 'all 0.3s ease',
			}}
		>
			{/* <NavigationItem title="Hledat" /> */}
			<NavigationItem title="O nás" to="about" />
			<NavigationItem title="Chválící týmy" to="teams" />
			<NavigationItem title="Kontakt" to="contact" />
		</Box>
	)
}

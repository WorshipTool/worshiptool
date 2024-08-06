import NavigationItem from '@/common/components/Toolbar/components/MiddleNavigationPanel/NavigationItem'
import { Box } from '@mui/material'

export default function MiddleNavigationPanel() {
	return (
		<Box display={'flex'} flexDirection={'row'} gap={4}>
			<NavigationItem title="Hledat" />
			<NavigationItem title="O nás" to="about" />
			<NavigationItem title="Chválící týmy" to="teams" />
			<NavigationItem title="Kontakt" to="contact" />
		</Box>
	)
}

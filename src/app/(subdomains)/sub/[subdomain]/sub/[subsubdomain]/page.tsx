import { SmartPage } from '@/common/components/app/SmartPage/SmartPage'
import { Box, Button } from '@/common/ui'

export default SmartPage(SubdomainPage)
function SubdomainPage() {
	return (
		<Box display={'flex'} flexDirection={'column'} padding={4} gap={2}>
			Při přesměrování nastala chyba...
			<Box display={'flex'}>
				<Button variant="contained" to="home">
					Jít na domovskou stránku
				</Button>
			</Box>
		</Box>
	)
}

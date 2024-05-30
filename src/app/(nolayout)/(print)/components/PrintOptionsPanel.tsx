import { Checkbox } from '@/common/ui/Checkbox'
import Card from '@/ui/Card/Card'

export default function PrintOptionsPanel() {
	return (
		<Card
			title="Možnosti"
			subtitle="Pokročilé nastavení tisku"
			// icon={<Settings />}
			sx={{
				// backgroundColor: grey[100],
				borderWidth: 1,
				borderColor: 'black',
				borderStyle: 'solid',
				filter: 'drop-shadow(2px 2px 2px rgba(0,0,0,0.2))',
			}}
		>
			{/* <Typography>ahoj</Typography> */}
			<Checkbox label="Zobrazit akordy" checked />
		</Card>
	)
}

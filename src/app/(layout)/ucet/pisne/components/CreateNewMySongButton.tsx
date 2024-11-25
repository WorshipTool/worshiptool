import { Button } from '@/common/ui/Button'
import { Add } from '@mui/icons-material'

export default function CreateNewMySongButton() {
	return (
		<Button color="primarygradient" startIcon={<Add />} to="addMenu">
			Přidat novou
		</Button>
	)
}

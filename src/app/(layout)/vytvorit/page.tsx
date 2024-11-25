'use client'
import { SmartPage } from '@/common/components/app/SmartPage/SmartPage'
import { Box } from '@/common/ui'
import { Edit, UploadFile } from '@mui/icons-material'
import { useApi } from '../../../hooks/api/useApi'
import { useApiStateEffect } from '../../../tech/ApiState'
import { handleApiCall } from '../../../tech/handleApiCall'
import AddMenuItem from './components/AddMenuItem'

export default SmartPage(AddMenu)

function AddMenu() {
	const { songAddingApi } = useApi()

	const [apiState] = useApiStateEffect(() => {
		return handleApiCall(songAddingApi.songAddingControllerIsParserAvailable())
	})

	return (
		<>
			<Box
				sx={{
					width: '100%',
					height: 500,
					display: 'flex',
					justifyContent: 'center',
					alignItems: 'center',
				}}
			>
				<Box
					sx={{
						display: 'flex',
						flexDirection: 'row',
						gap: 5,
					}}
				>
					<AddMenuItem
						disabled={!apiState.data}
						loading={apiState.loading}
						title="Nahrát soubor"
						subtitle="Automaticky převeďte píseň z obrázku"
						icon={<UploadFile fontSize="inherit" />}
						to="upload"
					/>
					<AddMenuItem
						title="Sepsat ručně"
						// subtitle='Použijte editor pro psaní textu písně'
						icon={<Edit fontSize="inherit" />}
						iconSize={40}
						to="writeSong"
					/>
				</Box>
			</Box>
		</>
	)
}

import { mapBasicVariantPackApiToDto } from '@/api/dtos'
import { useInnerPackSong } from '@/app/(layout)/pisen/[hex]/[alias]/hooks/useInnerPack'
import AdminOption from '@/common/components/admin/AdminOption'
import Popup from '@/common/components/Popup/Popup'
import SongListCard from '@/common/components/songLists/SongListCards/SongListCards'
import { Box } from '@/common/ui'
import { useApi } from '@/hooks/api/useApi'
import { useApiStateEffect } from '@/tech/ApiState'
import { handleApiCall } from '@/tech/handleApiCall'
import { AltRoute } from '@mui/icons-material'
import { useState } from 'react'

export default function ShowPackFamilyOption() {
	const [popupOpen, setPopupOpen] = useState(false)

	const { variant } = useInnerPackSong()
	const { packEmbeddingApi } = useApi()

	const [apiState] = useApiStateEffect(async () => {
		const packGuid = variant.packGuid
		const data = await handleApiCall(
			packEmbeddingApi.packEmbeddingSearchControllerFindFamily(packGuid)
		)

		return data
			.filter((v) => v.packGuid !== variant.packGuid)
			.map((v) => mapBasicVariantPackApiToDto(v))
	}, [variant, packEmbeddingApi])

	return (
		<>
			<AdminOption
				title="Zobrazit jiné překlady"
				icon={<AltRoute />}
				onClick={() => setPopupOpen(true)}
			/>

			<Popup
				open={popupOpen}
				onClose={() => setPopupOpen(false)}
				title="Seznam překladů"
				subtitle="Další verze této písně"
				width={500}
			>
				<Box
					maxHeight={700}
					sx={{
						overflowY: 'auto',
						overflowX: 'hidden',
					}}
				>
					<SongListCard data={apiState.data || []} />
				</Box>
			</Popup>
		</>
	)
}

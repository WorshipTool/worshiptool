import { mapBasicVariantPackApiToDto } from '@/api/dtos'
import AdminBreadItem from '@/app/(layout)/sub/admin/components/AdminBreadItem'
import { SmartPage } from '@/common/components/app/SmartPage/SmartPage'
import { Box, Clickable, Typography } from '@/common/ui'
import { Link } from '@/common/ui/Link/Link'
import { useServerApi } from '@/hooks/api/useServerApi'
import { handleServerApiCall } from '@/tech/fetch/handleServerApiCall'
import { parseVariantAlias } from '@/tech/song/variant/variant.utils'

export default SmartPage(Page, [
	'fullWidth',
	'hideFooter',
	'hideMiddleNavigation',
	'darkToolbar',
])

async function Page() {
	const { songGettingApi } = await useServerApi()
	const data = await handleServerApiCall(
		songGettingApi.songGettingControllerGetLastAdded()
	)
	const packs = data.map((p) => mapBasicVariantPackApiToDto(p))
	return (
		<>
			<AdminBreadItem
				label={'Poslední přidané'}
				to={'adminLastAdded'}
				toParams={{}}
			/>
			<Box display={'flex'} flexDirection={'column'} gap={1}>
				{packs.map((pack, index) => (
					<Clickable key={pack.packGuid}>
						<Link to="variant" params={parseVariantAlias(pack.packAlias)}>
							<Box
								key={pack.packGuid}
								sx={{
									bgcolor: 'grey.200',
									display: 'flex',
									gap: 2,
									padding: 2,
								}}
							>
								<Typography strong>{index + 1}</Typography>
								<Typography>{pack.title}</Typography>
							</Box>
						</Link>
					</Clickable>
				))}
			</Box>
		</>
	)
}

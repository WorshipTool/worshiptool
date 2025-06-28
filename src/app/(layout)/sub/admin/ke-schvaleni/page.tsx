'use server'
import { mapBasicVariantPackApiToDto } from '@/api/dtos'
import AdminBreadItem from '@/app/(layout)/sub/admin/components/AdminBreadItem'
import ApprovalItem from '@/app/(layout)/sub/admin/ke-schvaleni/ApprovalItem'
import { SmartPage } from '@/common/components/app/SmartPage/SmartPage'
import { Box, Typography } from '@/common/ui'
import { useServerApi } from '@/hooks/api/useServerApi'
export default SmartPage(Page, [
	'fullWidth',
	'hideFooter',
	'hideMiddleNavigation',
	'darkToolbar',
])

async function Page() {
	const { songPublishingApi } = await useServerApi()

	const data =
		await songPublishingApi.songPublishingControllerGetApprovalPacks()

	const packs = data.map((p) => mapBasicVariantPackApiToDto(p))

	return (
		<>
			<AdminBreadItem
				label={'Ke schválení'}
				to={'adminPublishApproval'}
				toParams={{}}
			/>

			{packs.length > 0 ? (
				<Box
					sx={{
						display: 'flex',
						flexDirection: 'column',
						gap: 1,
					}}
				>
					{packs.map((pack) => (
						<ApprovalItem pack={pack} key={pack.packGuid} />
					))}
				</Box>
			) : (
				<Box>
					<Typography italic>Žádné písně ke zveřejnění</Typography>
				</Box>
			)}
		</>
	)
}

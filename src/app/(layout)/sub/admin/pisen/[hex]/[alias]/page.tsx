'use server'
import { mapExtendedVariantPackApiToDto } from '@/api/dtos'
import AdminSectionCollapsible from '@/app/(layout)/sub/admin/components/AdminSectionCollapsible'
import AdminCopySheetDataButton from '@/app/(layout)/sub/admin/pisen/[hex]/[alias]/components/AdminCopySheetDataButton'
import AdminItem from '@/app/(layout)/sub/admin/pisen/[hex]/[alias]/components/AdminItem'
import AdminMediaSection from '@/app/(layout)/sub/admin/pisen/[hex]/[alias]/components/AdminMediaSection'
import AdminSongPreview from '@/app/(layout)/sub/admin/pisen/[hex]/[alias]/components/AdminSongPreview'
import AdminVerifyButton from '@/app/(layout)/sub/admin/pisen/[hex]/[alias]/components/AdminVerifyButton'
import GGFilterAdminButton from '@/app/(layout)/sub/admin/pisen/[hex]/[alias]/components/GGFilterAdminButton'
import SetTranslationTypeAdminButton from '@/app/(layout)/sub/admin/pisen/[hex]/[alias]/components/SetTranslationTypeAdminButton'
import { SmartPage } from '@/common/components/app/SmartPage/SmartPage'
import { PageProps } from '@/common/types'
import { Box, Button, Gap, Typography } from '@/common/ui'
import { getTranslationData } from '@/common/ui/SongCard/components/tech'
import { useServerApi } from '@/hooks/api/useServerApi'
import { makeVariantAlias } from '@/routes/routes.tech'
import { handleServerApiCall } from '@/tech/fetch/handleServerApiCall'
import { SongLanguage } from '@/types/song'
import { OpenInNew } from '@mui/icons-material'

export default SmartPage(Page, [
	'fullWidth',
	'hideFooter',
	'hideMiddleNavigation',
	'darkToolbar',
])

async function Page(pageProps: PageProps<'adminPack'>) {
	const { songGettingApi } = await useServerApi()

	const alias = makeVariantAlias(pageProps.params.hex, pageProps.params.alias)
	const data = await handleServerApiCall(
		songGettingApi.songOneGettingControllerGetVariantDataByAlias(alias)
	)
	const main = mapExtendedVariantPackApiToDto(data.main)

	const translationData = getTranslationData(
		main.translationType,
		main.language as SongLanguage
	)

	return (
		<Box display={'flex'} gap={2} flexDirection={'column'}>
			<Box display={'flex'} flexDirection={'row'} gap={2}>
				<Typography small color="grey.500">
					Dashboard {'<'} Písně {'<'} {main.title}
				</Typography>
			</Box>
			<Box display={'flex'} flexDirection={'row'} gap={2}>
				<AdminSongPreview width={150} height={150} />

				<Box display={'flex'} flexDirection={'column'} gap={2} padding={2}>
					<Typography variant="h5" strong>
						{main.title}
					</Typography>

					{translationData.message && (
						<Typography>{translationData.message}</Typography>
					)}
				</Box>
			</Box>
			<Gap />

			<AdminCopySheetDataButton />
			<GGFilterAdminButton />
			<SetTranslationTypeAdminButton />
			<AdminVerifyButton />

			<Gap />

			<AdminSectionCollapsible title="Rozšiřující informace">
				<AdminItem title="Jazyk">{main.language as SongLanguage}</AdminItem>
				<AdminItem title="Vyhovuje GG filtru">
					{main.ggValidated ? 'Ano' : 'Ne'}
				</AdminItem>
				<Gap />

				<AdminItem title="PackGuid" value={main.packGuid} />
				<AdminItem title="PackAlias" value={main.packAlias} />
				<AdminItem title="SongGuid" value={main.songGuid} />
			</AdminSectionCollapsible>

			<AdminMediaSection data={data} />

			<Box
				sx={{
					position: 'fixed',
					bottom: 0,
					right: 0,
					padding: 4,
				}}
			>
				<Button
					to="variant"
					toParams={{
						hex: pageProps.params.hex,
						alias: pageProps.params.alias,
					}}
					startIcon={<OpenInNew fontSize="small" />}
					sx={{
						width: 'fit-content',
					}}
					// small
				>
					Přejít na píseň
				</Button>
			</Box>
		</Box>
	)
}

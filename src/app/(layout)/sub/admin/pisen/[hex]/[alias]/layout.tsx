import {
	mapExtendedVariantPackApiToDto,
	mapGetVariantDataApiToSongDto,
} from '@/api/dtos'
import { InnerSongProvider } from '@/app/(layout)/pisen/[hex]/[alias]/hooks/useInnerSong'
import AdminBreadItem from '@/app/(layout)/sub/admin/components/AdminBreadItem'
import { LayoutProps } from '@/common/types'
import { useServerApi } from '@/hooks/api/useServerApi'
import { makeVariantAlias } from '@/routes/routes.tech'
import { handleServerApiCall } from '@/tech/fetch/handleServerApiCall'

export default async function layout(props: LayoutProps<'adminPack'>) {
	const { songGettingApi } = await useServerApi()
	const alias = makeVariantAlias(props.params.hex, props.params.alias)
	const data = await handleServerApiCall(
		songGettingApi.songOneGettingControllerGetVariantDataByAlias(alias)
	)

	const song = mapGetVariantDataApiToSongDto(data)
	const variant = mapExtendedVariantPackApiToDto(data.main)
	return (
		<InnerSongProvider
			startData={{
				song,
				variant,
			}}
			variantAlias={alias}
		>
			<AdminBreadItem label="Písně" to="adminSongs" toParams={{}} />

			<AdminBreadItem
				label={variant.title}
				to="adminPack"
				toParams={props.params}
			/>
			{props.children}
		</InnerSongProvider>
	)
}

import {
	mapBasicSongApiToDto,
	mapExtendedVariantPackApiToDto,
	mapGetVariantDataApiToSongDto,
} from '@/api/dtos'
import { InnerPackProvider } from '@/app/(layout)/pisen/[hex]/[alias]/hooks/useInnerPack'
import { InnerSongProvider } from '@/app/(layout)/pisen/[hex]/[alias]/hooks/useInnerSong'
import AdminBreadItem from '@/app/(layout)/sub/admin/components/AdminBreadItem'
import { LayoutProps } from '@/common/types'
import { useServerApi } from '@/hooks/api/useServerApi'
import { makeVariantAlias } from '@/tech/song/variant/variant.utils'
import { SongGuid } from '@/types/song'

export default async function layout(props: LayoutProps<'adminPack'>) {
	const { songGettingApi } = await useServerApi()
	const alias = makeVariantAlias(props.params.hex, props.params.alias)
	const data =
		await songGettingApi.songOneGettingControllerGetVariantDataByAlias(alias)

	const song = mapGetVariantDataApiToSongDto(data)
	const variant = mapExtendedVariantPackApiToDto(data.main)

	const songData =
		await songGettingApi.songOneGettingControllerGetSongDataByGuid(song.guid)

	const formatted = mapBasicSongApiToDto(songData)
	return (
		<InnerSongProvider startData={formatted} songGuid={song.guid as SongGuid}>
			<InnerPackProvider
				startData={{
					song,
					variant,
				}}
				variantAlias={alias}
			>
				<AdminBreadItem label={'Písně'} to="adminSongs" toParams={{}} />
				<AdminBreadItem
					label={formatted.title}
					to="adminSong"
					toParams={{
						songGuid: formatted.guid,
					}}
				/>
				<AdminBreadItem
					label={variant.title}
					to="adminPack"
					toParams={props.params}
				/>
				{props.children}
			</InnerPackProvider>
		</InnerSongProvider>
	)
}

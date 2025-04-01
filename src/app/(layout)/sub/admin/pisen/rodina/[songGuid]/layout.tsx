import { mapBasicSongApiToDto } from '@/api/dtos'
import { InnerSongProvider } from '@/app/(layout)/pisen/[hex]/[alias]/hooks/useInnerSong'
import AdminBreadItem from '@/app/(layout)/sub/admin/components/AdminBreadItem'
import { LayoutProps } from '@/common/types'
import { useServerApi } from '@/hooks/api/useServerApi'
import { handleServerApiCall } from '@/tech/fetch/handleServerApiCall'
import { SongGuid } from '@/types/song'

export default async function layout(props: LayoutProps<'adminSong'>) {
	const { songGettingApi } = await useServerApi()
	const data = await handleServerApiCall(
		songGettingApi.songOneGettingControllerGetSongDataByGuid(
			props.params.songGuid
		)
	)

	const formatted = mapBasicSongApiToDto(data)

	return (
		<InnerSongProvider
			startData={formatted}
			songGuid={props.params.songGuid as SongGuid}
		>
			<AdminBreadItem label="Písně" to="adminSongs" toParams={{}} />
			<AdminBreadItem
				label={data.title}
				to={'adminSong'}
				toParams={props.params}
			/>
			{props.children}
		</InnerSongProvider>
	)
}

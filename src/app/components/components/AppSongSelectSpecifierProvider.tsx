'use client'
import { mapSongVariantDataOutDtoToSongVariantDto } from '@/api/dtos'
import { SongSelectSpecifierProvider } from '@/common/components/SongSelectPopup/hooks/useSongSelectSpecifier'
import { useApi } from '@/hooks/api/useApi'
import { useApiStateEffect } from '@/tech/ApiState'
import { handleApiCall } from '@/tech/handleApiCall'
import React from 'react'

type AppSongSelectSpecifierProviderProps = {
	children: React.ReactNode
}
export default function AppSongSelectSpecifierProvider(
	props: AppSongSelectSpecifierProviderProps
) {
	const [searchString, setSearchString] = React.useState('')
	const { songGettingApi } = useApi()

	const [globalApiState] = useApiStateEffect(async () => {
		const result = await handleApiCall(
			songGettingApi.songGettingControllerSearchGlobalSongsInPopup(searchString)
		)

		return result.variants.map((v) => {
			return mapSongVariantDataOutDtoToSongVariantDto(v)
		})
	}, [searchString])

	const [usersApiState] = useApiStateEffect(async () => {
		const result = await handleApiCall(
			songGettingApi.songGettingControllerSearchMySongsInPopup(searchString)
		)

		return result.variants.map((v) => {
			return mapSongVariantDataOutDtoToSongVariantDto(v)
		})
	}, [searchString])

	return (
		<SongSelectSpecifierProvider
			customSourceList={[
				{
					label: 'Z globálního zpěvníku',
					apiState: globalApiState,
					onSearch: setSearchString,
				},
				{
					label: 'Z mých písní',
					apiState: usersApiState,
					showCount: true,
					onSearch: setSearchString,
				},
			]}
		>
			{props.children}
		</SongSelectSpecifierProvider>
	)
}

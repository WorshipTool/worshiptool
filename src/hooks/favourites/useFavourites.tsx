import { VariantPackGuid } from '@/api/dtos'
import { useApi } from '@/hooks/api/useApi'
import useAuth from '@/hooks/auth/useAuth'
import { useApiStateEffect } from '@/tech/ApiState'
import { handleApiCall } from '@/tech/handleApiCall'
import { createContext, useContext } from 'react'

type Rt = ReturnType<typeof useProvideFavourites>

const favouritesContext = createContext({ uninitialized: true } as any as Rt)

export const useFavourites = () => {
	const a = useContext(favouritesContext)
	if ((a as any).uninitialized) {
		throw new Error('You have to use FavouritesProvider')
	}
	return a
}

export const FavouritesProvider = ({ children }: { children: any }) => {
	const value = useProvideFavourites()

	return (
		<favouritesContext.Provider value={value}>
			{children}
		</favouritesContext.Provider>
	)
}

const useProvideFavourites = () => {
	const { user } = useAuth()
	const { songFavouritesApi } = useApi()

	const [{ data: favourites, loading: favouritesLoading }, reload] =
		useApiStateEffect(async () => {
			if (!user) return null

			const result = await handleApiCall(
				songFavouritesApi.songFavouritesControllerGetFavourites()
			)
			return result
		}, [user])

	const add = async (packGuid: VariantPackGuid) => {
		const result = await handleApiCall(
			songFavouritesApi.songFavouritesControllerAddFavourite({ packGuid })
		)
		reload()
		return result
	}
	const remove = async (packGuid: VariantPackGuid) => {
		const result = await handleApiCall(
			songFavouritesApi.songFavouritesControllerRemoveFavourite({ packGuid })
		)
		reload()
		return result
	}

	return {
		items: favourites?.items || null,
		loading: favouritesLoading,
		add,
		remove,
		selectionGuid: favourites?.selectionGuid || null,
	}
}

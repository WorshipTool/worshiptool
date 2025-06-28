import { VariantPackGuid } from '@/api/dtos'
import { GetFavouritesOutDto } from '@/api/generated'
import { useApi } from '@/hooks/api/useApi'
import useAuth from '@/hooks/auth/useAuth'
import { useApiState } from '@/tech/ApiState'
import { createContext, useContext, useEffect, useRef, useState } from 'react'

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

	// const { favourites: common } = useCommonData()

	const [favourites, setFavourites] = useState<GetFavouritesOutDto>()

	const { fetchApiState, apiState } = useApiState<GetFavouritesOutDto>()

        const reload = async () => {
                if (!user) return
                const data = await fetchApiState(() =>
                        songFavouritesApi.songFavouritesControllerGetFavourites()
                )
                if (data) setFavourites(data)
	}

	const first = useRef(true)
	useEffect(() => {
		if (first.current) {
			first.current = false
			// return
		}
		reload()
	}, [user])

        const add = async (packGuid: VariantPackGuid) => {
                const result = await songFavouritesApi.songFavouritesControllerAddFavourite({ packGuid })
                reload()
                return result
        }
        const remove = async (packGuid: VariantPackGuid) => {
                const result = await songFavouritesApi.songFavouritesControllerRemoveFavourite({ packGuid })
                reload()
                return result
        }

	return {
		items: favourites?.items || null,
		loading: apiState.loading,
		add,
		remove,
		selectionGuid: favourites?.selectionGuid || null,
	}
}

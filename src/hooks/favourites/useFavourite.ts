import { VariantPackGuid } from '@/api/dtos'
import { useFavourites } from '@/hooks/favourites/useFavourites'
import { useEffect, useMemo, useState } from 'react'

export default function useFavourite(packGuid: VariantPackGuid) {
	const { items } = useFavourites()

	const isFavourite = useMemo(() => {
		return Boolean(items && items.some((item) => item.packGuid === packGuid))
	}, [items, packGuid])

	const [liked, setLiked] = useState(isFavourite)

	useEffect(() => {
		if (items) setLiked(isFavourite)
	}, [isFavourite, items])

	return liked
}

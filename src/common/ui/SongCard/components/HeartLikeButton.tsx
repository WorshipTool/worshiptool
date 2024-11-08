import { VariantPackGuid } from '@/api/dtos'
import { Box } from '@/common/ui/Box'
import { IconButton } from '@/common/ui/IconButton'
import { grey } from '@/common/ui/mui/colors'
import { useFavourites } from '@/hooks/favourites/useFavourites'
import { Favorite, FavoriteBorder } from '@mui/icons-material'
import { useEffect, useMemo, useState } from 'react'

type HeartLikeButtonProps = {
	hideIfNot?: boolean
	packGuid: VariantPackGuid
	interactable?: boolean
	unmountIfNotVisible?: boolean
	small?: boolean
}

export const heartColor = 'rgb(238, 72, 85)'

export default function HeartLikeButton(props: HeartLikeButtonProps) {
	const { items, loading, add, remove } = useFavourites()

	const isFavourite = useMemo(() => {
		return Boolean(
			items && items.some((item) => item.packGuid === props.packGuid)
		)
	}, [items, props.packGuid])

	const [liked, setLiked] = useState(isFavourite)

	useEffect(() => {
		if (items) setLiked(isFavourite)
	}, [isFavourite, items])

	const onClick = () => {
		if (loading) return
		setLiked(!liked)
		if (liked) {
			remove(props.packGuid)
		} else {
			add(props.packGuid)
		}
	}
	// const color = 'grey.700'
	const hidden = props.hideIfNot && !liked
	const color = liked ? heartColor : 'grey.400'
	return props.unmountIfNotVisible && hidden ? null : (
		<Box
			sx={{
				opacity: hidden ? 0 : 1,
				transition: 'all 0.2s',
			}}
			onClick={(e) => {
				e.stopPropagation()
				e.preventDefault()
			}}
		>
			{props.interactable ? (
				<IconButton
					onClick={(e) => {
						e.stopPropagation()
						e.preventDefault()
						onClick()
					}}
					color={color}
					sx={{
						stroke: grey[200],
						strokeWidth: liked ? 0 : 1,
						'&:hover': props.interactable
							? {
									strokeWidth: 0,
							  }
							: {},
					}}
					disabled={(loading && !liked) || !props.interactable}
					tooltip={liked ? 'Odebrat z oblíbených' : 'Přidat do oblíbených'}
					size={props.small ? 'small' : undefined}
				>
					{liked ? <Favorite /> : <FavoriteBorder />}
					{/* {liked ? <Bookmark /> : <BookmarkBorder />} */}
				</IconButton>
			) : (
				<Box color={color}>{liked ? <Favorite /> : <FavoriteBorder />}</Box>
			)}
		</Box>
	)
}

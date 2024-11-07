import { VariantPackGuid } from '@/api/dtos'
import { Box } from '@/common/ui/Box'
import { IconButton } from '@/common/ui/IconButton'
import { grey } from '@/common/ui/mui/colors'
import { useFavourites } from '@/hooks/favourites/useFavourites'
import { Favorite, FavoriteBorder } from '@mui/icons-material'
import { useEffect, useMemo, useState } from 'react'

type HeartLikeButtonProps = {
	isOver?: boolean
	packGuid: VariantPackGuid
}

export default function HeartLikeButton(props: HeartLikeButtonProps) {
	const [liked, setLiked] = useState(false)

	const { items, loading, add, remove } = useFavourites()

	const isFavourite = useMemo(() => {
		return Boolean(
			items && items.some((item) => item.packGuid === props.packGuid)
		)
	}, [items, props.packGuid])

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
	const color = 'rgb(238, 72, 85)'
	// const color = 'grey.700'
	const moveOffset = '0.5rem'

	return (
		<Box
			sx={{
				transform: `translateY(${moveOffset}) translateX(${moveOffset})`,
				opacity: props.isOver || liked ? 1 : 0,
				transition: 'all 0.2s',
			}}
		>
			<IconButton
				onClick={(e) => {
					e.stopPropagation()
					e.preventDefault()
					onClick()
				}}
				color={liked ? color : 'grey.400'}
				sx={{
					stroke: grey[200],
					strokeWidth: liked ? 0 : 1,
					'&:hover': {
						strokeWidth: 0,
					},
				}}
				disabled={loading && !liked}
			>
				{liked ? <Favorite /> : <FavoriteBorder />}
				{/* {liked ? <Bookmark /> : <BookmarkBorder />} */}
			</IconButton>
		</Box>
	)
}

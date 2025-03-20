import { PackGuid } from '@/api/dtos'
import { useTranslationsLikes } from '@/common/ui/SongCard/hooks/useTranslationsLikes'

export default function useTranslationLike(packGuid: PackGuid) {
	const t = useTranslationsLikes()

	const addLike = () => {
		return t.addLike(packGuid)
	}

	const removeLike = () => {
		return t.removeLike(packGuid)
	}

	return {
		isLiked: t.data.some((tl) => tl.packGuid === packGuid),
		addLike,
		removeLike,
	}
}

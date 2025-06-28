import { PackGuid } from '@/api/dtos'
import { mapTranslationLikeApiToDto } from '@/api/map/translation-like.map'
import { useApi } from '@/api/tech-and-hooks/useApi'
import {
	getTranslationLikeCountDecreaseEventName,
	getTranslationLikeCountIncreaseEventName,
} from '@/common/ui/SongCard/hooks/useTranslationLikesCount'
import useAuth from '@/hooks/auth/useAuth'
import { TranslationLike } from '@/hooks/common-data/common-data.types'
import { useCommonData } from '@/hooks/common-data/useCommonData'
import { createContext, useContext, useEffect, useRef, useState } from 'react'

type Rt = ReturnType<typeof useProvideTranslationsLikes>
const context = createContext({ uninitialized: true } as any as Rt)

export const TranslationLikesProvider = ({ children }: { children: any }) => {
	const value = useProvideTranslationsLikes()

	return <context.Provider value={value}>{children}</context.Provider>
}

export const useTranslationsLikes = () => {
	const a = useContext(context)

	if ((a as any).uninitialized) {
		throw new Error('You have to use TranslationLikesProvider')
	}

	return a
}

export function useProvideTranslationsLikes() {
	const t = useCommonData('translationLikes')

	const [data, setData] = useState(t)

	const { songUserManagementApi } = useApi()

	const addLike = async (packGuid: PackGuid) => {
		const r =
			await songUserManagementApi.songTranslationLikeControllerAddUserLikeToTranslation(
				{
					packGuid: packGuid,
				}
			)

		validate(r.likes.map((v) => mapTranslationLikeApiToDto(v)))
	}
	const removeLike = async (packGuid: PackGuid) => {
		const r =
			await songUserManagementApi.songTranslationLikeControllerRemoveUserLikeFromTranslation(
				{
					packGuid: packGuid,
				}
			)
		const newData = validate(r.likes.map((v) => mapTranslationLikeApiToDto(v)))
	}

	/** Do smart reload on user change */
	const reload = async () => {
		const r =
			await songUserManagementApi.songTranslationLikeControllerGetUserLikes()

		validate(r.likes.map((v) => mapTranslationLikeApiToDto(v)))
	}

	const first = useRef(true)
	const { user } = useAuth()
	useEffect(() => {
		if (first.current) {
			first.current = false
			return
		}

		reload()
	}, [user, first])

	// Send event to likes count change
	const validate = (newData: TranslationLike[]) => {
		// found what is new like and what like is removed
		const newLikes = newData.filter(
			(newLike) => !data.some((like) => like.packGuid === newLike.packGuid)
		)
		const removedLikes = data.filter(
			(like) => !newData.some((newLike) => newLike.packGuid === like.packGuid)
		)

		for (const like of newLikes) {
			window.dispatchEvent(
				new CustomEvent(
					getTranslationLikeCountIncreaseEventName(like.packGuid),
					{ detail: like }
				)
			)
		}

		for (const like of removedLikes) {
			window.dispatchEvent(
				new CustomEvent(
					getTranslationLikeCountDecreaseEventName(like.packGuid),
					{ detail: like }
				)
			)
		}

		setData(newData)
	}

	return {
		data,
		addLike,
		removeLike,
	}
}

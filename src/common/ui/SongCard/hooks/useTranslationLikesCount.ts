import { PackGuid } from '@/api/dtos'
import { useEffect, useState } from 'react'

export const getTranslationLikeCountIncreaseEventName = (packGuid: PackGuid) =>
	'tlcien' + packGuid
export const getTranslationLikeCountDecreaseEventName = (packGuid: PackGuid) =>
	'tlcden' + packGuid

export const useTranslationLikesCount = (
	packGuid: PackGuid,
	innerValue?: number
) => {
	const TRANSLATION_LIKE_COUNT_INCREASE_EVENT_NAME =
		getTranslationLikeCountIncreaseEventName(packGuid)
	const TRANSLATION_LIKE_COUNT_DECREASE_EVENT_NAME =
		getTranslationLikeCountDecreaseEventName(packGuid)

	const [value, setValue] = useState(parseInt(innerValue + '') || 0)

	const increase = (increase: boolean) => {
		setValue((prev) => prev + (increase ? 1 : -1))
	}

	useEffect(() => {
		const increaseHandler = () => increase(true)
		const decreaseHandler = () => increase(false)

		window.addEventListener(
			TRANSLATION_LIKE_COUNT_INCREASE_EVENT_NAME,
			increaseHandler
		)
		window.addEventListener(
			TRANSLATION_LIKE_COUNT_DECREASE_EVENT_NAME,
			decreaseHandler
		)

		return () => {
			window.removeEventListener(
				TRANSLATION_LIKE_COUNT_INCREASE_EVENT_NAME,
				increaseHandler
			)
			window.removeEventListener(
				TRANSLATION_LIKE_COUNT_DECREASE_EVENT_NAME,
				decreaseHandler
			)
		}
	}, [])

	return value
}

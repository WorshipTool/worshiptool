import { BACKEND_URL } from '@/api/constants'
import {
	ImagesApiAxiosParamCreator,
	TeamEditingApiAxiosParamCreator,
} from '@/api/generated'
import { getUrl } from '@/api/urls'
import useInnerTeam from '@/app/(submodules)/(teams)/sub/tymy/hooks/useInnerTeam'
import useAuth from '@/hooks/auth/useAuth'
import { useApiStateEffect } from '@/tech/ApiState'
import { useMemo } from 'react'

export const EVENT_NAME_CHANGE_TEAM_LOGO = 'changeTeamLogo'

export const useTeamLogo = () => {
	const { apiState } = useInnerTeam()
	const { apiConfiguration } = useAuth()

	const hasLogo = useMemo(() => Boolean(apiState.data?.logoGuid), [apiState])

	const imagesApiCreator = ImagesApiAxiosParamCreator({
		isJsonMime: () => true,
	})

	const teamEditingCreator = TeamEditingApiAxiosParamCreator({
		...apiConfiguration,
		isJsonMime: () => true,
	})

	const [asyncLogo] = useApiStateEffect(async () => {
		if (!hasLogo) return ''
		return (
			BACKEND_URL +
			(
				await imagesApiCreator.imagesControllerGetImage(
					apiState.data?.logoGuid!
				)
			).url
		)
	}, [apiState, hasLogo])

	const url = useMemo(() => {
		if (!hasLogo || !asyncLogo.data)
			return 'https://cdn0.iconfinder.com/data/icons/social-media-glyph-1/64/Facebook_Social_Media_User_Interface-38-512.png'
		return asyncLogo.data
	}, [apiState, hasLogo, asyncLogo])

	// const { imagesApi } = useApi()
	const changeLogo = async (file: File) => {
		if (!apiState.data) return

		// 1. Prepare form data
		const form = new FormData()
		form.append('file', file, file.name)
		form.append('teamGuid', apiState.data?.guid!)

		// 2. Get url
		const pre = await teamEditingCreator.teamEditingControllerChangeTeamLogo()
		const partUrl = pre.url
		const wholeUrl = getUrl(partUrl)

		// 3. Send request
		await fetch(wholeUrl, {
			method: 'POST',
			body: form,
			headers: {
				Authorization: pre.options.headers?.Authorization,
			},
		})
			.then(() => {
				window.dispatchEvent(new Event(EVENT_NAME_CHANGE_TEAM_LOGO))
			})
			.catch((error) => {})
	}
	return {
		logoUrl: url,
		loading: asyncLogo.loading,
		hasLogo,
		changeLogo,
	}
}

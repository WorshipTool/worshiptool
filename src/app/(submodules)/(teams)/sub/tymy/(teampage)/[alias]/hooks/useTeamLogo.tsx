import { BACKEND_URL } from '@/api/constants'
import {
	ImagesApiAxiosParamCreator,
	TeamEditingApiAxiosParamCreator,
} from '@/api/generated'
import { getUrl } from '@/api/urls'
import useInnerTeam from '@/app/(submodules)/(teams)/sub/tymy/(teampage)/hooks/useInnerTeam'
import useAuth from '@/hooks/auth/useAuth'
import { useApiStateEffect } from '@/tech/ApiState'
import { PICTURE_SIZE_LIMIT } from '@/tech/files/picture.tech'
import { getIconUrl } from '@/tech/paths.tech'
import { enqueueSnackbar } from 'notistack'
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
			(await imagesApiCreator.getImage(apiState.data?.logoGuid!)).url
		)
	}, [apiState, hasLogo])

	const url = useMemo(() => {
		if (!hasLogo || !asyncLogo.data) return getIconUrl('team-default.webp')
		return asyncLogo.data
	}, [apiState, hasLogo, asyncLogo])

	// const { imagesApi } = useApi()
	const changeLogo = async (file: File) => {
		if (!apiState.data) return

		// 0. Check logo size
		if (file.size > PICTURE_SIZE_LIMIT) {
			enqueueSnackbar('Obrázek je příliš velký (64KB max)')
			return
		}

		// 1. Prepare form data
		const form = new FormData()
		form.append('file', file, file.name)
		form.append('teamGuid', apiState.data?.guid!)

		// 2. Get url
		const pre = await teamEditingCreator.changeTeamLogo()
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

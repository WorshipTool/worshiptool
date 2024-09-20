import { routesPaths } from '@/routes/routes'
import { getReplacedUrlWithParams } from '@/routes/routes.tech'
import { RoutesKeys, SmartAllParams } from '@/routes/routes.types'
import { redirect } from 'next/navigation'

export const smartRedirect = <T extends RoutesKeys>(
	to:
		| T
		| {
				url: string
		  },
	params: SmartAllParams<T>
) => {
	const toUrl = typeof to === 'string' ? routesPaths[to] : to.url
	const urlWithParams =
		Object.keys(params).length > 0
			? getReplacedUrlWithParams(toUrl, params)
			: toUrl

	redirect(urlWithParams)
}

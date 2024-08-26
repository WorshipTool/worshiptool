// import { useNavigate } from "react-router-dom";
import { NavigateOptions as NO } from 'next/dist/shared/lib/app-router-context.shared-runtime'
import { useRouter } from 'next/navigation'
import { getReplacedUrlWithParams, routesPaths } from './routes'
import { RoutesKeys, SmartAllParams } from './routes.types'

type NavigateOptions = NO & {
	replace: boolean
}
//TODO: use replace

export const useSmartNavigate = () => {
	const router = useRouter()
	const navigate = <T extends RoutesKeys>(
		to:
			| T
			| {
					url: string
			  },
		params: SmartAllParams<T>,
		options?: NavigateOptions
	) => {
		const toUrl = typeof to === 'string' ? routesPaths[to] : to.url
		const urlWithParams =
			Object.keys(params).length > 0
				? getReplacedUrlWithParams(toUrl, params)
				: toUrl

		router.push(urlWithParams)
	}

	return navigate
}

import { SmartPageInnerProvider } from '@/common/components/app/SmartPage/SmartPageInner'

export type SmartPageOptions = {
	transparentToolbar: boolean
	whiteToolbarVersion: boolean
	hideMiddleNavigation: boolean
	hideTitle: boolean
	hideFooter: boolean
	hideToolbar: boolean
	fullWidth: boolean
}

type OptionsArray = Array<keyof SmartPageOptions>

export function SmartPage<T>(
	PageComponent: (props: T) => JSX.Element | null | Promise<JSX.Element>,
	pageOptions?: Partial<SmartPageOptions> | OptionsArray
) {
	const options: Partial<SmartPageOptions> = Array.isArray(pageOptions)
		? pageOptions.reduce((acc, key) => ({ ...acc, [key]: true }), {})
		: pageOptions || {}
	return function SmartPageFunctionName(props: T) {
		return (
			<SmartPageInnerProvider pageOptions={options}>
				{PageComponent(props)}
			</SmartPageInnerProvider>
		)
	}
}

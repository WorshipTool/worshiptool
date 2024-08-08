import {
	SmartPageInnerProvider,
	SmartPageOptions,
} from '@/common/components/app/SmartPage/SmartPageInner'

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

import {
	SmartTeamPageInnerProvider,
	SmartTeamPageOptions,
} from '@/app/(submodules)/(teams)/sub/tymy/[alias]/components/SmartTeamPage/SmartTeamInnerProvider'
type OptionsArray = Array<keyof SmartTeamPageOptions>

export function SmartTeamPage<T>(
	PageComponent: (props: T) => JSX.Element | null | Promise<JSX.Element>,
	pageOptions?: Partial<SmartTeamPageOptions> | OptionsArray
) {
	const options: Partial<SmartTeamPageOptions> = Array.isArray(pageOptions)
		? pageOptions.reduce((acc, key) => ({ ...acc, [key]: true }), {})
		: pageOptions || {}
	return function SmartPageFunctionName(props: T) {
		return (
			<SmartTeamPageInnerProvider pageOptions={options}>
				{PageComponent(props)}
			</SmartTeamPageInnerProvider>
		)
	}
}

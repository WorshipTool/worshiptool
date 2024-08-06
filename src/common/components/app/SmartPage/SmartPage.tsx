import { SmartPageInnerProvider } from '@/common/components/app/SmartPage/SmartPageInner'

export type SmartPageOptions = {
	transparentToolbar: boolean
}

export function SmartPage<T>(
	PageComponent: (props: T) => JSX.Element | null | Promise<JSX.Element>,
	pageOptions?: Partial<SmartPageOptions>
) {
	return function SmartPageFunctionName(props: T) {
		return (
			<SmartPageInnerProvider pageOptions={pageOptions}>
				{PageComponent(props)}
			</SmartPageInnerProvider>
		)
	}
}

// export const SmartPage = (PageComponent: React.FC) => {
// 	return () => {
// 		return <PageComponent />
// 	}
// }

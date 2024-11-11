import AppLayout from '@/common/components/app/AppLayout/AppLayout'
import LoadingRoutesProvider from './components/LoadingRoutesProvider'

type AppContainerProps = {
	children: React.ReactNode
}

export function AppContainer(props: AppContainerProps) {
	return (
		<>
			{/* <Snow /> */}
			{/* <SearchGroupDialog /> */}
			<LoadingRoutesProvider>
				<AppLayout>{props.children}</AppLayout>
			</LoadingRoutesProvider>
		</>
	)
}

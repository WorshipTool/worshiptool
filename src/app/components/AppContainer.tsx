import AppLayout from '@/common/components/app/AppLayout/AppLayout'
import { checkFlag } from '@/common/providers/FeatureFlags/flags.tech'
import LoadingRoutesProvider from './components/LoadingRoutesProvider'

type AppContainerProps = {
	children: React.ReactNode
}

export async function AppContainer(props: AppContainerProps) {
	const showLoadingScreen = await checkFlag('show_loading_screen')
	return (
		<>
			{/* <Snow /> */}
			<LoadingRoutesProvider show={showLoadingScreen}>
				<AppLayout>{props.children}</AppLayout>
			</LoadingRoutesProvider>
		</>
	)
}

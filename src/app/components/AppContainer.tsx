import AppLayout from '@/common/components/app/AppLayout/AppLayout'
import { getCloudConfig } from '@/common/providers/FeatureFlags/cloud-config/cloud-config.tech'
import LoadingRoutesProvider from './components/LoadingRoutesProvider'

type AppContainerProps = {
	children: React.ReactNode
}

export async function AppContainer(props: AppContainerProps) {
	const showLoadingScreen = await getCloudConfig(
		'basic',
		'SHOW_LOADING_SCREEN',
		true
	)
	return (
		<>
			{/* <Snow /> */}
			<LoadingRoutesProvider show={showLoadingScreen}>
				<AppLayout>{props.children}</AppLayout>
			</LoadingRoutesProvider>
		</>
	)
}

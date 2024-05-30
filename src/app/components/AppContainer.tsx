import { Background } from '@/common/components'
import AppLayout from '../../common/components/app/AppLayout/AppLayout'
import Snow from '../../common/components/Snow'
import SearchGroupDialog from '../../common/components/Toolbar/components/Toolsmenu/components/SearchGroupDialog'
import LoadingRoutesProvider from './components/LoadingRoutesProvider'

type AppContainerProps = {
	children: React.ReactNode
}

export function AppContainer(props: AppContainerProps) {
	return (
		<>
			<Background />

			<Snow />
			<SearchGroupDialog />
			<LoadingRoutesProvider>
				<AppLayout>{props.children}</AppLayout>
			</LoadingRoutesProvider>
		</>
	)
}

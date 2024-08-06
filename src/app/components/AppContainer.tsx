import { Background } from '@/common/components'
import SearchGroupDialog from '@/common/components/Toolbar/components/RightAccountPanel/Toolsmenu/components/SearchGroupDialog'
import Snow from '../../common/components/Snow'
import AppLayout from '../../common/components/app/AppLayout/AppLayout'
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

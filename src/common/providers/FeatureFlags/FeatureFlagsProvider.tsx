import { configcatApiKey } from '@/common/providers/FeatureFlags/flags.tech'
import {
	ConfigCatProvider,
	createConsoleLogger,
	LogLevel,
} from 'configcat-react'
import { isDevelopment } from '../../../tech/development.tech'

type Props = {
	children: React.ReactNode
}

export function FeatureFlagsProvider(props: Props) {
	const logger = isDevelopment ? createConsoleLogger(LogLevel.Info) : undefined
	return (
		<>
			<ConfigCatProvider sdkKey={configcatApiKey} options={{ logger }}>
				{props.children}
			</ConfigCatProvider>
		</>
	)
}

import { configcatApiKey } from '@/common/providers/FeatureFlags/flags.tech'
import {
	ConfigCatProvider,
	createConsoleLogger,
	LogLevel,
} from 'configcat-react'

type Props = {
	children: React.ReactNode
}

export function FeatureFlagsProvider(props: Props) {
	const logger = createConsoleLogger(LogLevel.Error)
	return (
		<>
			<ConfigCatProvider sdkKey={configcatApiKey} options={{ logger }}>
				{props.children}
			</ConfigCatProvider>
		</>
	)
}

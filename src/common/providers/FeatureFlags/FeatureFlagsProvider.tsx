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
	const logger = createConsoleLogger(LogLevel.Info) // Set the log level to INFO to track how your feature flags were evaluated. When moving to production, you can remove this line to avoid too detailed logging.

	return (
		<>
			<ConfigCatProvider sdkKey={configcatApiKey} options={{ logger }}>
				{props.children}
			</ConfigCatProvider>
		</>
	)
}

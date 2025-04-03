import {
	BASIC_CLOUD_CONFIG_NAME,
	BasicCloudConfig,
} from '@/common/providers/FeatureFlags/cloud-config/cloud-config.types'
import { useDynamicConfig } from '@statsig/react-bindings'

/**
 * Hook to get the value of a cloud prop (Dynamic config value) typed boolean.
 */
export const useCloudConfig = <T extends keyof BasicCloudConfig>(
	key: T,
	defaultValue: BasicCloudConfig[T]
): BasicCloudConfig[T] => {
	const a = useDynamicConfig(BASIC_CLOUD_CONFIG_NAME)

	// const [value, setValue] = useState<CloudConfig[T]>(defaultValue)

	// useEffect(() => {
	// 	const v = a.get<CloudConfig[T]>(key as string, defaultValue)
	// 	console.log('a.get', v, key, a)
	// 	setValue(v)
	// }, [a, key, defaultValue])

	return (a.value[key] as BasicCloudConfig[T]) ?? defaultValue
}

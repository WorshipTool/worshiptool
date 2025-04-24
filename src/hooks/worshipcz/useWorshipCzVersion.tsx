import { useCloudConfig } from '@/common/providers/FeatureFlags/cloud-config/useCloudConfig'

export default function useWorshipCzVersion() {
	return useCloudConfig('basic', 'USE_WORSHIP_CZ_VERSION', false)
}

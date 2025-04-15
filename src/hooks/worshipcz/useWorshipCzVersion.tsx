import { useCloudConfig } from '@/common/providers/FeatureFlags/cloud-config/useCloudConfig'

export default function useWorshipCzVersion() {
	return useCloudConfig('USE_WORSHIP_CZ_VERSION', false)
}

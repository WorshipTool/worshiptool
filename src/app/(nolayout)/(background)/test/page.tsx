import { FeatureFlagsProvider } from '@/common/providers/FeatureFlags/FeatureFlagsProvider'
import FlagProtected from '@/common/providers/FeatureFlags/FlagProtected'
import { Box } from '@/common/ui'

export default async function page() {
	return (
		<FeatureFlagsProvider>
			<Box display={'flex'} flexDirection={'column'} gap={1}>
				holahej
				<FlagProtected flag={'test1'}>
					<Box>Alohaa jeaah</Box>
				</FlagProtected>
			</Box>
		</FeatureFlagsProvider>
	)
}

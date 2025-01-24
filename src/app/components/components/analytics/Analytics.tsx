import { GoogleAnalytics } from '@/app/components/components/analytics/GoogleAnalytics'
import HotjarAnalytics from '@/app/components/components/analytics/HotjarAnalytics'
import MixPanelAnalytics from '@/app/components/components/analytics/mixpanel/MixPanelAnalytics'

export default function Analytics() {
	return (
		<>
			<GoogleAnalytics />
			<HotjarAnalytics />
			<MixPanelAnalytics />
		</>
	)
}

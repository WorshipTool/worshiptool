import {
	AnalyticsEventNameType,
	AnalyticsTrackDataType,
} from '@/app/components/components/analytics/analytics.types'
import mixpanel from 'mixpanel-browser'

const track = <T extends AnalyticsEventNameType>(
	eventName: T,
	data: AnalyticsTrackDataType<T>
) => {
	if (!(mixpanel as any).__loaded) {
		console.error(
			'MixPanelAnalytics not initialized. Cannot track event',
			eventName
		)
		return
	} else {
		mixpanel.track(eventName, data)
	}
}

export const Analytics = {
	track,
}

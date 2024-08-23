import {
	AnalyticsEventNameType,
	AnalyticsTrackDataType,
} from '@/app/components/components/analytics/analytics.types'
import mixpanel from 'mixpanel-browser'

const track = <T extends AnalyticsEventNameType>(
	eventName: T,
	data: AnalyticsTrackDataType<T>
) => {
	mixpanel.track(eventName, data)
}

export const Analytics = {
	track,
}

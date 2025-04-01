import { VariantPackGuid } from '@/api/dtos'

export const AnalyticsTrackEventNames: Record<AnalyticsEventNameType, string> =
	{
		VISIT_SONG: 'VISIT_SONG',
	}

export type AnalyticsTrackData = {
	VISIT_SONG: {
		songGuid: string
		packGuid: VariantPackGuid
		title: string
		hasChords: boolean
	}
}

export type AnalyticsEventNameType = keyof AnalyticsTrackData
export type AnalyticsTrackDataType<T extends AnalyticsEventNameType> =
	AnalyticsTrackData[T]

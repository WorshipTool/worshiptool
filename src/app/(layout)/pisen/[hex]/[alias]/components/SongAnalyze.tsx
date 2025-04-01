'use client'
import { Analytics } from '@/app/components/components/analytics/analytics.tech'
import { ExtendedVariantPack } from '@/types/song'
import { Sheet } from '@pepavlin/sheet-api'
import { useEffect } from 'react'

type SongAnalyzeProps = {
	data: ExtendedVariantPack
}

export default function SongAnalyze({ data }: SongAnalyzeProps) {
	useEffect(() => {
		const s = new Sheet(data.sheetData)
		Analytics.track('VISIT_SONG', {
			songGuid: data.songGuid,
			packGuid: data.packGuid,
			title: data.title,
			hasChords: s.getKeyNote() !== null,
		})
	}, [])
	return null
}

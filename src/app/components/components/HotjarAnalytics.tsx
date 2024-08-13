'use client'
import { useEffect } from 'react'
import { hotjar } from 'react-hotjar'

export default function HotjarAnalytics() {
	useEffect(() => {
		hotjar.initialize({ id: 5093964, sv: 6 })
	}, [])

	return null
}

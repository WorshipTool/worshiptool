import { useEffect, useState } from 'react'

export const useClientHostname = () => {
	const [hostname, setHostname] = useState('')

	useEffect(() => {
		setHostname(window.location.hostname)
	}, [])

	return hostname
}

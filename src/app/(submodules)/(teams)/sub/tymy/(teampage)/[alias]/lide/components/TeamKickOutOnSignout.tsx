'use client'

import useAuth from '@/hooks/auth/useAuth'
import { useEffect } from 'react'

export default function TeamKickOutOnSignout() {
	const { isLoggedIn } = useAuth()

	useEffect(() => {
		if (!isLoggedIn()) {
			window.location.reload()
		}
	}, [isLoggedIn()])
	return <></>
}

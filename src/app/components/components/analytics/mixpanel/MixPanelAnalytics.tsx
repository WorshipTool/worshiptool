'use client'
import useAuth from '@/hooks/auth/useAuth'
import { ROLES } from '@/interfaces/user'
import mixpanel from 'mixpanel-browser'
import { useEffect } from 'react'
export default function MixPanelAnalytics() {
	const { user } = useAuth()

	useEffect(() => {
		mixpanel.init('24badb161d131f1852a9a1e527030e04')
	}, [])

	useEffect(() => {
		if (user) {
			mixpanel.identify(user.guid)
			mixpanel.people.set({
				$email: user.email,
				$first_name: user.firstName,
				$last_name: user.lastName,
				role: user.role === ROLES.User ? 'User' : 'Admin',
			})
		} else {
			mixpanel.reset()
		}
	}, [user])

	return null
}

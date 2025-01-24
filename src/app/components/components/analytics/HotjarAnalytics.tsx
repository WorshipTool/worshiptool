'use client'
import useAuth from '@/hooks/auth/useAuth'
import { ROLES } from '@/interfaces/user'
import { useEffect } from 'react'
import { hotjar } from 'react-hotjar'

export default function HotjarAnalytics() {
	useEffect(() => {
		hotjar.initialize({ id: 5093964, sv: 6 })
	}, [])

	const { user } = useAuth()

	useEffect(() => {
		if (!hotjar.initialized()) return

		if (user) {
			const name = user.firstName + ' ' + user.lastName

			hotjar.identify(user.guid, {
				name,
				email: user.email,
				role: user.role === ROLES.User ? 'User' : 'Admin',
			})
		} else {
			hotjar.identify(null, {})
		}
	}, [user])

	return null
}

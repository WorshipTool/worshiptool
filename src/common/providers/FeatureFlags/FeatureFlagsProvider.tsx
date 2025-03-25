'use client'
import { userDtoToStatsigUser } from '@/common/providers/FeatureFlags/flags.tech'
import useAuth from '@/hooks/auth/useAuth'
import { StatsigProvider, useClientAsyncInit } from '@statsig/react-bindings'
import { useEffect, useState } from 'react'

type Props = {
	children: React.ReactNode
}

export function FeatureFlagsProvider(props: Props) {
	const { user } = useAuth()

	const [userData, setUserData] = useState({})

	useEffect(() => {
		if (user) {
			setUserData(userDtoToStatsigUser(user))
		} else {
			setUserData({})
		}
	}, [user])

	const { client } = useClientAsyncInit(
		'client-GOgms4XNEEcqTZIdb8HglbeeQXITNSUPGQkOMD0nPFV',
		userData
	)
	return (
		<>
			<StatsigProvider client={client}>{props.children}</StatsigProvider>
		</>
	)
}

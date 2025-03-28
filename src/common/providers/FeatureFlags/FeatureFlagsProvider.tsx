'use client'
import { userDtoToStatsigUser } from '@/common/providers/FeatureFlags/flags.tech'
import useAuth from '@/hooks/auth/useAuth'
import { StatsigProvider, useClientAsyncInit } from '@statsig/react-bindings'
import { StatsigSessionReplayPlugin } from '@statsig/session-replay'
import { StatsigAutoCapturePlugin } from '@statsig/web-analytics'
import { useEffect } from 'react'
type Props = {
	children: React.ReactNode
}

export function FeatureFlagsProvider(props: Props) {
	const { user } = useAuth()

	const { client } = useClientAsyncInit(
		'client-GOgms4XNEEcqTZIdb8HglbeeQXITNSUPGQkOMD0nPFV',
		{},
		{
			plugins: [
				new StatsigAutoCapturePlugin(),
				new StatsigSessionReplayPlugin(),
			],
		}
	)

	useEffect(() => {
		if (user) {
			const data = userDtoToStatsigUser(user)
			client.updateUserAsync(data)
		} else {
			client.updateUserAsync({})
		}
	}, [user])

	return (
		<>
			<StatsigProvider client={client}>{props.children}</StatsigProvider>
		</>
	)
}

import { checkFlag } from '@/common/providers/FeatureFlags/flags.tech'
import { FeatureFlag } from '@/common/providers/FeatureFlags/flags.types'
import { getServerUser } from '@/tech/auth/getServerUser'
import React from 'react'

type Props = {
	children: React.ReactNode
	flag: FeatureFlag
}

export default async function FlagProtectedServer(props: Props) {
	const user = getServerUser()
	const value = await checkFlag(props.flag, user)

	return value ? <>{props.children}</> : null
}

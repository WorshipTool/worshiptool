import { checkFlag } from '@/common/providers/FeatureFlags/flags.tech'
import { FeatureFlag } from '@/common/providers/FeatureFlags/flags.types'
import React from 'react'

type Props = {
	children: React.ReactNode
	flag: FeatureFlag
}

export default async function FlagProtectedServer(props: Props) {
	const value = await checkFlag(props.flag)
	return value ? <>{props.children}</> : null
}

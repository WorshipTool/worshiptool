import { FeatureFlag } from '@/common/providers/FeatureFlags/flags.types'
import { useFlag } from '@/common/providers/FeatureFlags/useFlag'
import React from 'react'

type Props = {
	children: React.ReactNode
	flag: FeatureFlag
}

export default function FlagProtected(props: Props) {
	const { value } = useFlag(props.flag)
	return value ? <>{props.children}</> : null
}

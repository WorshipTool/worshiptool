import React, { useEffect } from 'react'
import useAuth from '../../../../hooks/auth/useAuth'
import useGroup from '../../../../hooks/group/useGroup'
import { useWindowTitle } from '../../../../hooks/window-title/useWindowTitle'
import { useSmartNavigate } from '../../../../routes/useSmartNavigate'
import { useSmartParams } from '../../../../routes/useSmartParams'
import GroupHome from './GroupHome'

type GroupCustomLayoutProps = {
	children: React.ReactNode
}

export default function GroupCustomLayout(props: GroupCustomLayoutProps) {
	const { groupCode } = useSmartParams('group')
	const { turnOn, turnOff, isOn, name } = useGroup()
	const { isLoggedIn } = useAuth()
	const navigate = useSmartNavigate()

	useWindowTitle(name)

	useEffect(() => {
		if (!isLoggedIn())
			navigate('login', {
				previousPage: window.location.pathname,
				message: 'Pro zobrazení skupiny se musíte přihlásit.',
			})
	}, [isLoggedIn()])

	useEffect(() => {
		if (groupCode === undefined) {
			turnOff()
		} else {
			turnOn(groupCode)
		}
	}, [groupCode])
	return <GroupHome>{props.children}</GroupHome>
}

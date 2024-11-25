'use client'
import { SmartPage } from '@/common/components/app/SmartPage/SmartPage'
import { ReactNode, useEffect } from 'react'
// import { Route, Routes, useMatch } from "react-router-dom";

type GroupHomeProps = {
	children: ReactNode
}

export default SmartPage(GroupHome)

function GroupHome(props: GroupHomeProps) {
	useEffect(() => {
		window.scroll({
			top: 0,
			behavior: 'auto',
		})
	}, [])
	return <div>{props.children}</div>
}

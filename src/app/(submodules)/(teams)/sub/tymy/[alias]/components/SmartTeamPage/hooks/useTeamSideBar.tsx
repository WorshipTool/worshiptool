import { createContext, useCallback, useContext, useState } from 'react'

type FooterType = ReturnType<typeof useTeamSideBarProvide>

const sidebarContext = createContext({} as FooterType)

export const useTeamSideBar = () => {
	const c = useContext(sidebarContext)
	if (!c) {
		throw new Error('useFooter must be used within FooterProvider')
	}
	return c
}

export const TeamSideBarProvider = ({
	children,
}: {
	children: React.ReactNode
}) => {
	const v = useTeamSideBarProvide()

	return <sidebarContext.Provider value={v}>{children}</sidebarContext.Provider>
}

const useTeamSideBarProvide = () => {
	const [collapsed, setCollapsed] = useState(false)
	const [manualMode, setManualMode] = useState(false)

	const setCollapsedManually = useCallback((value: boolean) => {
		setCollapsed(value)
		// setManualMode(true)
	}, [])

	const setCollapsedAuto = useCallback(
		(value: boolean) => {
			// if (manualMode) {
			// 	return
			// }
			setCollapsed(value)
		},
		[collapsed]
	)
	return {
		collapsed,
		setCollapsedAuto,
		setCollapsedManually,
	}
}

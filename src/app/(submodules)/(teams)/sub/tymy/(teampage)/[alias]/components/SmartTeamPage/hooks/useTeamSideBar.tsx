import { useTheme } from '@/common/ui'
import { useMediaQuery } from '@/common/ui/mui'
import {
	createContext,
	useCallback,
	useContext,
	useEffect,
	useState,
} from 'react'

type SideBarType = ReturnType<typeof useTeamSideBarProvide>

const sidebarContext = createContext({} as SideBarType)

export const useTeamSideBar = () => {
	const c = useContext(sidebarContext)
	if (!c) {
		throw new Error('useTeamSideBar must be used within TeamSideBarProvider')
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
	const [darkMode, setDarkMode] = useState(false)
	const [hidden, setHidden] = useState(false)

	const theme = useTheme()
	const uncollapsable = useMediaQuery('(max-width: 750px)')
	useEffect(() => {
		if (uncollapsable && !collapsed) {
			setCollapsed(true)
		}
	}, [uncollapsable])

	const setCollapsedManually = useCallback(
		(value: boolean) => {
			if (uncollapsable) return
			setCollapsed(value)
		},
		[uncollapsable]
	)

	const setCollapsedAuto = useCallback(
		(value: boolean) => {
			if (uncollapsable) return
			setCollapsed(value)
		},
		[uncollapsable]
	)
	return {
		collapsed,
		hidden,
		setHidden,
		setCollapsedAuto,
		setCollapsedManually,
		darkMode,
		setDarkMode,
		uncollapsable,
	}
}

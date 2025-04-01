import { ReactNode, createContext, useContext, useMemo, useState } from 'react'

type ToolbarContextType = ReturnType<typeof useProvideToolbar>

const toolbarContext = createContext<ToolbarContextType>(
	{} as ToolbarContextType
)

export const useToolbar = () => {
	const context = useContext(toolbarContext)
	if (!context) {
		throw new Error('useToolbar must be used within a ToolbarProvider')
	}

	return context
}

export const ToolbarProvider = ({ children }: { children: ReactNode }) => {
	const p = useProvideToolbar()
	return <toolbarContext.Provider value={p}>{children}</toolbarContext.Provider>
}

type ToolbarVariant = 'default' | 'dark' | 'transparent'

export const useProvideToolbar = () => {
	const [showTitle, setShowTitle] = useState(false)
	const [_transparent, setTransparent] = useState(false)
	const [dark, setDark] = useState(false)
	const [_tempSolid, _setTempSolid] = useState(false)
	const [whiteVersion, setWhiteVersion] = useState(false)
	const [hideMiddleNavigation, setHideMiddleNavigation] = useState(false)
	const [hidden, setHidden] = useState(false)

	const transparent = useMemo(() => {
		return (_transparent && !_tempSolid) || hidden
	}, [_transparent, hidden, _tempSolid])

	const variant: ToolbarVariant = useMemo(() => {
		return transparent ? 'transparent' : dark ? 'dark' : 'default'
	}, [transparent, dark])

	return {
		showTitle,
		setShowTitle,
		transparent,
		variant,
		setTransparent,
		setDark,
		whiteVersion,
		setWhiteVersion,
		hideMiddleNavigation,
		setHideMiddleNavigation,
		hidden,
		setHidden,
		_setTempSolid,
	}
}

import { ReactNode, createContext, useContext, useState } from 'react'

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

export const useProvideToolbar = () => {
	const [showTitle, setShowTitle] = useState(false)
	const [transparent, setTransparent] = useState(false)
	const [whiteVersion, setWhiteVersion] = useState(false)
	const [hideMiddleNavigation, setHideMiddleNavigation] = useState(false)

	return {
		showTitle,
		transparent,
		setTransparent,
		whiteVersion,
		setWhiteVersion,
		hideMiddleNavigation,
		setHideMiddleNavigation,
	}
}

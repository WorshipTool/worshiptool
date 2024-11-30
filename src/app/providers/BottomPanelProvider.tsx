import { createContext, useContext, useState } from 'react'

type R = any

const panelContext = createContext<R>({ uninitialized: true } as any as R)

export function BottomPanelProvider({
	children,
}: {
	children: React.ReactNode
}) {
	const value = useProvideBottomPanel()
	return <panelContext.Provider value={value}>{children}</panelContext.Provider>
}

export default function useBottomPanel() {
	const r = useContext(panelContext)

	if ((r as any).uninitialized) {
		throw new Error('useBottomPanel was used outside of a BottomPanelProvider')
	}

	return r
}

const useProvideBottomPanel = () => {
	const [height, setHeight] = useState(0)

	return {
		height,
		setHeight,
	}
}

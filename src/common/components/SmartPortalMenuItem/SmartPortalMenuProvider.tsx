import { createContext, useContext } from 'react'

type R = ReturnType<typeof useProvideSmartPortalMenu>

const menuContext = createContext<R>({ uninitialized: true } as any as R)

export function SmartPortalMenuProvider({
	children,
	id,
}: {
	children: React.ReactNode
	id: string
}) {
	const value = useProvideSmartPortalMenu(id)
	return <menuContext.Provider value={value}>{children}</menuContext.Provider>
}

export default function useSmartPortalMenu() {
	const r = useContext(menuContext)

	if ((r as any).uninitialized) {
		throw new Error(
			'useSmartPortalMenu was used outside of a SmartPortalMenuProvider'
		)
	}

	return r
}

const useProvideSmartPortalMenu = (id: string) => {
	return {
		containerId: id,
	}
}

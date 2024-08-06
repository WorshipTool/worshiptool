import { createContext, useContext, useState } from 'react'

type FooterType = ReturnType<typeof useFooterProvide>

const footerContext = createContext({} as FooterType)

export const useFooter = () => {
	const c = useContext(footerContext)
	if (!c) {
		throw new Error('useFooter must be used within FooterProvider')
	}
	return c
}

export const FooterProvider = ({ children }: { children: React.ReactNode }) => {
	const v = useFooterProvide()

	return <footerContext.Provider value={v}>{children}</footerContext.Provider>
}

export const useFooterProvide = () => {
	const [show, setShow] = useState(false)
	return {
		show,
		setShow,
	}
}

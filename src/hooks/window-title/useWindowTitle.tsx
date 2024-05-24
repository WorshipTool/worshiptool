'use client'

import { createContext, useContext, useEffect, useState } from 'react'
import { WINDOW_MAIN_TITLE, WINDOW_TITLE_DIVIDER } from './constants'

type Titles = string[] | string

export const useWindowTitle = (titles?: Titles) => {
	const ctx: ReturnType<typeof useProvideWindowTitle> = useContext(titleContext)

	useEffect(() => {
		if (!ctx) {
			console.log('useWindowTitle hook must be used inside WindowTitleProvider')
			return
		}
		ctx.add(titles || [])
		return () => {
			ctx.remove(titles || [])
		}
	}, [titles])

	return ctx
}
const useProvideWindowTitle = () => {
	const [titles, setTitles] = useState<string[]>([WINDOW_MAIN_TITLE])
	const add = (tls: Titles) => {
		setTitles((titles) => {
			const arr = Array.isArray(tls) ? tls : [tls]
			return [...titles, ...arr]
		})
	}

	const remove = (tls: Titles) => {
		setTitles((titles) => {
			const arr = Array.isArray(tls) ? tls : [tls]

			const newArr = [...titles]
			arr.forEach((title) => {
				const index = newArr.indexOf(title)
				if (index >= 0) {
					newArr.splice(index, 1)
				}
			})
			return newArr
		})
	}

	useEffect(() => {
		// setWindowTitles(titles)
	}, [titles])

	return {
		add,
		remove,
	}
}

const titleContext = createContext(undefined as any)

export const WindowTitleProvider = ({
	children,
}: {
	children: React.ReactNode
}) => {
	const hook = useProvideWindowTitle()

	return <titleContext.Provider value={hook}>{children}</titleContext.Provider>
}

const setWindowTitles = (titles?: string[]) => {
	document.title =
		titles && titles.length > 0
			? [...titles].reverse().join(WINDOW_TITLE_DIVIDER)
			: WINDOW_MAIN_TITLE
}

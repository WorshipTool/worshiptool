import { RoutesKeys, SmartAllParams } from '@/routes'
import { createContext, ReactNode, useContext, useMemo, useState } from 'react'

type Rt = ReturnType<typeof useProviderOutsideBlocker>

const blockerContext = createContext<Rt>({ uninitialized: true } as any as Rt)

export const useOutsideBlocker = () => {
	const value = useContext(blockerContext)

	if ((value as any).uninitialized) {
		throw new Error(
			'useOutsideBlocker must be used inside a OutsideLinkBlockerProvider'
		)
	}

	return value
}

export const OutsideLinkBlockerProvider = ({
	children,
}: {
	children: ReactNode
}) => {
	const value = useProviderOutsideBlocker()
	return (
		<blockerContext.Provider value={value}>{children}</blockerContext.Provider>
	)
}

type ToData<T extends RoutesKeys> = {
	to: T
	params: SmartAllParams<T>
	url: string
}
export type LinkBlockerCondition = <T extends RoutesKeys>(
	to: ToData<T>
) => boolean

export type LinkBlockerPopupData = {
	title: string
	message: string
}
type CondAndMessage = {
	condition: LinkBlockerCondition
	popupData: LinkBlockerPopupData
}

const useProviderOutsideBlocker = <T extends RoutesKeys = RoutesKeys>() => {
	const [conditions, setConditions] = useState<CondAndMessage[]>([])

	const addCondition = (
		condition: LinkBlockerCondition,
		popupData: LinkBlockerPopupData
	) => {
		setConditions((prev) => [...prev, { condition, popupData }])
	}
	const removeCondition = (condition: LinkBlockerCondition) => {
		setConditions((prev) => prev.filter((c) => c.condition !== condition))
	}

	// Return true if the link should be blocked
	const checkToPath = (to: ToData<T>) => {
		for (const { condition, popupData } of conditions) {
			if (condition(to)) return popupData
		}
		return false
	}

	return {
		addCondition,
		removeCondition,
		checkToPath,
	}
}

export const useOutsideBlockerLinkCheck = <T extends RoutesKeys>(
	to: ToData<T>
) => {
	const { checkToPath } = useOutsideBlocker()

	const isBlocked = useMemo(() => checkToPath(to), [checkToPath, to])

	return isBlocked
}

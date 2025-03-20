'use client'
import { AllCommonData } from '@/hooks/common-data/common-data.types'
import { createContext, useContext } from 'react'

type Rt = AllCommonData
type KeyofAllCommonData = keyof AllCommonData

const commonDataContext = createContext({ uninitialized: true } as any as Rt)

// if key is provided, return only the value of that key
// if key is not provided, return all common data
export function useCommonData(): Rt
export function useCommonData<T extends KeyofAllCommonData>(key: T): Rt[T]
export function useCommonData<T extends KeyofAllCommonData>(
	key?: T
): Rt | Rt[T] {
	const a = useContext(commonDataContext)
	if ((a as any).uninitialized) {
		throw new Error('You have to use CommonDataProvider')
	}

	return key !== undefined ? a[key] : a
}

export const CommonDataProvider = ({
	initialData,
	children,
}: {
	initialData: AllCommonData
	children: any
}) => {
	// const value = useProvideCommonData()
	const value: Rt = {
		...initialData,
	}
	return (
		<commonDataContext.Provider value={value}>
			{children}
		</commonDataContext.Provider>
	)
}

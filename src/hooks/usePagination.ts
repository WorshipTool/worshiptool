'use client'
import { useCallback, useState } from 'react'

export const countPerPage = 10

export default function usePagination<T>(
	func: (page: number, resolve: (result: T[]) => void, array: T[]) => void
) {
	const [lastPage, setLastPage] = useState(-1)
	const [array, setArray] = useState<T[]>([])
	const [pagedArray, setPagedArray] = useState<T[][]>([])
	const [nextExists, setNextExists] = useState(true)

	const loadPage = useCallback(
		async (page: number, replace?: boolean) => {
			const result: T[] = await new Promise((res, reject) => {
				func(
					page,
					(d) => {
						res(d)
					},
					replace ? [] : array
				)
			})

			const continues = result.length > countPerPage
			const newData = result.slice(0, countPerPage)
			setNextExists(continues)

			if (replace !== undefined && replace) {
				setArray(newData)
				setPagedArray([newData])
			} else {
				// setArray([...array, ...newData])
				setArray((prev) => prev.concat(newData))
				setPagedArray((prev) => prev.concat([newData]))
			}
			setLastPage(page)
		},
		[array, func]
	)

	const nextPage = () => {
		return loadPage(lastPage + 1, false)
	}

	return {
		loadPage,
		nextPage,
		data: array,
		pagedData: pagedArray,
		nextExists,
	}
}

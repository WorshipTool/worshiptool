import { Box } from '@/common/ui'
import { Pagination } from '@/common/ui/mui'
import { ReactNode, useEffect, useMemo, useState } from 'react'

export type PagerProps<T> = {
	children: (data: T[], loading: boolean, startIndex: number) => ReactNode
	take?: number
	allCount?: number
	data: T[] | ((page: number) => Promise<T[]>)
}

export default function Pager<T>({
	children,
	take = 10,
	...props
}: PagerProps<T>) {
	const staticMode = Array.isArray(props.data)

	const [page, setPage] = useState(1)
	const pagesCount = useMemo(() => {
		if (staticMode) {
			return Math.ceil((props.data as T[]).length / take)
		}
		return Math.ceil((props.allCount || 0) / take)
	}, [props.allCount, props.data, staticMode])

	const [loading, setLoading] = useState(false)

	const [pageData, setPageData] = useState<T[]>([])

	useEffect(() => {
		if (staticMode) {
			setPageData((props.data as T[]).slice((page - 1) * take, page * take))
		} else {
			setLoading(true)

			const func = props.data as (page: number) => Promise<T[]>

			func(page - 1)
				.then((data) => {
					setPageData(data)
				})
				.finally(() => {
					setLoading(false)
				})
		}
	}, [page, props.data, staticMode])

	const component = useMemo(
		() => children(pageData, loading, (page - 1) * take),
		[children, pageData, loading, take, page]
	)

	return (
		<Box display={'flex'} flexDirection={'column'} gap={2}>
			{component}

			{/*-------footer-pagination------ */}
			<Box display={'flex'} justifyContent={'center'}>
				<Pagination
					count={pagesCount}
					page={page}
					onChange={(e, p) => setPage(p)}
					color="primary"
				/>
			</Box>
		</Box>
	)
}

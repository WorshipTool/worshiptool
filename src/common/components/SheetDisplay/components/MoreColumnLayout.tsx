'use client'
import { Box } from '@mui/material'
import { ReactElement, useEffect, useRef, useState } from 'react'

type MoreColumnLayoutProps = {
	children: ReactElement[]
	startOffset: number // Automatically wasn't working,
	columns: number
}

type Element = {
	element: HTMLDivElement
	height: number
}
type Column = { elements: Element[]; height: number }
type Page = {
	columns: Column[]
	startOffsetY: number
	height: number
}

export default function MoreColumnLayout(props: MoreColumnLayoutProps) {
	const ref = useRef<HTMLDivElement>(null)
	const refs = useRef<HTMLDivElement[]>([])

	const [pages, setPages] = useState<Page[]>([])

	// A4
	const pageHeight = 1048 // Manually found
	const setHeight = () => {
		const columnsCount = props.columns
		const topOffset = props.startOffset

		const pages: Page[] = []

		// Split the children into pages and columns
		let currentPageIndex = 0
		let currentColumnIndex = 0

		let currentPageYOffset = topOffset
		let currentY = 0
		refs.current.forEach((r) => {
			const rect = r.getBoundingClientRect()
			const childHeight = rect.height
			// console.log(
			// 	currentY + childHeight + currentPageYOffset,
			// 	currentY,
			// 	childHeight,
			// 	currentPageYOffset
			// )
			if (currentY + childHeight + currentPageYOffset > pageHeight) {
				// Dont fit in the page

				// New page, switch column
				currentColumnIndex++
				if (currentColumnIndex === columnsCount) {
					// Set page height
					pages[currentPageIndex].height = pageHeight - currentPageYOffset

					currentColumnIndex = 0
					currentPageIndex++
					currentPageYOffset = 0
				}
				currentY = 0
			}

			// If no current page exists, create one
			if (currentPageIndex >= pages.length) {
				pages.push({
					columns: [],
					startOffsetY: 0,
					height: 0,
				})
			}
			// If no current column exists, create one
			if (currentColumnIndex >= pages[currentPageIndex].columns.length) {
				pages[currentPageIndex].columns.push({
					elements: [],
					height: 0,
				})
			}
			currentY += childHeight
			pages[currentPageIndex].columns[currentColumnIndex].elements.push({
				element: r,
				height: childHeight,
			})

			pages[currentPageIndex].columns[currentColumnIndex].height = currentY
			if (pages[currentPageIndex].height < currentY) {
				pages[currentPageIndex].height = currentY
			}
			pages[currentPageIndex].startOffsetY = currentPageYOffset
		})

		setPages(pages)

		// From every page get max height and sum it
		let totalHeight = 0
		pages.forEach((page) => {
			totalHeight += page.height
		})

		// Set the height
		ref.current!.style.height = `${totalHeight}px`
	}

	useEffect(() => {
		window.addEventListener('beforeprint', setHeight)
		return () => {
			window.removeEventListener('beforeprint', setHeight)
		}
	}, [])
	return (
		<Box
			sx={{
				position: 'relative',
			}}
		>
			<Box
				sx={{
					columnCount: 2,
					columnFill: 'auto',
					// bgcolor: 'red',
				}}
				ref={ref}
			>
				{props.children.map((c, index) => {
					// Get rect of the box
					return (
						<Box
							key={index}
							ref={(r: HTMLDivElement) => {
								refs.current[index] = r
							}}
						>
							{c}
						</Box>
					)
				})}
			</Box>
		</Box>
	)
}

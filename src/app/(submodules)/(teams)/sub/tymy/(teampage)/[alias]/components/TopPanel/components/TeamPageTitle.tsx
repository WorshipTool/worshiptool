'use client'
import { TEAM_PAGE_TITLE_ID } from '@/app/(submodules)/(teams)/sub/tymy/(teampage)/[alias]/components/TopPanel/components/TeamPageTitleContainer'
import { Typography } from '@/common/ui/Typography'
import { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'

type TeamPageTitleProps = {
	children: any
}

export function TeamPageTitle(props: TeamPageTitleProps) {
	const ref = useRef<HTMLDivElement | null>(null)
	const [mounted, setMounted] = useState(false)

	useEffect(() => {
		ref.current = document.querySelector(`#${TEAM_PAGE_TITLE_ID}`)
		setMounted(true)
		return () => setMounted(false)
	}, [])

	return ref.current && mounted
		? createPortal(
				<Typography
					strong
					variant="h4"
					sx={{
						display: 'flex',
						gap: 2,
						flexDirection: 'row',
						alignItems: 'center',
					}}
				>
					{props.children}
				</Typography>,
				ref.current
		  )
		: null
}

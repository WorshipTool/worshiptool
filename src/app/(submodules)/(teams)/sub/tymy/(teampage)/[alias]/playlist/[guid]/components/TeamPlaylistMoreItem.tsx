import { TEAM_PLAYLIST_MORE_BUTTON_ID } from '@/app/(submodules)/(teams)/sub/tymy/(teampage)/[alias]/playlist/[guid]/components/TeamPlaylistMoreButton'
import { createSmartPortal } from '@/tech/portal/createSmartPortal'
import { useEffect, useRef, useState } from 'react'

type TeamPlaylistMoreItemProps = {
	children: React.ReactNode
}

export default function TeamPlaylistMoreItem(props: TeamPlaylistMoreItemProps) {
	const ref = useRef<HTMLDivElement | null>(null)
	const [mounted, setMounted] = useState(false)

	useEffect(() => {
		ref.current = document.querySelector(`#${TEAM_PLAYLIST_MORE_BUTTON_ID}`)
		setMounted(true)
		return () => {
			setMounted(false)
		}
	}, [])

	return ref.current && mounted
		? createSmartPortal(props.children, TEAM_PLAYLIST_MORE_BUTTON_ID)
		: null
}

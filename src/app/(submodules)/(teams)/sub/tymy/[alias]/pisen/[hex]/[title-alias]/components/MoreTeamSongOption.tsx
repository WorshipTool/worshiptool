import { MORE_TEAM_SONG_BUTTON_ID } from '@/app/(submodules)/(teams)/sub/tymy/[alias]/pisen/[hex]/[title-alias]/components/MoreTeamSongButton'
import { createSmartPortal } from '@/tech/portal/createSmartPortal'
import { ReactNode, useEffect, useRef, useState } from 'react'

type MoreTeamSongOptionsProps = {
	children: ReactNode
}

export function MoreTeamSongOption(props: MoreTeamSongOptionsProps) {
	const ref = useRef<HTMLDivElement | null>(null)
	const [mounted, setMounted] = useState(false)

	useEffect(() => {
		ref.current = document.querySelector(`#${MORE_TEAM_SONG_BUTTON_ID}`)
		setMounted(true)
		return () => {
			setMounted(false)
		}
	}, [])

	return ref.current && mounted
		? createSmartPortal(props.children, MORE_TEAM_SONG_BUTTON_ID)
		: null
}

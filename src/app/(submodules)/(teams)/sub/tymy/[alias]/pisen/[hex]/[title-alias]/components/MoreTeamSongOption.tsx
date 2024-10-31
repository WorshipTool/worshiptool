import {
	CHILDREN_UPDATE_MORE_TEAM_SONG_BUTTON_EVENT_NAME,
	MORE_TEAM_SONG_BUTTON_ID,
} from '@/app/(submodules)/(teams)/sub/tymy/[alias]/pisen/[hex]/[title-alias]/components/MoreTeamSongButton'
import { ReactNode, useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'

type MoreTeamSongOptionsProps = {
	children: ReactNode
}

type PortalItemProps = {
	children: ReactNode
	onMount: (unmount?: -1) => void
}
const PortalItem = (props: PortalItemProps) => {
	useEffect(() => {
		props.onMount()
		return () => props.onMount(-1)
	}, [])
	return props.children
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
		? createPortal(
				<PortalItem
					onMount={() => {
						window.dispatchEvent(
							new Event(CHILDREN_UPDATE_MORE_TEAM_SONG_BUTTON_EVENT_NAME)
						)
					}}
				>
					{props.children}
				</PortalItem>,
				ref.current
		  )
		: null
}

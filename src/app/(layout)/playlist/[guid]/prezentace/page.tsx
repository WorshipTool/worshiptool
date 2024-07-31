'use client'
import {
    ChevronLeft,
    ChevronRight,
    Fullscreen,
    FullscreenExit,
} from '@mui/icons-material'
import { Box, IconButton } from '@mui/material'
import { useEffect, useState } from 'react'
// import { useParams } from 'react-router-dom'
import GoBackButton from '@/app/(layout)/playlist/[guid]/prezentace/components/GoBackButton'
import { PlaylistGuid } from '@/interfaces/playlist/playlist.types'
import { useParams } from 'next/navigation'
import { SwipeEventListener } from 'swipe-event-listener'
import usePlaylist from '../../../../../hooks/playlist/usePlaylist'
import Slide{Card} from './components/SlideCard'

export default function PlaylistCards() {
	const { guid } = useParams() as { guid: PlaylistGuid }
	const { items, playlist } = usePlaylist(guid)

	const [currentIndex, setCurrentIndex] = useState(0)

	const [fullscreen, setFullscreen] = useState(false)

	const COLOR = 'white'

	const right = () => {
		moveCurrent(-1)
	}
	const left = () => {
		moveCurrent(1)
	}
	const up = () => {
		turnOnFullscreen()
	}
	const down = () => {
		turnOffFullscreen()
	}

	useEffect(() => {
		if (items.length === 0) return

		// Swipe events
		const { swipeArea, updateOptions } = SwipeEventListener({
			swipeArea: document.querySelector('body') as HTMLElement,
		})

		const remove = () => {
			swipeArea.removeEventListener('swipeRight', right)
			swipeArea.removeEventListener('swipeLeft', left)
			swipeArea.removeEventListener('swipeUp', up)
			swipeArea.removeEventListener('swipeDown', down)
		}

		remove()

		swipeArea.addEventListener('swipeRight', right)

		swipeArea.addEventListener('swipeLeft', left)

		swipeArea.addEventListener('swipeUp', up)

		swipeArea.addEventListener('swipeDown', down)

		return remove
	}, [items])

	const moveCurrent = (offset: number) => {
		setCurrentIndex((v) => {
			const target = v + offset
			if (target < 0) return 0
			if (target >= items.length) return items.length - 1
			return target
		})
	}

	const onKeyDown = (e: any) => {
		e.preventDefault()

		console.log(e.code)

		if (e.code === 'ArrowLeft' || e.code === 'KeyA') {
			right()
		} else if (
			e.code === 'ArrowRight' ||
			e.code === 'Space' ||
			e.code === 'KeyD'
		) {
			left()
		} else if (e.code === 'ArrowUp') {
			up()
		} else if (e.code === 'ArrowDown') {
			down()
		}
	}

	const turnOnFullscreen = () => {
		document.body.requestFullscreen()
		setFullscreen(true)
	}

	const turnOffFullscreen = () => {
		document.exitFullscreen()
		setFullscreen(false)
	}

	useEffect(() => {
		document.addEventListener('keydown', onKeyDown)
		return () => {
			document.removeEventListener('keydown', onKeyDown)
		}
	}, [items])

	return (
		<Box>
			<Box position={'absolute'} right={0} top={0} bgcolor={'grey'}>
				<IconButton
					color="inherit"
					sx={{ color: COLOR }}
					onClick={() => moveCurrent(-1)}
					disabled={currentIndex == 0}
				>
					<ChevronLeft />
				</IconButton>
				<IconButton
					color="inherit"
					sx={{ color: COLOR }}
					onClick={() => moveCurrent(1)}
					disabled={currentIndex == items.length - 1}
				>
					<ChevronRight />
				</IconButton>
				{!fullscreen ? (
					<IconButton
						onClick={() => {
							turnOnFullscreen()
						}}
					>
						<Fullscreen color="inherit" sx={{ color: COLOR }} />
					</IconButton>
				) : (
					<IconButton
						onClick={() => {
							turnOffFullscreen()
						}}
					>
						<FullscreenExit color="inherit" sx={{ color: COLOR }} />
					</IconButton>
				)}
			</Box>
			<Box
				sx={{
					position: 'absolute',
					top: 0,
					left: 0,
				}}
			>
				<GoBackButton />
			</Box>
			<SlideCard item={items[currentIndex]} order={currentIndex} />
		</Box>
	)
}

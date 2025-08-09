'use client'
import { Box, IconButton, Typography } from '@/common/ui'
import {
	ChevronLeft,
	ChevronRight,
	Fullscreen,
	FullscreenExit,
} from '@mui/icons-material'
import { useEffect, useState } from 'react'
import { SmartPage } from '@/common/components/app/SmartPage/SmartPage'
import { SwipeEventListener } from 'swipe-event-listener'

export default SmartPage(SongPresentationDemo, ['fullWidth'])

// Demo data for testing
const demoSongData = {
	title: "Amazing Grace",
	sections: [
		{
			name: "Verse 1",
			content: `Amazing grace, how sweet the sound
That saved a wretch like me
I once was lost, but now am found
Was blind, but now I see`
		},
		{
			name: "Verse 2", 
			content: `'Twas grace that taught my heart to fear
And grace my fears relieved
How precious did that grace appear
The hour I first believed`
		},
		{
			name: "Chorus",
			content: `Amazing grace, how sweet the sound
That saved a wretch like me
I once was lost, but now am found
Was blind, but now I see`
		}
	]
}

export function SongPresentationDemo() {
	const [sections] = useState(demoSongData.sections)
	const [currentIndex, setCurrentIndex] = useState(0)
	const [fullscreen, setFullscreen] = useState(false)
	const [fontSize, setFontSize] = useState(24)

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
		if (sections.length === 0) return

		// Swipe events
		const { swipeArea } = SwipeEventListener({
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
	}, [sections])

	const moveCurrent = (offset: number) => {
		setCurrentIndex((v) => {
			const target = v + offset
			if (target < 0) return 0
			if (target >= sections.length) return sections.length - 1
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
	}, [sections])

	const currentSection = sections[currentIndex]

	return (
		<Box overflow={'hidden'}>
			{/* Main content area */}
			<Box
				display={'flex'}
				flexDirection={'column'}
				flex={1}
				sx={{
					bgcolor: '#000',
					color: 'white',
					userSelect: 'none',
					minHeight: '100vh',
					justifyContent: 'center',
					alignItems: 'center',
					padding: 4,
				}}
			>
				<Typography
					variant="h3"
					sx={{
						marginBottom: 4,
						color: 'white',
						textAlign: 'center',
						fontSize: fontSize + 8
					}}
				>
					{demoSongData.title.toUpperCase()}
				</Typography>
				
				{currentSection && (
					<Box sx={{ textAlign: 'center', maxWidth: '80%' }}>
						<Typography
							variant="h4"
							sx={{
								color: 'red',
								marginBottom: 3,
								fontSize: fontSize + 4
							}}
						>
							{currentSection.name.toUpperCase()}
						</Typography>
						<Typography
							sx={{
								fontSize: fontSize,
								lineHeight: 1.8,
								whiteSpace: 'pre-line'
							}}
						>
							{currentSection.content}
						</Typography>
					</Box>
				)}
				
				{/* Section indicator */}
				<Box sx={{ position: 'absolute', bottom: 20, left: '50%', transform: 'translateX(-50%)' }}>
					<Typography sx={{ color: 'gray', fontSize: 14 }}>
						{currentIndex + 1} / {sections.length}
					</Typography>
				</Box>
			</Box>
			
			{/* Controls */}
			<Box
				position={'absolute'}
				right={0}
				top={0}
				display={'flex'}
				gap={1.5}
				alignItems={'end'}
			>
				<Box bgcolor={'rgba(0,0,0,0.7)'} display={'flex'} borderRadius={1}>
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
						disabled={currentIndex == sections.length - 1}
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
			</Box>
			
			{/* Go back button */}
			<Box
				sx={{
					position: 'absolute',
					top: 0,
					left: 0,
					padding: 2
				}}
			>
				<Typography sx={{ 
					bgcolor: 'rgba(0,0,0,0.7)', 
					color: 'white', 
					padding: 1, 
					borderRadius: 1,
					fontSize: 12
				}}>
					Demo: Song Presentation Mode
				</Typography>
			</Box>
			
			{/* Instructions */}
			<Box
				sx={{
					position: 'absolute',
					bottom: 60,
					left: 20,
					color: 'gray',
					fontSize: 12
				}}
			>
				<Typography sx={{ fontSize: 12, color: 'gray' }}>
					Use arrow keys, space, or click arrows to navigate
				</Typography>
			</Box>
		</Box>
	)
}
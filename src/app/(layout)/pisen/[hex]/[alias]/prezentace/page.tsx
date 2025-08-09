'use client'
import { Box, IconButton } from '@/common/ui'
import {
	ChevronLeft,
	ChevronRight,
	Fullscreen,
	FullscreenExit,
} from '@mui/icons-material'
import { useEffect, useState } from 'react'
import { SmartPage } from '@/common/components/app/SmartPage/SmartPage'
import { SwipeEventListener } from 'swipe-event-listener'
import { useParams } from 'next/navigation'
import SongPresentationCard from './components/SongPresentationCard'
import GoBackButton from './components/GoBackButton'
import { getVariantAliasFromParams, getVariantByAlias } from '../tech'
import { mapGetVariantDataApiToSongDto, mapExtendedVariantPackApiToDto } from '@/api/dtos'

export default SmartPage(SongPresentation, ['fullWidth'])

export function SongPresentation() {
	const params = useParams() as { hex: string; alias: string }
	const [variantData, setVariantData] = useState<any>(null)
	const [sections, setSections] = useState<any[]>([])
	const [currentIndex, setCurrentIndex] = useState(0)
	const [fullscreen, setFullscreen] = useState(false)
	const [loading, setLoading] = useState(true)

	const COLOR = 'white'

	// Load song data
	useEffect(() => {
		async function loadSong() {
			try {
				const alias = getVariantAliasFromParams(params.hex, params.alias)
				const v = await getVariantByAlias(alias)
				const mainPack = v.main
				const song = mapGetVariantDataApiToSongDto(v)
				const variant = mapExtendedVariantPackApiToDto(mainPack)
				
				setVariantData({ variant, song })
				
				// Parse sections from sheet data for navigation
				const Sheet = (await import('@pepavlin/sheet-api')).Sheet
				const sheet = new Sheet(variant.sheetData)
				const songSections = sheet.getSections()
				setSections(songSections || [])
			} catch (error) {
				console.error('Error loading song:', error)
			} finally {
				setLoading(false)
			}
		}

		loadSong()
	}, [params.hex, params.alias])

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

	if (loading) {
		return (
			<Box
				display="flex"
				justifyContent="center"
				alignItems="center"
				height="100vh"
				bgcolor="black"
				color="white"
			>
				Loading...
			</Box>
		)
	}

	if (!variantData) {
		return (
			<Box
				display="flex"
				justifyContent="center"
				alignItems="center"
				height="100vh"
				bgcolor="black"
				color="white"
			>
				Song not found
			</Box>
		)
	}

	return (
		<Box overflow={'hidden'}>
			<SongPresentationCard 
				variant={variantData.variant}
				song={variantData.song}
				sectionIndex={currentIndex}
			/>
			<Box
				position={'absolute'}
				right={0}
				top={0}
				display={'flex'}
				gap={1.5}
				alignItems={'end'}
			>
				<Box bgcolor={'grey'} display={'flex'}>
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
			<Box
				sx={{
					position: 'absolute',
					top: 0,
					left: 0,
				}}
			>
				<GoBackButton hex={params.hex} alias={params.alias} />
			</Box>
		</Box>
	)
}
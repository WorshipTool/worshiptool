'use client'
import { Box, CircularProgress, Typography } from '@mui/material'
import { Sheet } from '@pepavlin/sheet-api'
import { Section } from '@pepavlin/sheet-api/lib/models/song/section'
import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import OnChangeDelayer from '../../../../../../common/providers/ChangeDelayer/ChangeDelayer'
import { Gap } from '../../../../../../common/ui/Gap'
import { PlaylistItemDTO } from '../../../../../../interfaces/playlist/PlaylistDTO'
import { sectionNameToText } from '../../../../../../tech/sectionNameToText'

const sectionPart = (section: Section, fontSize: number) => {
	const lines = section.lines

	return (
		<Box>
			{section.name && (
				<>
					<Typography
						fontWeight={'bold'}
						fontSize={fontSize + 2}
						color={'inherit'}
						sx={{
							color: 'red',
						}}
					>
						{sectionNameToText(section.name).toUpperCase()}
					</Typography>
				</>
			)}
			{lines &&
				lines.map((line, index) => {
					return (
						<Box display={'flex'} flexDirection={'row'} key={'bbox' + index}>
							{line.segments.map((segment, index) => {
								return (
									<Box
										display={'flex'}
										flexDirection={'column'}
										key={'cbox' + index}
									>
										<Box sx={{ flex: 1 }}>
											{segment.chord && (
												<Typography
													sx={{
														paddingRight: 1,
														fontSize: fontSize,
														color: '#FCF300',
													}}
												>
													<b>{segment.chord.toString()}</b>
												</Typography>
											)}
										</Box>

										<Typography
											sx={{
												flex: 1,
												fontSize: fontSize,
											}}
										>
											{segment.text}
										</Typography>
									</Box>
								)
							})}
						</Box>
					)
				})}
		</Box>
	)
}

interface SlideCardProps {
	item: PlaylistItemDTO
	order: number
}

export default function SlideCard({
	item: originalItem,
	order: originalOrder,
}: SlideCardProps) {
	const [windowWidth, setWindowWidth] = useState<number>(
		typeof window === 'undefined' ? 0 : window?.innerWidth
	)
	const [windowHeight, setWindowHeight] = useState<number>(
		typeof window === 'undefined' ? 0 : window?.innerHeight
	)

	const [sizeChanging, setSizeChanging] = useState(true)

	const [size, setSize] = useState(20)
	const [sizeSet, setSizeSet] = useState(false)

	const [sheet, setSheet] = useState<Sheet>()

	const lastSectionRef = useRef()

	const [loading, setLoading] = useState(true)

	const PADDING = 40

	const [item, setItem] = useState<PlaylistItemDTO>(originalItem)
	const [order, setOrder] = useState<number>(originalOrder)

	useEffect(() => {
		setLoading(true)
		setItem(originalItem)
		setOrder(originalOrder)
	}, [originalItem, originalOrder])

	const onItemChange = (item: PlaylistItemDTO) => {
		setSizeChanging(true)

		setSize((s) => s - 1)
		setSizeSet(false)

		if (!item) return
		setSheet(new Sheet(item.variant.sheetData))

		setTimeout(() => {
			setLoading(false)
		}, 500)
	}

	useEffect(() => {
		if (!sheet) return
		sheet.setKey(item.toneKey)
	}, [sheet])

	useEffect(() => {
		console.log(size)

		if (!sheet) return

		if (!lastSectionRef?.current) {
			// Make a loop
			setSize((s) => s + 0.5)
			return
		}

		// Get box position (x,y) and size
		// @ts-ignore
		const boxX: number = lastSectionRef.current.offsetLeft
		// @ts-ignore
		const boxY: number = lastSectionRef.current.offsetTope

		// @ts-ignore
		const boxWidth: number = lastSectionRef.current.offsetWidth
		// @ts-ignore
		const boxHeight: number = lastSectionRef.current.offsetHeight

		// Calculate corner position
		const cornerX: number = boxX + boxWidth
		const cornerY: number = boxY + boxHeight

		const maxX = windowWidth - PADDING * 2
		const maxY = windowHeight - PADDING * 2

		const xIsOut = cornerX > maxX
		const yIsOut = cornerY > maxY

		const cornerIsOut: boolean = xIsOut || yIsOut

		const step = 2

		if (cornerIsOut) {
			setSizeSet(false)
			setSizeChanging(true)
		} else {
			setSizeChanging(false)
		}
		if (sizeSet) return

		if (!cornerIsOut) {
			setSize((s) => s + step)
		} else {
			setSize((s) => s - step)
			setSizeSet(true)
		}
	}, [lastSectionRef, size, sizeSet, sheet])

	useEffect(() => {
		setSizeSet(false)
	}, [windowWidth, windowHeight])

	useLayoutEffect(() => {
		function updateSize() {
			setWindowWidth(window.innerWidth)
			setWindowHeight(window.innerHeight)
		}
		window.addEventListener('resize', updateSize)
		updateSize()
		return () => window.removeEventListener('resize', updateSize)
	}, [])

	const COLOR = 'white'

	return (
		<Box
			display={'flex'}
			flexDirection={'column'}
			flex={1}
			sx={{
				bgcolor: '#000',
				color: COLOR,
				userSelect: 'none',
			}}
		>
			<OnChangeDelayer value={item} onChange={onItemChange} delay={1000} />
			<Box
				display={'flex'}
				flexDirection={'column'}
				height={`calc(100vh - ${PADDING}px - ${PADDING}px)`}
				width={'100%'}
				flexWrap={'wrap'}
				alignContent={'center'}
				alignItems={'stretch'}
				justifyContent={'center'}
				sx={{
					paddingTop: PADDING + 'px',
					paddingBottom: PADDING + 'px',
				}}
			>
				<Typography fontWeight={'bold'} fontSize={size + 5} marginRight={2}>
					{order + 1 + '. '}
					{item?.variant?.preferredTitle.toUpperCase()}
				</Typography>
				{sheet?.getSections()?.map((section, index) => {
					return (
						<Box
							key={index}
							sx={{
								borderRadius: 2,
								paddingTop: 4,
								marginRight: 3,
							}}
							ref={
								index === sheet.getSections().length - 1
									? lastSectionRef
									: undefined
							}
						>
							{sectionPart(section, size)}
						</Box>
					)
				})}
			</Box>
			<Box
				bgcolor={'black'}
				position={'absolute'}
				left={0}
				top={0}
				right={0}
				bottom={0}
				sx={{
					color: '#fff',
					zIndex: (theme) => theme.zIndex.drawer + 1,
				}}
				display={loading ? 'flex' : 'none'}
				justifyContent={'center'}
				alignItems={'center'}
			>
				<CircularProgress color="inherit" />
				<Gap horizontal value={2} />
				<Typography variant="h6">{item?.variant?.preferredTitle}</Typography>
			</Box>
		</Box>
	)
}

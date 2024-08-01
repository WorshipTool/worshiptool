import { Box, Typography } from '@mui/material'
import { signature } from '@pepavlin/sheet-api/lib/models/note'
import {
	Section,
	SectionType,
} from '@pepavlin/sheet-api/lib/models/song/section'
import { Segment } from '@pepavlin/sheet-api/lib/models/song/segment'
import { useMemo } from 'react'
import { SheetStyleComponentType } from './config'

const chordHeight = '1.5em'
const sectionsGap = '2rem'

const SegmentElement = ({
	segment,
	signature,
	showChords,
}: {
	segment: Segment
	signature?: signature
	showChords: boolean
}) => {
	const words = useMemo(() => {
		const arr = segment.text?.split(/(\s+)/) || []
		// first item must be longer than chord
		const chord = segment.chord?.toString(signature)
		const chordLen = chord?.length || 0
		return arr.reduce((acc, item) => {
			if (acc.length !== 1) {
				acc.push(item)
			} else {
				const last = acc[0]
				if (last.replace(/\s/, '').length - 1 < chordLen * 1.2) {
					acc[0] += item
				} else {
					acc.push(item)
				}
			}
			return acc
		}, [] as string[])
	}, [segment])

	return (
		<>
			{words.map((word, index) => {
				return (
					<Box key={word}>
						{showChords &&
							(index == 0 && segment.chord ? (
								<>
									<Typography
										sx={{ height: chordHeight, paddingRight: '0.5rem' }}
										fontWeight={900}
									>
										{segment.chord?.toString(signature)}
									</Typography>
								</>
							) : (
								<Box sx={{ height: chordHeight }} />
							))}

						<Typography>{word}</Typography>
					</Box>
				)
			})}
		</>
	)
}

const SectionComponent = ({
	section,
	signature,
	isLast,
	hideChords,
}: {
	section: Section
	signature?: signature
	isLast: boolean
	hideChords: boolean
}) => {
	const sectionName = useMemo(() => {
		if (section.type === SectionType.UNKNOWN) return section.name

		let text = ''
		switch (section.type) {
			case SectionType.VERSE:
				text = 'S'
				break
			case SectionType.CHORUS:
				text = 'R'
				break
			case SectionType.BRIDGE:
				text = 'B'
				break
			case SectionType.INTRO:
				text = 'I'
				break
		}

		const index = section.index > 0 ? section.index : ''

		return index + text
	}, [section])

	const hasChords = useMemo(() => {
		// return true
		if (hideChords) return false
		return section.lines?.some((line) =>
			line.segments.some((segment) => segment.chord)
		)
	}, [section, hideChords])

	const hasFirstLineText = useMemo(() => {
		return section.lines?.[0]?.text && section.lines?.[0]?.text?.length > 0
	}, [section])
	return (
		<Box display={'flex'} flexDirection={'row'}>
			<Box
				sx={{
					paddingTop: hasChords && hasFirstLineText ? chordHeight : 0,
				}}
			>
				{sectionName && (
					<Typography
						// fontStyle={'italic'}
						noWrap
						fontWeight={section.type === SectionType.CHORUS ? 600 : 400}
						sx={{
							width: '2rem',
						}}
					>
						{sectionName}
					</Typography>
				)}
			</Box>
			<Box
				sx={{
					breakInside: 'avoid',
				}}
			>
				{section.lines ? (
					<>
						{section.lines.map((line, index) => {
							return (
								<div
									key={index}
									style={{
										display: 'flex',
										flexDirection: 'row',
										flexWrap: 'wrap',
									}}
								>
									{line.segments.map((segment, index) => {
										return (
											<SegmentElement
												key={index}
												segment={segment}
												signature={signature}
												showChords={hasChords}
											/>
										)
									})}
								</div>
							)
						})}
					</>
				) : (
					<></>
				)}
				{!isLast && (
					<>
						<Box sx={{ height: sectionsGap }} />
					</>
				)}
			</Box>
		</Box>
	)
}

const DefaultStyle: SheetStyleComponentType = ({
	sheet,
	title,
	signature,
	columns,
	hideChords,
}) => {
	const sections = useMemo(() => {
		return sheet?.getSections() || []
	}, [sheet])

	return (
		<Box sx={{}}>
			<Box
				sx={{
					display: 'flex',
					flexDirection: 'column',
					// alignItems: 'center',
					// justifyContent: 'center',
				}}
			>
				{title && (
					<Box
						sx={{
							marginBottom: 2,
							// display: 'flex',
							// justifyContent: 'center',
						}}
					>
						<Typography variant="h5" noWrap>
							<b>{title}</b>
						</Typography>
					</Box>
				)}
				{sections.map((section, index) => {
					return (
						<SectionComponent
							key={index}
							section={section}
							signature={signature}
							isLast={index === sections.length - 1}
							hideChords={hideChords}
						/>
					)
				})}
			</Box>
		</Box>
	)
}
export default DefaultStyle

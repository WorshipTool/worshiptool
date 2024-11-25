import MoreColumnLayout from '@/common/components/SheetDisplay/components/MoreColumnLayout'
import { Box, Typography } from '@/common/ui'
import { signature } from '@pepavlin/sheet-api/lib/models/note'
import {
	Section,
	SectionType,
} from '@pepavlin/sheet-api/lib/models/song/section'
import { Segment } from '@pepavlin/sheet-api/lib/models/song/segment'
import { useMemo } from 'react'
import { SheetStyleComponentType } from './config'

const chordHeight = '1.5em'
const sectionsGap = '2em'

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
		return segment.text?.split(/(\s+)/) || []
	}, [segment])

	return (
		<>
			{words.map((word, index) => {
				return (
					<Box key={index}>
						{showChords &&
							(index == 0 ? (
								<>
									<Typography sx={{ height: chordHeight }} strong={900}>
										{segment.chord?.toString(signature)}
									</Typography>
								</>
							) : (
								<>
									<Box sx={{ height: chordHeight }} />
								</>
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

		return section.index + text
	}, [section])

	const hasChords = useMemo(() => {
		// return true
		if (hideChords) return false
		return section.lines?.some((line) =>
			line.segments.some((segment) => segment.chord)
		)
	}, [section])
	return (
		<Box display={'flex'} flexDirection={'row'}>
			<Box
				sx={{
					paddingTop: hasChords ? chordHeight : 0,
				}}
			>
				{sectionName && (
					<Typography
						// fontStyle={'italic'}
						noWrap
						strong={500}
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
								<Box
									key={index}
									sx={{
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
								</Box>
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

const PrintCompactStyle: SheetStyleComponentType = ({
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
							height: 40,
						}}
					>
						<Typography variant="h4" noWrap>
							<b>{title}</b>
						</Typography>
					</Box>
				)}
				<MoreColumnLayout startOffset={40} columns={columns}>
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
				</MoreColumnLayout>
			</Box>
		</Box>
	)
}
export default PrintCompactStyle

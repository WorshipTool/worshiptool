// TODO: this component has to be as most basic as possible, no hooks, only client imports, apod.
import { signature } from '@pepavlin/sheet-api/lib/models/note'
import {
	Section,
	SectionType,
} from '@pepavlin/sheet-api/lib/models/song/section'
import { Segment } from '@pepavlin/sheet-api/lib/models/song/segment'
import { DetailedHTMLProps, HTMLAttributes } from 'react'
import { SheetStyleComponentType } from './config'

const chordHeight = '1.5em'
const sectionsGap = '2rem'

const StyledP = (
	props: DetailedHTMLProps<
		HTMLAttributes<HTMLParagraphElement>,
		HTMLParagraphElement
	>
) => {
	return (
		<p {...props} style={{ marginTop: 0, marginBottom: 0, ...props.style }} />
	)
}

const SegmentElement = ({
	segment,
	signature,
	showChords,
}: {
	segment: Segment
	signature?: signature
	showChords: boolean
}) => {
	const getWords = () => {
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
	}

	const words = getWords()

	return (
		<div
			style={{
				display: 'flex',
				flexDirection: 'row',
				flexWrap: 'wrap',
				gap: '0.1rem',
			}}
		>
			{words.map((word, index) => {
				return (
					<div
						key={word + index}
						style={{
							display: 'flex', // Explicitly set display to flex
							flexDirection: 'column',
						}}
					>
						{showChords &&
							(index == 0 && segment.chord ? (
								<StyledP
									style={{
										height: chordHeight,
										paddingRight: '0.5rem',
										fontWeight: 900,
									}}
								>
									{segment.chord?.toString(signature)}
								</StyledP>
							) : (
								<StyledP
									style={{
										height: chordHeight,
										display: 'flex',
									}}
								/>
							))}

						<StyledP>{word}</StyledP>
					</div>
				)
			})}
		</div>
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
	const getSectionName = () => {
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
	}
	const sectionName = getSectionName()

	const getHasChords = () => {
		// return true
		if (hideChords) return false
		return section.lines?.some((line) =>
			line.segments.some((segment) => segment.chord)
		)
	}
	const hasChords = getHasChords()

	const hasFirstLineText =
		section.lines?.[0]?.text && section.lines?.[0]?.text?.length > 0
	return (
		<div
			style={{
				display: 'flex',
				flexDirection: 'row',
			}}
		>
			<div
				style={{
					display: 'flex', // Explicitly set display to flex
					flexDirection: 'column',
					paddingTop: hasChords && hasFirstLineText ? chordHeight : 0,
				}}
			>
				{sectionName && (
					<StyledP
						style={{
							fontWeight: section.type === SectionType.CHORUS ? 600 : 400,
							width: '2rem',
							whiteSpace: 'nowrap',
						}}
					>
						{sectionName}
					</StyledP>
				)}
			</div>
			<div
				style={{
					display: 'flex', // Explicitly set display to flex
					flexDirection: 'column',
				}}
			>
				{section.lines ? (
					section.lines.map((line, index) => {
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
					})
				) : (
					<></>
				)}
				{!isLast && (
					<>
						<div style={{ height: sectionsGap, display: 'flex' }} />
					</>
				)}
			</div>
		</div>
	)
}

const DefaultStylePreview: SheetStyleComponentType = ({
	sheet,
	title,
	signature,
	columns,
	hideChords,
}) => {
	const getSections = () => {
		const r = sheet?.getSections() || []
		if (r.length == 0) {
			r.push(new Section(''))
		}
		return r
	}
	const sections = getSections()

	return (
		<div
			style={{
				display: 'flex',
				flexDirection: 'column',
			}}
		>
			{sections.map((section, index) => {
				return (
					<div
						key={section.name + index}
						style={{
							display: 'flex', // Explicitly set display to flex
							flexDirection: 'column',
							breakInside: 'avoid',
							gap: '1rem',
						}}
					>
						{index == 0 && title && (
							<>
								<div
									style={{
										display: 'flex', // Explicitly set display to flex
										marginBottom: 2,
									}}
								>
									<StyledP
										style={{
											fontSize: '1.25rem',
											fontWeight: 'bold',
											whiteSpace: 'nowrap',
										}}
									>
										{title}
									</StyledP>
								</div>
							</>
						)}

						<SectionComponent
							key={section.name + index}
							section={section}
							signature={signature}
							isLast={index === sections.length - 1}
							hideChords={hideChords}
						/>
					</div>
				)
			})}
		</div>
	)
}
export default DefaultStylePreview

import { Box } from '@mui/material'
import { CSSProperties } from 'react'

export type VideoProps = {
	src: string
	width?: string
	height?: string
	autoPlay?: boolean
	style?: CSSProperties
}

export function Video(props: VideoProps) {
	return (
		<Box
			style={{
				width: props.width || '100%',
				height: props.height || 'auto',
				...props.style,
			}}
		>
			<video
				controls
				preload="auto"
				autoPlay={props.autoPlay}
				style={{
					width: '100%',
					height: 'auto',
				}}
			>
				<source src={props.src} type="video/mp4" />
				{/* <track
                    src="/path/to/captions.vtt"
                    kind="subtitles"
                    srcLang="cs"
                    label="Čeština"
                /> */}
				Your browser does not support the video.
			</video>
		</Box>
	)
}

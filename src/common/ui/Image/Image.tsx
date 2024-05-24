import Img from 'next/image'
import { CSSProperties } from 'react'

type ImageProps = {
	src: string
	defaultSrc?: string
	alt: string
	width?: number | string
	height?: number | string
	style?: CSSProperties
}

export function Image({
	src,
	alt,
	defaultSrc = '/assets/default_image.webp',
	width = 100,
	height = 100,
	style,
}: ImageProps) {
	return (
		<Img
			src={src}
			alt={alt}
			placeholder="blur"
			blurDataURL={defaultSrc}
			width={5}
			height={5}
			style={{
				width: width,
				height: height,
				...style,
			}}
		>
			{/* {defaultSrc && <img src={defaultSrc} alt={alt} />} */}
		</Img>
	)
}

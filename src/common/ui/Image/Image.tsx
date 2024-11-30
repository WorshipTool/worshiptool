import Img from 'next/image'
import { CSSProperties } from 'react'

type ImageProps = {
	src: string
	defaultSrc?: string
	alt: string
	width?: number | string
	height?: number | string
	style?: CSSProperties
	fill?: boolean
}

export function Image({
	src,
	alt,
	defaultSrc = '/assets/default_image.webp',
	width = 100,
	height = 100,
	style,
	...props
}: ImageProps) {
	return (
		<Img
			src={src}
			alt={alt}
			// placeholder=""
			blurDataURL={defaultSrc}
			{...(props.fill
				? {
						fill: true,
				  }
				: {
						width: parseInt(width.toString()),
						height: parseInt(height.toString()),
				  })}
			style={{
				...(!props.fill
					? {
							width: width,
							height: height,
					  }
					: {}),
				...style,
			}}
			{...props}
		>
			{/* {defaultSrc && <img src={defaultSrc} alt={alt} />} */}
		</Img>
	)
}

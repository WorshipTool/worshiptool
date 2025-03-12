import { Box, useTheme } from '@/common/ui'
import { Skeleton } from '@/common/ui/mui/Skeleton'
import { useEffect, useState } from 'react'
import useYoutube from '../../../hooks/useYoutube'

type Props = {
	src: string
	width?: number | string
}

export default function YoutubeVideo({ src, ...props }: Props) {
	const [url, setUrl] = useState<string | null>(null)
	const { getEmbedUrl, getId } = useYoutube()
	useEffect(() => {
		const id = getId(src)
		if (id === null) {
			console.log('Invalid youtube url.')
			return
		}
		const emurl = getEmbedUrl(id)
		setUrl(emurl)
	}, [src])

	// Create a 16:9 ratio container
	// maximum width: 560px

	const theme = useTheme()
	return url ? (
		<iframe
			style={{
				width: props.width,
				aspectRatio: 16 / 9,
			}}
			src={url}
			title="YouTube video player"
			frameBorder="0"
			allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
			allowFullScreen
		></iframe>
	) : (
		<Box
			width={props.width}
			sx={{
				aspectRatio: 16 / 9,
			}}
		>
			<Skeleton width={'100%'} height={'100%'} variant="rectangular" />
		</Box>
	)
}

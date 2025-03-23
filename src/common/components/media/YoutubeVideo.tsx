import { Skeleton } from '@/common/ui/mui/Skeleton'
import useYoutube from '@/hooks/useYoutube'
import { useEffect, useMemo, useRef, useState } from 'react'

type Props = {
	url: string
	showInvalidVideo?: boolean
}

export default function YoutubeVideo({ url, ...props }: Props) {
	const [embedHtml, setEmbedHtml] = useState<string | null>(null)
	const [error, setError] = useState<boolean>(false)
	const containerRef = useRef<HTMLDivElement>(null)

	const height = useMemo(() => '40vh', [])
	const width = useMemo(() => '100%', [])

	const { getRealUrl } = useYoutube()

	useEffect(() => {
		const fetchEmbed = async () => {
			try {
				const baseUrl = getRealUrl(url)
				const urlString = `https://www.youtube.com/oembed?url=${baseUrl}&format=json`

				const response = await fetch(urlString)

				// if (!response.ok) throw new Error('Video not available')
				const data = await response.json()
				setEmbedHtml(data.html)
			} catch {
				setError(true)
			}
		}
		fetchEmbed()
	}, [url])

	useEffect(() => {
		if (embedHtml && containerRef.current) {
			const div = document.createElement('div')
			div.innerHTML = embedHtml
			const iframe = div.querySelector('iframe')
			if (iframe) {
				// const iframeSrc = iframe.getAttribute('src')
				// iframe.setAttribute('src', `${iframeSrc}&theme=0`)
				iframe.setAttribute('width', '100%')
				iframe.setAttribute('height', '100%')
				containerRef.current.innerHTML = div.innerHTML
			}
		}
	}, [embedHtml])

	return error ? (
		props.showInvalidVideo ? (
			<>
				<p>Video není dostupné.</p>
			</>
		) : null
	) : (
		<div
			ref={containerRef}
			style={{
				width: width,
				height: height,
			}}
		>
			{!embedHtml && (
				<Skeleton width={'100%'} height={'100%'} variant="rectangular" />
			)}
		</div>
	)

	// const [url, setUrl] = useState<string | null>(null)
	// const { getEmbedUrl, getId } = useYoutube()
	// useEffect(() => {
	// 	const id = getId(src)
	// 	if (id === null) {
	// 		console.log('Invalid youtube url.')
	// 		return
	// 	}
	// 	const emurl = getEmbedUrl(id)
	// 	setUrl(emurl)
	// }, [src])

	// // Create a 16:9 ratio container
	// // maximum width: 560px

	// const theme = useTheme()
	// return url ? (
	// 	<iframe
	// 		style={{
	// 			width: width,
	// 			aspectRatio: 16 / 9,
	// 			borderRadius: 10,
	// 		}}
	// 		src={url}
	// 		title="YouTube video player"
	// 		frameBorder="0"
	// 		allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
	// 		allowFullScreen
	// 	></iframe>
	// ) : (
	// 	<Box
	// 		sx={{
	// 			width: width,
	// 			aspectRatio: (16 / 9) * 0.987, // video is actually higher
	// 		}}
	// 	>
	// 		<Skeleton width={'100%'} height={'100%'} variant="rectangular" />
	// 	</Box>
	// )
}

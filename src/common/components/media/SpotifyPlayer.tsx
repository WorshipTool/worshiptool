import { Skeleton } from '@/common/ui/mui/Skeleton'
import { useEffect, useRef, useState } from 'react'

type SpotifyPlayerProps = {
	url: string
}

const HEIGHT = '80px'
const WIDTH = '100%'

const SpotifyPlayer = ({ url }: SpotifyPlayerProps) => {
	const [embedHTML, setEmbedHTML] = useState<string | null>(null)
	const containerRef = useRef<HTMLDivElement>(null)

	useEffect(() => {
		const fetchEmbedUrl = async () => {
			try {
				const response = await fetch(
					`https://open.spotify.com/oembed?url=${encodeURIComponent(url)}`
				)
				const data = await response.json()
				setEmbedHTML(data.html)
			} catch (error) {
				console.error('Error fetching Spotify embed URL:', error)
			}
		}

		fetchEmbedUrl()
	}, [url])

	useEffect(() => {
		if (embedHTML && containerRef.current) {
			const div = document.createElement('div')
			div.innerHTML = embedHTML
			const iframe = div.querySelector('iframe')
			if (iframe) {
				const iframeSrc = iframe.getAttribute('src')
				iframe.setAttribute('src', `${iframeSrc}&theme=0`)
				iframe.setAttribute('width', WIDTH)
				iframe.setAttribute('height', HEIGHT)
				containerRef.current.innerHTML = div.innerHTML
			}
		}
	}, [embedHTML])

	return (
		<div ref={containerRef}>
			{!embedHTML && (
				<Skeleton
					width={WIDTH}
					height={HEIGHT}
					variant="rectangular"
					sx={{
						borderRadius: 2,
					}}
				/>
			)}
		</div>
	)
}

export default SpotifyPlayer

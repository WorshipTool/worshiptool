'use client'

export default function useYoutube() {
	const getId = (url: string): string | null => {
		try {
			// Dekóduj URL (pro případ, že je procentně kódovaná)
			const decodedUrl = decodeURIComponent(url)

			const regExp =
				/(?:youtube(?:-nocookie)?\.com\/(?:.*[?&]v=|embed\/|v\/|shorts\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/
			const match = decodedUrl.match(regExp)

			return match ? match[1] : null
		} catch {
			return null
		}
	}

	const getEmbedUrl = (id: string) => {
		return 'https://www.youtube-nocookie.com/embed/' + id
	}

	const getRealUrl = (url: string) => {
		const id = getId(url)
		return `https://www.youtube.com/watch?v=${id}`
	}

	return {
		getId,
		getEmbedUrl,
		getRealUrl,
	}
}

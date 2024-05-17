'use client'

import { useState } from 'react'

export default function useYoutube() {
	const [id, setId] = useState<string>()

	const getId = (url: string) => {
		const regExp =
			/^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#&?]*).*/
		const match = url.match(regExp)
		const id = match && match[7].length == 11 ? match[7] : null
		return id
	}

	const getEmbedUrl = (id: string) => {
		return 'https://www.youtube-nocookie.com/embed/' + id
	}

	return {
		getId,
		getEmbedUrl,
	}
}

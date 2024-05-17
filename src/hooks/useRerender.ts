'use client'

import { useState } from 'react'

// Returns a function that can be called to force a rerender of the component that calls it.
export const useRerender = () => {
	const [, setRerender] = useState({})
	return () => setRerender({})
}

'use client'
import { Button } from '@/common/ui'
import { useState } from 'react'

export const TestClient = () => {
	const [show, setShow] = useState(false)

	return (
		<>
			<Button onClick={() => setShow((v) => !v)}>Testuju</Button>

			{/* <TestServer show={true} /> */}
		</>
	)
}

'use client'
import { Button } from '@/common/ui/Button'

export default function MoreButton() {
	const onClick = () => {
		const toY = window.innerHeight - 56

		window.scrollTo({
			top: toY,
			behavior: 'smooth',
		})
	}
	return (
		<Button color="primarygradient" onClick={onClick}>
			Dozvědět se víc
		</Button>
	)
}

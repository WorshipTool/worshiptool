import { Background } from '@/common'

type BackgroundProps = {
	children?: React.ReactNode
}

export default function Layout(props: BackgroundProps) {
	return (
		<>
			<Background />
			{props.children}
		</>
	)
}

import { Background } from '@/common'
import { LayoutProps } from '@/common/types'

export default function Layout(props: LayoutProps) {
	return (
		<>
			<Background />
			{props.children}
		</>
	)
}

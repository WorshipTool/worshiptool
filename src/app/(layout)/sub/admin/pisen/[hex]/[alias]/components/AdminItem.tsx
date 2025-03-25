import { Typography } from '@/common/ui'

type AdminItemProps = {
	title: string
	value?: any
	children?: any
}

export default function AdminItem(props: AdminItemProps) {
	return (
		<Typography small>
			{props.title}: {'\t'}
			<strong>
				{props.value}
				{props.children}
			</strong>
		</Typography>
	)
}

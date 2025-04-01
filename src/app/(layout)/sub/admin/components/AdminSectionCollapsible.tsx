'use client'
import { Box } from '@/common/ui'
import { ArrowDropDown, ArrowDropUp } from '@mui/icons-material'
import { useState } from 'react'

type Props = {
	title: string
	children: React.ReactNode
}

export default function AdminSectionCollapsible(props: Props) {
	const [collapsed, setCollapsed] = useState<boolean>(true)
	return (
		<Box display={'flex'} flexDirection={'column'}>
			<Box
				sx={{
					padding: 1.5,
					userSelect: 'none',
					cursor: 'pointer',
					display: 'flex',
					gap: 1,

					border: '1px solid',
					borderColor: 'grey.400',
					bgcolor: 'grey.300',
					'&:hover': {
						bgcolor: 'grey.400',
					},
					transition: 'all 0.3s',
					// borderRadius: 3,
				}}
				onClick={() => setCollapsed((a) => !a)}
			>
				{collapsed ? (
					<ArrowDropDown fontSize="small" />
				) : (
					<ArrowDropUp fontSize="small" />
				)}
				{props.title}
			</Box>
			<Box
				sx={{
					display: collapsed ? 'none' : 'block',
				}}
			>
				{props.children}
			</Box>
		</Box>
	)
}

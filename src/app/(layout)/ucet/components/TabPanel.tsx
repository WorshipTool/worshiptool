import React from 'react'

interface TabPanelProps {
	children?: React.ReactNode
	index: number
	value: number
}

export default function TabPanel(props: TabPanelProps) {
	const { children, value, index, ...other } = props

	return (
		<div
			role="tabpanel"
			hidden={value !== index}
			id={`vertical-tabpanel-${index}`}
			aria-labelledby={`vertical-tab-${index}`}
			{...other}
		>
			{
				value === index &&
					//   <Card sx={{padding:2, marginLeft: 2 }}>
					children
				//   </Card>
			}
		</div>
	)
}

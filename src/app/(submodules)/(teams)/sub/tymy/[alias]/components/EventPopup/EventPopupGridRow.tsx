import { Typography } from '@/common/ui/Typography'
import { Grid } from '@mui/material'
import React from 'react'

type EventPopupGridRowProps = {
	children?: React.ReactNode
	label: string
}

export default function EventPopupGridRow(props: EventPopupGridRowProps) {
	return (
		<>
			<Grid
				item
				xs={3}
				sx={{
					userSelect: 'none',
				}}
			>
				<Typography color="grey.700">{props.label}</Typography>
			</Grid>
			<Grid
				item
				xs={9}
				display={'flex'}
				flexDirection={'row'}
				gap={1}
				flexWrap={'wrap'}
			>
				{props.children}
			</Grid>
		</>
	)
}

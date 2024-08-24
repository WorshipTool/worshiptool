'use client'
import { Masonry } from '@mui/lab'
import { Grid, useTheme } from '@mui/material'
import { ResponsiveStyleValue } from '@mui/system'
import { useMemo } from 'react'
import { SongVariantDto } from '../../../../api/dtos'
import { SongCard } from '../../../ui/SongCard'

type CommmonProps = {
	data: SongVariantDto[]
}

type ListProps = CommmonProps & {
	variant: 'list'
}

type MasonryGridProps = CommmonProps & {
	variant?: 'masonrygrid'
	columns?: ResponsiveStyleValue<string | number>
}

type RowProps = CommmonProps & {
	variant: 'row'
	columns?: ResponsiveStyleValue<string | number>
}

export type SongListCardsProps = ListProps | MasonryGridProps | RowProps

export default function SongListCards(props: SongListCardsProps) {
	const theme = useTheme()
	const spacing = 1

	let columns: ResponsiveStyleValue<string | number> = useMemo(() => {
		switch (props.variant) {
			case 'list':
				return 1
				break
			case undefined:
			case 'masonrygrid':
			case 'row':
				return {
					xs: 1,
					md: 2,
					lg: 4,
				}
		}
	}, [props])

	return props.data.length === 0 ? (
		<></>
	) : props.variant === 'row' ? (
		<Grid container columns={{ xs: 1, md: 2, lg: 4 }} spacing={spacing}>
			{props.data.map((v) => {
				return (
					<Grid item key={v.guid} xs={1}>
						<SongCard
							data={v}
							publicityMode="privateandloader"
							flexibleHeght={false}
						/>
					</Grid>
				)
			})}
		</Grid>
	) : (
		<Masonry
			columns={columns}
			sx={{
				marginLeft: -(spacing / 2),
				width: `calc(100% + ${theme.spacing(spacing)})`,
			}}
			spacing={spacing}
		>
			{props.data.map((v) => {
				return (
					<SongCard
						data={v}
						key={v.guid}
						publicityMode="privateandloader"
						flexibleHeght
					/>
				)
			})}
		</Masonry>
	)
}

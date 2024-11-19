'use client'
import { Masonry } from '@/common/ui/Masonry'
import { Grid } from '@/common/ui/mui/Grid'
import { ResponsiveStyleValue } from '@mui/system'
import { ComponentProps, memo, useCallback, useMemo } from 'react'
import { SongVariantDto } from '../../../../api/dtos'
import { SongCard } from '../../../ui/SongCard'

type CommmonProps = {
	data: SongVariantDto[]
	properties?: ComponentProps<typeof SongCard>['properties']
	cardToLinkProps?: ComponentProps<typeof SongCard>['toLinkProps']
	onCardClick?: (data: SongVariantDto) => void

	// Selecting
	onCardSelect?: (data: SongVariantDto) => void
	onCardDeselect?: (data: SongVariantDto) => void
	selectable?: boolean
	cardIcons?: ComponentProps<typeof SongCard>['icons']
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

export const SongListCard = memo(function SongListCards({
	data: _data,
	...props
}: SongListCardsProps) {
	// unique
	const data = _data
		.filter((v) => v !== undefined)
		.filter((v, i, a) => a.findIndex((t) => t.guid === v.guid) === i)

	const spacing = 1

	let columns: ResponsiveStyleValue<number> = useMemo(() => {
		switch (props.variant) {
			case 'list':
				return 1
			case undefined:
			case 'masonrygrid':
			case 'row':
				return {
					xs: 1,
					md: 2,
					lg: 4,
					xl: 5,
				}
		}
	}, [props])

	const CommonCard = useCallback(
		({
			v,
			flexibleHeight = true,
		}: {
			v: SongVariantDto
			flexibleHeight?: boolean
		}) => {
			return (
				<SongCard
					data={v}
					key={v.guid}
					flexibleHeight={flexibleHeight}
					toLinkProps={props.cardToLinkProps}
					properties={props.properties}
					onClick={() => {
						props.onCardClick && props.onCardClick(v)
					}}
					selectable={props.selectable}
					onSelect={() => {
						props.onCardSelect && props.onCardSelect(v)
					}}
					onDeselect={() => {
						props.onCardDeselect && props.onCardDeselect(v)
					}}
					icons={props.cardIcons}
				/>
			)
		},
		[props]
	)

	return data.length === 0 ? (
		<></>
	) : props.variant === 'row' ? (
		<Grid container columns={{ xs: 1, md: 2, lg: 4, xl: 5 }} spacing={spacing}>
			{data.map((v) => {
				return (
					<Grid item key={v.guid} xs={1}>
						<CommonCard v={v} flexibleHeight={false} />
					</Grid>
				)
			})}
		</Grid>
	) : (
		<Masonry
			columns={columns}
			sx={{
				width: `100%`,
			}}
			spacing={spacing}
		>
			{data.map((v) => {
				return <CommonCard v={v} key={v.guid} />
			})}
		</Masonry>
	)
})
export default SongListCard

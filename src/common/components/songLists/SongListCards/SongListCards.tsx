'use client'
import { useTheme } from '@/common/ui'
import { Grid } from '@/common/ui/mui/Grid'
import { Masonry } from '@/common/ui/mui/lab'
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

export const SongListCard = memo(function SongListCards(
	props: SongListCardsProps
) {
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
				/>
			)
		},
		[props]
	)

	return props.data.length === 0 ? (
		<></>
	) : props.variant === 'row' ? (
		<Grid container columns={{ xs: 1, md: 2, lg: 4 }} spacing={spacing}>
			{props.data.map((v) => {
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
				marginLeft: -(spacing / 2),
				width: `calc(100% + ${theme.spacing(spacing)})`,
			}}
			spacing={spacing}
		>
			{props.data.map((v) => {
				return <CommonCard v={v} key={v.guid} />
			})}
		</Masonry>
	)
})
export default SongListCard

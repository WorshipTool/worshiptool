import { FavouriteItem } from '@/app/(layout)/ucet/oblibene/page'
import Menu from '@/common/components/Menu/Menu'
import { Box, Chip, IconButton, Tooltip, Typography } from '@/common/ui'
import DraggableSong from '@/hooks/dragsong/DraggableSong'
import { useFavourites } from '@/hooks/favourites/useFavourites'
import { parseVariantAlias } from '@/routes/routes.tech'
import { useSmartNavigate } from '@/routes/useSmartNavigate'
import {
	KeyboardArrowLeft,
	MoreHoriz,
	PlaylistRemove,
} from '@mui/icons-material'
import { useMemo, useState } from 'react'

type FavouritesRowItemProps = {
	data: FavouriteItem
	index: number
}

export default function FavouritesRowItem(props: FavouritesRowItemProps) {
	const variant = props.data.data.variant

	const hintText = useMemo(() => {
		return variant.sheet.getSections()[0].text
	}, [variant])

	const navigate = useSmartNavigate()
	const onOpenClick = () => {
		if (props.data.teamAlias) {
			const variantAlias = parseVariantAlias(variant.packAlias)
			navigate('teamSong', {
				hex: variantAlias.hex,
				'title-alias': variantAlias.alias,
				alias: props.data.teamAlias,
				edit: false,
			})
		} else {
			navigate('variant', {
				...parseVariantAlias(variant.packAlias),
			})
		}
	}
	const [open, setOpen] = useState(false)
	const [anchor, setAnchor] = useState<null | HTMLElement>(null)

	const { remove, loading } = useFavourites()

	const onRemove = () => {
		remove(variant.packGuid)
	}
	return (
		<>
			<DraggableSong
				data={{
					packGuid: variant.packGuid,
					alias: variant.packAlias,
					title: variant.preferredTitle,
				}}
			>
				<Box
					sx={{
						bgcolor: 'grey.100',
						borderRadius: 2,
						gap: 1,
						'&:hover': {
							bgcolor: 'grey.200',
						},
						'&:active': {
							bgcolor: 'grey.300',
						},
						transition: 'all 0.2s',
						userSelect: 'none',
						cursor: 'pointer',
						paddingRight: 2,
					}}
					display={'flex'}
					alignItems={'center'}
					justifyContent={'space-between'}
					onDoubleClick={onOpenClick}
				>
					<Box
						display={'flex'}
						alignItems={'center'}
						flex={1}
						sx={{
							padding: 2,
							paddingLeft: 4,
						}}
						onClick={onOpenClick}
					>
						<Typography
							sx={{
								paddingRight: 4,
								userSelect: 'none',
								// padding: 2,
							}}
						>
							{props.index + 1}
						</Typography>
						<Box display={'flex'} flexDirection={'column'}>
							<Box display={'flex'} gap={1}>
								<Typography strong>{variant.preferredTitle}</Typography>
								{props.data.teamName && (
									<Tooltip label="Píseň vytvořena v rámci týmu">
										<Chip
											label={props.data.teamName}
											size="small"
											color="primary"
										/>
									</Tooltip>
								)}
							</Box>
							<Typography
								color={'grey.600'}
								small
								thin
								sx={{
									userSelect: 'none',
								}}
							>
								{hintText.substring(0, 100)}
							</Typography>
						</Box>
					</Box>

					<IconButton
						disabled={loading}
						onClick={(e) => {
							e.stopPropagation()
							e.preventDefault()

							setOpen(true)
							setAnchor(e.currentTarget)
						}}
					>
						<MoreHoriz />
					</IconButton>
				</Box>
			</DraggableSong>
			<Menu
				open={open}
				anchor={anchor}
				onClose={() => setOpen(false)}
				items={[
					{
						title: 'Otevřít',
						onClick: onOpenClick,
						icon: <KeyboardArrowLeft />,
					},
					{
						title: 'Odebrat',
						subtitle: 'Odebrat z oblíbených',
						onClick: onRemove,
						icon: <PlaylistRemove />,
						disabled: loading,
					},
				]}
			/>
		</>
	)
}

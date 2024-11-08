import { SongVariantDto } from '@/api/dtos'
import Menu from '@/common/components/Menu/Menu'
import { Box, IconButton, Typography } from '@/common/ui'
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
	data: SongVariantDto
	index: number
}

export default function FavouritesRowItem(props: FavouritesRowItemProps) {
	const hintText = useMemo(() => {
		return props.data.sheet.getSections()[0].text
	}, [props.data])

	const navigate = useSmartNavigate()
	const onOpenClick = () => {
		navigate('variant', {
			...parseVariantAlias(props.data.packAlias),
		})
	}
	const [open, setOpen] = useState(false)
	const [anchor, setAnchor] = useState<null | HTMLElement>(null)

	const { remove, loading } = useFavourites()

	const onRemove = () => {
		remove(props.data.packGuid)
	}
	return (
		<>
			<DraggableSong
				data={{
					packGuid: props.data.packGuid,
					alias: props.data.packAlias,
					title: props.data.preferredTitle,
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
							<Typography strong>{props.data.preferredTitle}</Typography>
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

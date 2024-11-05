import { MySongsOrderOptions } from '@/app/(layout)/ucet/pisne/components/MySongListOrderSelect'
import Menu from '@/common/components/Menu/Menu'
import Popup from '@/common/components/Popup/Popup'
import { Button } from '@/common/ui/Button'
import { IconButton } from '@/common/ui/IconButton'
import { Typography } from '@/common/ui/Typography'
import { useApi } from '@/hooks/api/useApi'
import DraggableSong from '@/hooks/dragsong/DraggableSong'
import { parseVariantAlias } from '@/routes/routes.tech'
import { useSmartNavigate } from '@/routes/useSmartNavigate'
import { useApiState } from '@/tech/ApiState'
import { getSmartDateAgoString } from '@/tech/date/date.tech'
import { Delete, KeyboardArrowLeft, MoreHoriz } from '@mui/icons-material'
import { Box } from '@mui/material'
import { useState } from 'react'
import { SongVariantDto } from '../../../../../api/dtos'
import { Link } from '../../../../../common/ui/Link/Link'

interface MySongItemProps {
	variant: SongVariantDto
	index: number

	sortKey: MySongsOrderOptions
	onDelete: () => void
}

export default function MySongItem(props: MySongItemProps) {
	const [openMenu, setOpenMenu] = useState(false)
	const [anchor, setAnchor] = useState<null | HTMLElement>(null)

	const [openDialog, setOpenDialog] = useState(false)

	const getHintText = () => {
		return props.variant.sheet.getSections()[0].text
	}

	const variantParams = {
		...parseVariantAlias(props.variant.packAlias),
		title: props.variant.preferredTitle,
	}

	const showDate =
		props.sortKey === 'createdAt'
			? props.variant.packCreatedAt
			: props.sortKey === 'updatedAt'
			? props.variant.createdAt
			: null
	const showDateString = showDate ? getSmartDateAgoString(showDate) : null

	const navigate = useSmartNavigate()
	const openVariant = () => {
		navigate('variant', variantParams)
	}

	const { songDeletingApi } = useApi()
	const { fetchApiState, apiState } = useApiState()

	const deleteSong = () => {
		fetchApiState(
			async () => {
				return await songDeletingApi.songDeletingControllerDelete(
					props.variant.packGuid
				)
			},
			() => {
				props.onDelete()
			}
		)
	}

	return (
		<>
			<DraggableSong
				data={{
					packGuid: props.variant.packGuid,
					alias: props.variant.packAlias,
					title: props.variant.preferredTitle,
				}}
			>
				<Box
					sx={{
						display: 'flex',
						flexDirection: 'row',
						gap: 4,
						paddingRight: 2,
						alignItems: 'center',
						// backgroundColor: props.index % 2 == 0 ? '#e0e0e0' : '#e6e6e6',
						bgcolor: 'grey.100',
						borderRadius: 2,
						// cursor: 'pointer',
						'&:hover': {
							bgcolor: 'grey.200',
						},
						'&:active': {
							bgcolor: 'grey.300',
						},
						transition: 'all 0.2s',
					}}
					onDoubleClick={openVariant}
				>
					<Box
						display={'flex'}
						gap={4}
						flex={1}
						alignItems={'center'}
						sx={{
							cursor: 'pointer',
							padding: 2,
							paddingLeft: 4,
						}}
						onClick={openVariant}
					>
						<Typography>{props.index + 1}</Typography>
						<Box flex={1}>
							<Link to="variant" params={variantParams}>
								<Typography
									strong={500}
									sx={{
										textOverflow: 'ellipsis',
										overflow: 'hidden',
										whiteSpace: 'nowrap',
									}}
								>
									{props.variant.preferredTitle}
								</Typography>
							</Link>
							<Typography
								size={'small'}
								sx={{
									display: {
										xs: 'none',
										sm: 'none',
										md: 'block',
									},
									textOverflow: 'ellipsis',
									overflow: 'hidden',
									whiteSpace: 'nowrap',
									maxWidth: 400,
								}}
								thin
								color="grey.700"
							>
								{getHintText().substring(0, 100)}...
							</Typography>
						</Box>
					</Box>
					<Typography
						thin
						color="grey.500"
						noWrap
						sx={{
							width: 150,
						}}
					>
						{showDateString}
					</Typography>
					<Box
						display={{
							xs: 'none',
							sm: 'block',
						}}
					>
						<Typography thin color="grey.500">
							{props.variant.public ? 'Veřejné' : 'Soukromé'}
						</Typography>
					</Box>

					<IconButton
						onClick={(e) => {
							setAnchor(e.currentTarget)
							setOpenMenu(true)
							e.stopPropagation()
							e.preventDefault()
						}}
					>
						<MoreHoriz />
					</IconButton>
				</Box>
			</DraggableSong>
			<Menu
				open={openMenu}
				anchor={anchor}
				onClose={() => setOpenMenu(false)}
				items={[
					{
						title: 'Otevřít',
						onClick: () => {
							openVariant()
						},
						icon: <KeyboardArrowLeft />,
					},
					{
						title: <Typography color="error">Smazat</Typography>,
						onClick: () => {
							setOpenDialog(true)
						},
						icon: <Delete color="error" />,
					},
				]}
			/>

			<Popup
				open={openDialog}
				onClose={() => setOpenDialog(false)}
				title="Opravdu chcete odstranit píseň?"
				width={400}
				actions={
					<>
						<Button variant="outlined" type="reset" disabled={apiState.loading}>
							Zrušit
						</Button>
						<Button
							loading={apiState.loading}
							onClick={() => {
								deleteSong()
								setOpenDialog(false)
							}}
							color="error"
							variant="contained"
						>
							Smazat
						</Button>
					</>
				}
			>
				<Typography>
					Chcete opravdu smazat píseň{' '}
					<strong>{props.variant.preferredTitle}</strong>? Tato akce je
					nevratná.
				</Typography>
			</Popup>
		</>
	)
}

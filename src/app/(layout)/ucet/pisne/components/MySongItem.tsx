import { MySongsOrderOptions } from '@/app/(layout)/ucet/pisne/components/MySongListOrderSelect'
import { IconButton } from '@/common/ui/IconButton'
import { Typography } from '@/common/ui/Typography'
import DraggableSong from '@/hooks/dragsong/DraggableSong'
import { parseVariantAlias } from '@/routes/routes.tech'
import { getSmartDateAgoString } from '@/tech/date/date.tech'
import { MoreHoriz } from '@mui/icons-material'
import { Box } from '@mui/material'
import { SongVariantDto } from '../../../../../api/dtos'
import { Link } from '../../../../../common/ui/Link/Link'

interface MySongItemProps {
	variant: SongVariantDto
	index: number

	sortKey: MySongsOrderOptions
}

export default function MySongItem(props: MySongItemProps) {
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

	return (
		<DraggableSong
			data={{
				packGuid: props.variant.packGuid,
				alias: props.variant.packAlias,
				title: props.variant.preferredTitle,
			}}
		>
			<Link to="variant" params={variantParams}>
				<Box
					sx={{
						display: 'flex',
						flexDirection: 'row',
						gap: 4,
						alignItems: 'center',
						padding: 2,
						paddingLeft: 4,
						// backgroundColor: props.index % 2 == 0 ? '#e0e0e0' : '#e6e6e6',
						bgcolor: 'grey.100',
						borderRadius: 2,
						cursor: 'pointer',
						'&:hover': {
							bgcolor: 'grey.200',
						},
						'&:active': {
							bgcolor: 'grey.300',
						},
						transition: 'all 0.2s',
					}}
				>
					<Box display={'flex'} gap={4} flex={1} alignItems={'center'}>
						<Typography>{props.index + 1}</Typography>
						<Box flex={1}>
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

					<Typography thin color="grey.500" noWrap>
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

					<IconButton>
						<MoreHoriz />
					</IconButton>

					{/* <Button to={'variant'} toParams={variantParams} variant="text">
						Otevřít
					</Button> */}
				</Box>
			</Link>
		</DraggableSong>
	)
}

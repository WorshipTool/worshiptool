import { IconButton } from '@/common/ui/IconButton'
import { Typography } from '@/common/ui/Typography'
import DraggableSong from '@/hooks/dragsong/DraggableSong'
import { parseVariantAlias } from '@/routes/routes.tech'
import { MoreHoriz } from '@mui/icons-material'
import { Box } from '@mui/material'
import { SongVariantDto } from '../../../../../api/dtos'
import { Gap } from '../../../../../common/ui/Gap'
import { Link } from '../../../../../common/ui/Link/Link'

interface MySongItemProps {
	variant: SongVariantDto
	index: number
}

export default function MySongItem(props: MySongItemProps) {
	const getHintText = () => {
		return props.variant.sheet.getSections()[0].text
	}

	const variantParams = {
		...parseVariantAlias(props.variant.packAlias),
		title: props.variant.preferredTitle,
	}

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
						gap: 2,
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
					<Typography>{props.index + 1}</Typography>
					<Gap value={1} />
					<Box
						flex={1}
						sx={{
							overflow: 'hidden',
							textOverflow: 'ellipsis',
						}}
					>
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
							}}
							thin
							color="grey.700"
						>
							{getHintText().substring(0, 100)}...
						</Typography>
					</Box>
					<Box
						display={{
							xs: 'none',
							sm: 'block',
						}}
					>
						<Typography size={'small'}>
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

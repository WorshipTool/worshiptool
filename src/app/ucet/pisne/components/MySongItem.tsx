import { Box, Typography } from '@mui/material'
import { SongVariantDto } from '../../../../api/dtos'
import { Button } from '../../../../common/ui/Button'
import { Gap } from '../../../../common/ui/Gap'
import { Link } from '../../../../common/ui/Link/CustomLink'
import { parseVariantAlias } from '../../../../routes'

interface MySongItemProps {
	variant: SongVariantDto
	index: number
}

export default function MySongItem(props: MySongItemProps) {
	const getHintText = () => {
		return props.variant.sheet.getSections()[0].text
	}

	const variantParams = {
		...parseVariantAlias(props.variant.alias),
		title: props.variant.preferredTitle,
	}

	return (
		<Link to="variant" params={variantParams}>
			<Box
				sx={{
					display: 'flex',
					flexDirection: 'row',
					gap: 2,
					alignItems: 'center',
					padding: 2,
					paddingLeft: 4,
					paddingRight: 5,
					backgroundColor: '#e0e0e0',
					borderRadius: 1,
					cursor: 'pointer',
					'&:hover': {
						backgroundColor: '#d0d0d0',
					},
				}}
			>
				<Typography variant="subtitle2">{props.index}</Typography>
				<Gap value={1} />
				<Box
					flex={1}
					sx={{
						overflow: 'hidden',
						textOverflow: 'ellipsis',
					}}
				>
					<Typography variant="subtitle2" flex={1}>
						{props.variant.preferredTitle}
					</Typography>
					<Typography variant="caption" noWrap gutterBottom>
						{getHintText()}
					</Typography>
				</Box>
				<Box>
					<Typography variant="caption">
						{props.variant.verified ? 'Veřejné' : 'Soukromé'}
					</Typography>
				</Box>
				<Button to={'variant'} toParams={variantParams} variant="text">
					Otevřít
				</Button>
			</Box>
		</Link>
	)
}

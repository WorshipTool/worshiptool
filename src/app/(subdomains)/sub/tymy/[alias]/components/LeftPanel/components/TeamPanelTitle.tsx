import { Clickable } from '@/common/ui/Clickable'
import { Link } from '@/common/ui/Link/Link'
import { Typography } from '@/common/ui/Typography'
import { Box } from '@mui/material'
import Image from 'next/image'

type TeamPanelTitleProps = {
	teamAlias: string
}

export default function TeamPanelTitle(props: TeamPanelTitleProps) {
	return (
		<Box
			display={'flex'}
			flexDirection={'column'}
			justifyContent={'center'}
			alignItems={'center'}
			padding={3}
			gap={1}
		>
			<Typography color="grey.800">Chválící tým</Typography>
			<Link
				to="team"
				params={{
					alias: props.teamAlias,
				}}
			>
				<Clickable>
					<Box
						display={'flex'}
						flexDirection={'row'}
						justifyContent={'center'}
						alignItems={'center'}
						gap={1}
					>
						<Box
							width={'3rem'}
							sx={{
								aspectRatio: '2/1',
							}}
							position={'relative'}
						>
							<Image
								src={'/assets/13ka-icon.png'}
								alt={'Logo skupiny'}
								fill
								objectFit={'contain'}
							/>
						</Box>
						<Typography variant="h4">Třináctka</Typography>
					</Box>
				</Clickable>
			</Link>
		</Box>
	)
}

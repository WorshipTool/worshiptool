'use client'
import useInnerTeam from '@/app/(subdomains)/sub/tymy/hooks/useInnerTeam'
import { Clickable } from '@/common/ui/Clickable'
import { Link } from '@/common/ui/Link/Link'
import { Typography } from '@/common/ui/Typography'
import { Box } from '@mui/material'

export default function TeamPanelTitle() {
	const { name, alias } = useInnerTeam()
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
					alias,
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
						{/* <Box
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
						</Box> */}
						<Typography variant="h4">{name}</Typography>
					</Box>
				</Clickable>
			</Link>
		</Box>
	)
}

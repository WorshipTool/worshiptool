'use client'
import { Box, Image, Typography } from '@/common/ui'
import { Link } from '@/common/ui/Link/Link'
import { getAssetUrl } from '@/tech/paths.tech'

export default function CollaborationWithWorshipkoCard() {
	// const navigate = useSmartNavigate()

	// const onJoinClick = () => {
	// 	navigate('contact', {
	// 		wantToJoin: true,
	// 	})
	// }
	return (
		<Box
			display={'flex'}
			flexDirection={'row'}
			justifyContent={'center'}
			gap={2}
			flexWrap={'wrap'}
			flex={1}
			paddingY={2}
			sx={{
				bgcolor: 'grey.300',
				border: '1px solid',
				borderColor: 'grey.400',
				borderRadius: 5,
			}}
		>
			<Link href={'https://worshipko.com' as any} target="_blank" external>
				<Box
					display={'flex'}
					flexDirection={'row'}
					alignItems={'center'}
					gap={2}
				>
					<Typography variant="h5" noWrap thin>
						Vytvořeno ve spolupráci s
					</Typography>
					<Image
						src={getAssetUrl('worshipko.png')}
						alt={'Logo worshipko.com'}
						height={70}
						width={240}
						style={{
							objectFit: 'contain',
						}}
					/>
				</Box>
			</Link>
		</Box>
	)
}

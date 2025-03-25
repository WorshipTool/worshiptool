'use client'
import { Box, Image } from '@/common/ui'
import { getRouteUrlWithParams } from '@/routes/routes.tech'
import { useSmartParams } from '@/routes/useSmartParams'

type Props = {
	width: number
	height: number
}

export default function AdminSongPreview(props: Props) {
	const params = useSmartParams('adminPack')
	const image = getRouteUrlWithParams('variantPreviewImage', params)
	return (
		<Box
			sx={{
				bgcolor: 'grey.100',
				borderRadius: 3,
				display: 'flex',
				position: 'relative',
				width: props.width,
				height: props.height,
				border: '1px solid',
				borderColor: 'grey.400',
				overflow: 'hidden',

				'&:hover #preview-placeholder': {
					opacity: 1,
				},
			}}
		>
			<Image
				src={image}
				alt={'Náhled písně'}
				fill
				style={{
					objectFit: 'cover',
					objectPosition: ' 0 0',
				}}
			/>

			{/* <Box
				id={'preview-placeholder'}
				sx={{
					position: 'absolute',
					bottom: 0,
					right: 0,
					left: 0,
					top: 0,
					display: 'flex',
					justifyContent: 'center',
					alignItems: 'center',
					bgcolor: 'rgba(0,0,0,0.01)',
					opacity: 0,
					color: 'white',
					transition: 'opacity 0.3s',
				}}
			>
				<Box
					sx={{
						bgcolor: 'primary.dark',
						borderRadius: 3,
						padding: 1,
					}}
				>
					Otevřít
				</Box>
			</Box> */}
		</Box>
	)
}

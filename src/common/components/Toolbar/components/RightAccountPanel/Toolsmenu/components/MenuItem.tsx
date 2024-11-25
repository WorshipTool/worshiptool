'use client'
import { Box, Typography } from '@/common/ui'
import { Image } from '@/common/ui/Image'
import { CommonLinkProps, Link } from '@/common/ui/Link/Link'
import { styled } from '@/common/ui/mui'
import { RoutesKeys } from '@/routes'
import { useApiStateEffect } from '@/tech/ApiState'
import { useMemo } from 'react'
import { MenuItemProps } from '../hooks/useToolsMenuItems'

const Container = styled(Box)(({ theme }) => ({
	display: 'flex',
	flexDirection: 'column',
	width: 80,
	height: 80,
	borderRadius: 10,
	transition: 'all 0.2s ease',
	backgroundColor: 'transparent',
	'&:hover': {
		backgroundColor: '#00000011',
	},
	'&:active': {
		backgroundColor: '#00000022',
	},
	'&:hover > *': {
		transform: 'scale(102%)',
		filter: 'drop-shadow(1px 4px 2px #00000011)',
	},
	'&:active > *': {
		transform: 'scale(96%)',
	},
}))

export default function ToolsMenuItem<T extends RoutesKeys>(
	props: MenuItemProps<T>
) {
	const [apiState] = useApiStateEffect<string | null>(async () => {
		// return null
		if (!props.asyncImage) return null
		return await props.asyncImage()
	}, [])

	const imageUrl = useMemo(() => {
		return apiState.data || props.image
	}, [apiState.data, props.image])

	const Component = () => (
		<Container
			onClick={(e) => {
				props.action?.()
			}}
			sx={{
				pointerEvents: props.disabled ? ' none' : 'auto',
				filter: props.disabled ? 'grayscale(100%)' : '',
				opacity: props.disabled ? 0.5 : 1,
				userSelect: 'none',
			}}
		>
			<Box
				flex={1}
				display={'flex'}
				flexDirection={'column'}
				sx={{
					...props.sx,
					transition: 'all 0.4s ease',
				}}
			>
				<Box
					flex={1}
					display={'flex'}
					justifyContent={'center'}
					alignItems={'center'}
					sx={{
						filter: 'drop-shadow(1px 4px 2px #00000033)',
					}}
				>
					<Image
						alt={props.title}
						src={imageUrl}
						height={50}
						width={60}
						style={{
							objectFit: 'contain',
							pointerEvents: 'none',
							userSelect: 'none',
						}}
					/>
				</Box>
				<Typography
					size={'0.9rem'}
					sx={{
						display: 'flex',
						alignItems: 'end',
						justifyContent: 'center',
						userSelect: 'none',
						pointerEvents: 'none',
						textAlign: 'center',
						lineHeight: 1,
						paddingBottom: 0.4,
						paddingTop: 0.3,
					}}
				>
					{props.title}
				</Typography>
			</Box>
		</Container>
	)

	const typedParams: CommonLinkProps<T>['params'] =
		props.toParams as CommonLinkProps<T>['params']

	return props.to ? (
		<Link to={props.to} params={typedParams}>
			{Component()}
		</Link>
	) : (
		Component()
	)
}

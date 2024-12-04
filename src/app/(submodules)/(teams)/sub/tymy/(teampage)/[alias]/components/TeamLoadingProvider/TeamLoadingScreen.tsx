import { Background } from '@/common'
import { Box, Image, Typography } from '@/common/ui'
import './team.loading.styles.css'

type TeamLoadingScreenProps = {
	isVisible: boolean
	teamTitle?: string
	teamLogoUrl?: string
}

export default function TeamLoadingScreen({
	isVisible,
	...props
}: TeamLoadingScreenProps) {
	// const url = getImage

	return (
		<div
			style={{
				position: 'fixed',
				zIndex: 10000,
				top: 0,
				left: 0,
				right: 0,
				bottom: 0,
				opacity: isVisible ? 1 : 0,
				pointerEvents: isVisible ? 'all' : 'none',
				transition: 'opacity 0.2s',
			}}
		>
			<Background />
			<Box
				sx={{
					display: 'flex',
					justifyContent: 'center',
					alignItems: 'center',
					height: '100vh',
					flexDirection: 'column',
				}}
			>
				{props.teamLogoUrl ? (
					<Box className={'logo-image'}>
						<Image src={props.teamLogoUrl} alt="Logo týmu" />
					</Box>
				) : (
					<>
						<Typography className="loading-text">Načítání týmu...</Typography>
					</>
				)}
			</Box>
		</div>
	)
}

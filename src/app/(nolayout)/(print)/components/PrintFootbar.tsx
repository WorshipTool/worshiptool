import { Typography } from '@mui/material'
import Logo from './../../../../assets/icon.svg'

export default function PrintFootbar() {
	return (
		<div
			style={{
				display: 'flex',
				flexDirection: 'row',
				alignItems: 'center',
				justifyContent: 'end',
				gap: '0.5rem',
				width: '100%',
				opacity: 0.15,
			}}
		>
			<Typography variant="button">Chvalotce.cz</Typography>
			<div
				style={{
					width: '2rem',
				}}
			>
				<Logo />
			</div>
		</div>
	)
}

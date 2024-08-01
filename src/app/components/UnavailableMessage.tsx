import { Card } from '@/common/ui/Card/Card'
import { Typography } from '@/common/ui/Typography'
import { BugReport, Build, PrecisionManufacturing } from '@mui/icons-material'
import { Box } from '@mui/material'
import { Gap } from '../../common/ui/Gap/Gap'

export default function UnavailableMessage() {
	const isUnvailable =
		process.env.NEXT_PUBLIC_TEMPORARILY_UNAVAILABLE === 'true'

	const padding = '0rem'
	return (
		<>
			{isUnvailable && (
				<Card
					style={{
						position: 'fixed',
						bottom: padding,
						left: padding,
						right: padding,
						top: padding,
						color: 'white',
						padding: '1rem',
						textAlign: 'center',
						zIndex: 9999,
						backgroundColor: 'rgba(0, 0, 0, 0.5)',
						backdropFilter: 'blur(20px)',
						display: 'flex',
						flexDirection: 'column',
						justifyContent: 'center',
					}}
				>
					<Box
						display={'flex'}
						flexDirection={'row'}
						gap={1}
						justifyContent={'center'}
						alignItems={'center'}
					>
						<Build
							fontSize="inherit"
							sx={{
								fontSize: '4rem',
							}}
						/>
						<BugReport
							fontSize="inherit"
							sx={{
								fontSize: '5rem',
							}}
						/>
						<PrecisionManufacturing
							fontSize="inherit"
							sx={{
								fontSize: '5rem',
							}}
						/>
					</Box>
					<Gap value={2} />
					<Typography variant="h4" strong>
						{'Na stránce se zrovna pracuje.'}
					</Typography>
					<Gap />
					<Typography variant="h5" strong={100}>
						Omlouváme se, stránka je dočasně nedostupná. <br />
						Prosíme, zkuste to znovu za <b>hodinu</b>.
					</Typography>
				</Card>
			)}
		</>
	)
}

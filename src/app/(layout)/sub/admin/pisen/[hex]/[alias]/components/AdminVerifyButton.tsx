'use client'
import { useInnerVariant } from '@/app/(layout)/pisen/[hex]/[alias]/hooks/useInnerSong'
import VerifyButton from '@/app/(layout)/sub/admin/pisen/[hex]/[alias]/components/VerifyButton'
import Popup from '@/common/components/Popup/Popup'
import { Button, Typography } from '@/common/ui'
import { useState } from 'react'

export default function AdminVerifyButton() {
	const variant = useInnerVariant()
	const [verifyPopupOpen, setVerifyPopupOpen] = useState(false)
	return (
		<>
			<Button
				small
				color="success"
				onClick={() => setVerifyPopupOpen(true)}
				sx={{
					width: 'fit-content',
				}}
			>
				Spravovat ověření
			</Button>

			<Popup
				open={verifyPopupOpen}
				onClose={() => setVerifyPopupOpen(false)}
				title="Manuální ověření"
				subtitle={variant.title}
				actions={[
					<Button key={'cancel'} type="reset" size="small" variant="text">
						Zrušit
					</Button>,
					<VerifyButton variant={variant} key={'action'} />,
				]}
				width={300}
			>
				{variant.verified !== null ? (
					<>
						{variant.verified ? (
							<Typography>Píseň je manualně ověřena.</Typography>
						) : (
							<Typography>Píseň je manualně zamítnuta.</Typography>
						)}
					</>
				) : (
					<>
						<Typography>Píseň není manualně ověřena</Typography>
					</>
				)}
			</Popup>
		</>
	)
}

'use client'

import { MobileAppHeader } from '@/common/components/MobileAppHeader'
import { Box, Button, Typography } from '@/common/ui'
import { alpha } from '@/common/ui/mui'
import { PhotoCameraRounded } from '@mui/icons-material'
import { useTranslations } from 'next-intl'
import { useRef } from 'react'
import UploadFileInput from './UploadFileInput'

type UploadMobileProps = {
	onUpload: (files: File[]) => void
}

/**
 * Phone version of the upload page: a focused hero with a single action. Tapping
 * the button opens one native file picker (accept image/* + pdf), and the phone
 * itself offers Camera / Photo Library / Files — we don't split those into
 * separate buttons, since the OS provides them. Wrapped in the mobile app shell
 * ("Nahrát soubor" header + back to the create menu). Desktop keeps the
 * drag-and-drop UploadPanel in page.tsx.
 */
export default function UploadMobile({ onUpload }: UploadMobileProps) {
	const t = useTranslations('upload')
	const inputRef = useRef<HTMLInputElement>(null)

	const openPicker = () => inputRef.current?.click()

	return (
		<MobileAppHeader title={t('uploadFile')} backTo="addMenu">
			<Box
				sx={{
					minHeight: '100%',
					display: 'flex',
					flexDirection: 'column',
					alignItems: 'center',
					justifyContent: 'center',
					gap: 2,
					paddingX: 2,
					paddingBottom: 6,
				}}
			>
				<Box
					sx={{
						width: 110,
						height: 110,
						borderRadius: '50%',
						display: 'flex',
						alignItems: 'center',
						justifyContent: 'center',
						fontSize: 56,
						color: 'primary.main',
						bgcolor: (theme) => alpha(theme.palette.primary.main, 0.1),
					}}
				>
					<PhotoCameraRounded fontSize="inherit" />
				</Box>

				<Typography sx={{ fontSize: '1.35rem', fontWeight: 800 }} align="center">
					{t('photoTitle')}
				</Typography>
				<Typography color="grey.600" align="center">
					{t('photoSubtitle')}
				</Typography>

				<Button
					variant="contained"
					color="primary"
					onClick={openPicker}
					startIcon={<PhotoCameraRounded />}
					disableUppercase
					sx={{
						marginTop: 1,
						width: '100%',
						paddingY: 1.5,
						borderRadius: 999,
						fontSize: '1rem',
						fontWeight: 700,
					}}
				>
					{t('photoAction')}
				</Button>

				<Typography small color="grey.500" align="center">
					{t('supportedFormats')}: png, jpg, jpeg, pdf
				</Typography>
			</Box>

			<UploadFileInput inputRef={inputRef} onUpload={onUpload} />
		</MobileAppHeader>
	)
}

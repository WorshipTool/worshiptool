'use client'

import { MobileAppHeader } from '@/common/components/MobileAppHeader'
import { Box, Typography } from '@/common/ui'
import { CloudUploadRounded } from '@mui/icons-material'
import { useTranslations } from 'next-intl'
import { useRef } from 'react'
import UploadFileInput from './UploadFileInput'

type UploadMobileProps = {
	onUpload: (files: File[]) => void
}

/**
 * Phone version of the upload page. Wraps a big tap-to-pick upload zone in the
 * mobile app shell ("Nahrát soubor" header + back to the create menu) instead of
 * the desktop's centered drag-and-drop card on marketing chrome. Tapping the zone
 * opens the file picker (image/* also offers the camera / gallery). Desktop keeps
 * the UploadPanel drag-and-drop in page.tsx.
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
					gap: 2,
					paddingTop: 2,
					paddingBottom: 2,
				}}
			>
				<Box
					role="button"
					tabIndex={0}
					onClick={openPicker}
					sx={{
						flex: 1,
						display: 'flex',
						flexDirection: 'column',
						alignItems: 'center',
						justifyContent: 'center',
						gap: 2.5,
						paddingX: 3,
						paddingY: 6,
						borderRadius: 4,
						border: '2px dashed',
						borderColor: 'grey.300',
						bgcolor: 'background.paper',
						cursor: 'pointer',
						userSelect: 'none',
						transition: 'background-color 0.15s, border-color 0.15s',
						'&:active': { bgcolor: 'grey.100', borderColor: 'primary.main' },
					}}
				>
					<CloudUploadRounded sx={{ fontSize: 72, color: 'primary.main' }} />
					<Typography strong={600} color="grey.800" align="center">
						{t('uploadFileSubtitle')}
					</Typography>
					<Box
						sx={{
							bgcolor: 'primary.main',
							color: 'common.white',
							fontWeight: 700,
							fontSize: '0.95rem',
							paddingX: 3,
							paddingY: 1.25,
							borderRadius: 999,
						}}
					>
						{t('selectFiles')}
					</Box>
				</Box>

				<Typography small color="grey.500" align="center">
					{t('supportedFormats')}: png, jpg, jpeg, pdf
				</Typography>
			</Box>

			<UploadFileInput inputRef={inputRef} onUpload={onUpload} />
		</MobileAppHeader>
	)
}

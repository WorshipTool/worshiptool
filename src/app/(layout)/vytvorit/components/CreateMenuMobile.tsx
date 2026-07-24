'use client'

import ParseAdminOption from '@/app/(layout)/vytvorit/components/ParseAdminOption'
import { MobileAppHeader } from '@/common/components/MobileAppHeader'
import FlagProtected from '@/common/providers/FeatureFlags/FlagProtected'
import { Box, Typography } from '@/common/ui'
import { Link } from '@/common/ui/Link/Link'
import { alpha } from '@/common/ui/mui'
import { RoutesKeys } from '@/routes'
import {
	ChevronRightRounded,
	EditRounded,
	UploadFileRounded,
} from '@mui/icons-material'
import { useTranslations } from 'next-intl'
import { ReactNode } from 'react'

type CreateOptionRowProps = {
	to: RoutesKeys
	icon: ReactNode
	title: string
	subtitle: string
}

/**
 * A tappable option row in the mobile create menu: a soft-tinted icon tile, the
 * option's title + one-line description, and a trailing chevron. Reads as a
 * native "new …" list item (calm white surface, no loud blue block).
 */
function CreateOptionRow({ to, icon, title, subtitle }: CreateOptionRowProps) {
	return (
		<Link to={to} params={{}}>
			<Box
				sx={{
					display: 'flex',
					alignItems: 'center',
					gap: 2,
					padding: 2,
					bgcolor: 'background.paper',
					border: '1px solid',
					borderColor: 'grey.200',
					borderRadius: 3,
					transition: 'background-color 0.15s',
					'&:active': { bgcolor: 'grey.100' },
				}}
			>
				<Box
					sx={{
						width: 52,
						height: 52,
						flexShrink: 0,
						borderRadius: 2.5,
						display: 'flex',
						alignItems: 'center',
						justifyContent: 'center',
						fontSize: 26,
						color: 'primary.main',
						bgcolor: (theme) => alpha(theme.palette.primary.main, 0.1),
					}}
				>
					{icon}
				</Box>
				<Box sx={{ flex: 1, minWidth: 0 }}>
					<Typography strong={600}>{title}</Typography>
					<Typography small color="grey.600">
						{subtitle}
					</Typography>
				</Box>
				<ChevronRightRounded sx={{ color: 'grey.400', flexShrink: 0 }} />
			</Box>
		</Link>
	)
}

/**
 * Phone version of the "create a song" menu. Presents the same options as the
 * desktop card grid (upload — behind the file-parser flag — and write manually)
 * as a native-feeling list inside the mobile app shell, reached from Moje písně.
 * The desktop layout stays in page.tsx.
 */
export default function CreateMenuMobile() {
	const t = useTranslations('upload')

	return (
		<MobileAppHeader title={t('addTitle')} backTo="usersSongs">
			<Box
				sx={{
					display: 'flex',
					flexDirection: 'column',
					gap: 1.5,
					paddingTop: 1,
				}}
			>
				<FlagProtected flag={'enable_file_parser'}>
					<CreateOptionRow
						to="upload"
						icon={<UploadFileRounded fontSize="inherit" />}
						title={t('uploadFile')}
						subtitle={t('uploadFileSubtitle')}
					/>
				</FlagProtected>

				<CreateOptionRow
					to="writeSong"
					icon={<EditRounded fontSize="inherit" />}
					title={t('writeManually')}
					subtitle={t('writeManuallySubtitle')}
				/>

				<ParseAdminOption />
			</Box>
		</MobileAppHeader>
	)
}

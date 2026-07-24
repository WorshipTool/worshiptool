'use client'
import ParseAdminOption from '@/app/(layout)/vytvorit/components/ParseAdminOption'
import { MOBILE_NAV_BREAKPOINT } from '@/common/components/MobileAppTabBar/nav.constants'
import { SmartPage } from '@/common/components/app/SmartPage/SmartPage'
import FlagProtected from '@/common/providers/FeatureFlags/FlagProtected'
import { Box, useTheme } from '@/common/ui'
import { useMediaQuery } from '@/common/ui/mui'
import { Edit, UploadFile } from '@mui/icons-material'
import { useTranslations } from 'next-intl'
import AddMenuItem from './components/AddMenuItem'
import CreateMenuMobile from './components/CreateMenuMobile'

export default SmartPage(AddMenu)

function AddMenu() {
	const t = useTranslations('upload')

	const theme = useTheme()
	const phoneVersion = useMediaQuery(theme.breakpoints.down(MOBILE_NAV_BREAKPOINT))

	// phones get the native app shell; desktop keeps the centered card grid below
	if (phoneVersion) {
		return <CreateMenuMobile />
	}

	return (
		<>
			<Box
				sx={{
					width: '100%',
					height: 500,
					display: 'flex',
					justifyContent: 'center',
					alignItems: 'center',
				}}
			>
				<Box
					sx={{
						display: 'flex',
						flexDirection: 'row',
						justifyContent: 'center',
						flexWrap: 'wrap',
						gap: {
							xs: 2,
							sm: 5,
						},
					}}
				>
					<FlagProtected flag={'enable_file_parser'}>
						<AddMenuItem
							title={t('uploadFile')}
							subtitle={t('uploadFileSubtitle')}
							icon={<UploadFile fontSize="inherit" />}
							to="upload"
						/>
					</FlagProtected>
					<AddMenuItem
						title={t('writeManually')}
						// subtitle='Použijte editor pro psaní textu písně'
						icon={<Edit fontSize="inherit" />}
						iconSize={40}
						to="writeSong"
					/>
				</Box>
			</Box>

			<ParseAdminOption />
		</>
	)
}

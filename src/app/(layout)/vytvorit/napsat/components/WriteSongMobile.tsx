'use client'

import {
	MobileAppHeader,
	MobileHeaderPill,
} from '@/common/components/MobileAppHeader'
import SheetEditor from '@/common/components/SheetEditor/SheetEditor'
import { CheckRounded } from '@mui/icons-material'
import { useTranslations } from 'next-intl'
import NotValidWarning from './NotValidWarning'

type WriteSongMobileProps = {
	onTitleChange: (title: string) => void
	onSheetDataChange: (sheetData: string) => void
	/** True when the sheet is complete enough to create the song. */
	canCreate: boolean
	posting: boolean
	/** Show the "content isn't valid yet" hint (non-empty but invalid). */
	showInvalidWarning: boolean
	onCreate: () => void
}

/**
 * Phone version of the manual song editor. Wraps the shared SheetEditor (title +
 * sheet text + insert toolbar) in the mobile app shell: a "Sepsat ručně" header
 * whose single primary action is a "Vytvořit" pill, disabled until the sheet is
 * valid — instead of the desktop's side-by-side editor/preview with a bottom
 * button (which overflowed on phones). The desktop layout stays in page.tsx.
 */
export default function WriteSongMobile(props: WriteSongMobileProps) {
	const t = useTranslations('upload')

	return (
		<MobileAppHeader
			title={t('writeManually')}
			backTo="addMenu"
			surface="background.paper"
			actions={[
				<MobileHeaderPill
					key="create"
					icon={<CheckRounded />}
					onClick={props.onCreate}
					disabled={!props.canCreate}
					loading={props.posting}
					alt={t('create')}
				>
					{t('create')}
				</MobileHeaderPill>,
			]}
		>
			<SheetEditor
				fill
				sx={{ minHeight: '100%' }}
				onTitleChange={props.onTitleChange}
				onSheetDataChange={props.onSheetDataChange}
			/>
			{props.showInvalidWarning && <NotValidWarning />}
		</MobileAppHeader>
	)
}

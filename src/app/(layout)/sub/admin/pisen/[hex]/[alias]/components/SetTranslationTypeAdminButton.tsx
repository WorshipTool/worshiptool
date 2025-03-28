'use client'
import { useInnerPack } from '@/app/(layout)/pisen/[hex]/[alias]/hooks/useInnerPack'
import Popup from '@/common/components/Popup/Popup'
import { Button } from '@/common/ui'
import { useApi } from '@/hooks/api/useApi'
import { handleApiCall } from '@/tech/handleApiCall'
import { PackTranslationType } from '@/types/song'
import { useSnackbar } from 'notistack'
import { useState } from 'react'

const OPTIONS: { label: string; value: PackTranslationType }[] = [
	{ label: 'Originál', value: PackTranslationType.Original },
	{ label: 'Překlad', value: PackTranslationType.Translation },
	{
		label: 'Oficiální překlad',
		value: PackTranslationType.OfficialTranslation,
	},
	{ label: 'Neznámé', value: PackTranslationType.Unknown },
]

export default function SetTranslationTypeAdminButton() {
	const [open, setOpen] = useState(false)

	const { enqueueSnackbar } = useSnackbar()
	const { packGuid } = useInnerPack()
	const { songManagementApi } = useApi()

	const onOptionClick = async (value: PackTranslationType) => {
		await handleApiCall(
			songManagementApi.packSettingControllerSetTranslationType({
				packGuid: packGuid,
				translationType: value,
			})
		)
		const label = OPTIONS.find((o) => o.value === value)?.label
		enqueueSnackbar('Typ překladu nastaven na ' + label)
		setOpen(false)
	}

	return (
		<>
			<Button
				// title={'Nastavit typ'}
				// subtitle="Zvolit typ překladu"
				onClick={() => setOpen(true)}
				small
				sx={{
					width: 'fit-content',
				}}
			>
				Zvolit typ překladu
			</Button>

			<Popup
				title={'Zvol typ překladu'}
				open={open}
				onClose={() => setOpen(false)}
			>
				{OPTIONS.map((p) => {
					return (
						<Button
							key={p.value}
							onClick={() => {
								onOptionClick(p.value)
							}}
							size="small"
							color="secondary"
						>
							{p.label}
						</Button>
					)
				})}
			</Popup>
		</>
	)
}

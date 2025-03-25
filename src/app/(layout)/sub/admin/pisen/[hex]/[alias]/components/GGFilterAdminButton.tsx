'use client'
import { useInnerVariant } from '@/app/(layout)/pisen/[hex]/[alias]/hooks/useInnerSong'
import Popup from '@/common/components/Popup/Popup'
import { Button } from '@/common/ui'
import { useApi } from '@/hooks/api/useApi'
import { handleApiCall } from '@/tech/handleApiCall'
import { useSnackbar } from 'notistack'
import { useState } from 'react'

const OPTIONS: { label: string; value: boolean | null }[] = [
	{ label: 'Validní', value: true },
	{ label: 'Nevalidní', value: false },
	{ label: 'Automaticky', value: null },
]

export default function GGFilterAdminButton() {
	const [open, setOpen] = useState(false)

	const { enqueueSnackbar } = useSnackbar()
	const { packGuid } = useInnerVariant()
	const { songManagementApi } = useApi()

	const onOptionClick = async (value: boolean | null) => {
		if (value === null) {
			await handleApiCall(
				songManagementApi.songGGFilterControllerSetFilterStatusToAutoForPack(
					packGuid
				)
			)
		} else {
			await handleApiCall(
				songManagementApi.songGGFilterControllerSetFilterStatusForPack(
					packGuid,
					value
				)
			)
		}
		const label = OPTIONS.find((o) => o.value === value)?.label
		enqueueSnackbar('Filtrace nastavena na ' + label)
		setOpen(false)
	}

	return (
		<>
			<Button
				// title={'(GG) Validace obsahu'}
				// subtitle="Zvolit zda se má píseň filtrovat"
				onClick={() => setOpen(true)}
				small
				sx={{
					width: 'fit-content',
				}}
			>
				{'(GG) Validace obsahu'}
			</Button>

			<Popup
				title={'Zvol validaci obsahu'}
				open={open}
				onClose={() => setOpen(false)}
			>
				{OPTIONS.map((p) => {
					return (
						<Button
							key={p.label}
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

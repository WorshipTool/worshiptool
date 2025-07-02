'use client'
import { useApi } from '@/api/tech-and-hooks/useApi'
import { useInnerPack } from '@/app/(layout)/pisen/[hex]/[alias]/hooks/useInnerPack'
import Popup from '@/common/components/Popup/Popup'
import { Button } from '@/common/ui'
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
	const { packGuid } = useInnerPack()
	const { songManagementApi } = useApi()

	const onOptionClick = async (value: boolean | null) => {
		if (value === null) {
			await songManagementApi.setFilterStatusToAutoForPack(packGuid)
		} else {
			await songManagementApi.setFilterStatusForPack(packGuid, value)
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

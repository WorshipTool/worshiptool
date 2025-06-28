import { useInnerPack } from '@/app/(layout)/pisen/[hex]/[alias]/hooks/useInnerPack'
import MenuItem from '@/common/components/Menu/MenuItem'
import Popup from '@/common/components/Popup/Popup'
import { Button } from '@/common/ui'
import { useApi } from '@/hooks/api/useApi'
import { useApiState } from '@/tech/ApiState'
import { Publish } from '@mui/icons-material'
import { enqueueSnackbar } from 'notistack'
import { useState } from 'react'

export default function SendToApproval() {
	const [open, setOpen] = useState(false)
	const { packGuid } = useInnerPack()

	const { songPublishingApi } = useApi()

	const { fetchApiState, apiState } = useApiState()

	const send = async () => {
		await fetchApiState(async () =>
			songPublishingApi.songPublishingControllerSendPackToApproval({
				packGuid: packGuid,
			})
		)

		enqueueSnackbar('Píseň byla úspěšně zveřejněna a odeslána ke schválení.')
		setOpen(false)
		window.location.reload()
	}

	return (
		<>
			<MenuItem
				key={'send-to-approval item'}
				title={'Zveřejnit'}
				icon={<Publish />}
				subtitle="Poslat píseň ke zveřejnění"
				onClick={() => {
					setOpen(true)
				}}
			/>

			<Popup
				key={'send-to-approval popup'}
				open={open}
				onClose={() => setOpen(false)}
				title="Zveřejnit"
				onSubmit={send}
				actions={[
					<Button type="reset" outlined key={'cancel'}>
						Zrušit
					</Button>,
					<Button
						type="submit"
						color="primary"
						loading={apiState.loading}
						key={'send'}
					>
						Ano, zveřejnit
					</Button>,
				]}
			>
				Chcete píseň zveřejnit aby jí viděli ostatní uživatelé?
			</Popup>
		</>
	)
}

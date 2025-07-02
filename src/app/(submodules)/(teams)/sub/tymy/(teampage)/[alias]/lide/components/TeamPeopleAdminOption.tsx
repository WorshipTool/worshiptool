import { useApi } from '@/api/tech-and-hooks/useApi'
import useInnerTeam from '@/app/(submodules)/(teams)/sub/tymy/(teampage)/hooks/useInnerTeam'
import AdminOption from '@/common/components/admin/AdminOption'
import Popup from '@/common/components/Popup/Popup'
import { Button, TextInput, Typography } from '@/common/ui'
import { useApiState } from '@/tech/ApiState'
import { useState } from 'react'

export default function TeamPeopleAdminOption() {
	const [popupOpen, setPopupOpen] = useState(false)

	const [email, setEmail] = useState('')
	const { guid } = useInnerTeam()

	const { teamJoiningApi } = useApi()
	const { fetchApiState, apiState } = useApiState()
	const onClick = () => {
		if (!email) return
		fetchApiState(
			async () => {
				return teamJoiningApi.addByEmail({
					email,
					teamGuid: guid,
				})
			},
			() => {
				window.location.reload()
			}
		)
	}

	return (
		<>
			<AdminOption
				label="Přidat nového člena"
				onClick={() => setPopupOpen(true)}
			/>

			<Popup
				open={popupOpen}
				onClose={() => setPopupOpen(false)}
				onSubmit={onClick}
				title="Přidat uživatele"
				subtitle="Přidejte uživatele do týmu pomocí jeho emailu"
				actions={[
					<Button
						key={'cancel'}
						type="reset"
						variant="text"
						color="grey.900"
						size="small"
						disabled={apiState.loading}
					>
						Zrušit
					</Button>,
					<Button
						key={'cancel'}
						type="submit"
						variant="contained"
						color="primary"
						size="small"
						loading={apiState.loading}
					>
						Přidat
					</Button>,
				]}
			>
				{apiState.error && (
					<Typography color="error">
						Nastala chyba. Zkontroluj, zda je zadaný správný email...
					</Typography>
				)}
				<TextInput
					value={email}
					onChange={setEmail}
					placeholder="Email"
					autoFocus
					type="email"
				/>
			</Popup>
		</>
	)
}

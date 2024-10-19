'use client'
import { SmartTeamPage } from '@/app/(submodules)/(teams)/sub/tymy/[alias]/components/SmartTeamPage/SmartTeamPage'
import TeamCard from '@/app/(submodules)/(teams)/sub/tymy/[alias]/components/TeamCard/TeamCard'
import { TeamPageTitle } from '@/app/(submodules)/(teams)/sub/tymy/[alias]/components/TopPanel/components/TeamPageTitle'
import TeamEditableCard from '@/app/(submodules)/(teams)/sub/tymy/[alias]/nastaveni/components/TeamEditableCard'
import TeamEditableField from '@/app/(submodules)/(teams)/sub/tymy/[alias]/nastaveni/components/TeamEditableField'
import useInnerTeam from '@/app/(submodules)/(teams)/sub/tymy/hooks/useInnerTeam'
import { TeamPermissions } from '@/app/(submodules)/(teams)/sub/tymy/tech'
import Popup from '@/common/components/Popup/Popup'
import { Button } from '@/common/ui/Button'
import { Typography } from '@/common/ui/Typography'
import { useApi } from '@/hooks/api/useApi'
import { usePermission } from '@/hooks/permissions/usePermission'
import { useSmartNavigate } from '@/routes/useSmartNavigate'
import { handleApiCall } from '@/tech/handleApiCall'
import { Delete } from '@mui/icons-material'
import { Box } from '@mui/material'
import { useSnackbar } from 'notistack'
import { useEffect, useState } from 'react'

export default SmartTeamPage(TeamSettingsPage)

function TeamSettingsPage() {
	const { name: _name, joinCode: _joinCode, guid, reload } = useInnerTeam()

	const hasPermissionToEdit = usePermission<TeamPermissions>(
		'team.change_base_info',
		{
			teamGuid: guid,
		}
	)

	const { teamEditingApi } = useApi()

	const [name, setName] = useState(_name)
	const [joinCode, setJoinCode] = useState(_joinCode)

	useEffect(() => {
		setName(_name)
	}, [_name])

	useEffect(() => {
		setJoinCode(_joinCode)
	}, [_joinCode])

	const onCancel = () => {
		setName(_name)
		setJoinCode(_joinCode)
	}

	const onSave = async () => {
		await handleApiCall(
			teamEditingApi.teamEditingControllerChangeTeamInfo({
				teamGuid: guid,
				teamName: name,
				joinCode,
			})
		)
		reload()
	}

	const navigate = useSmartNavigate()
	const { enqueueSnackbar } = useSnackbar()
	const onTeamPermanentRemove = async () => {
		await handleApiCall(
			teamEditingApi.teamEditingControllerDeleteTeam({
				teamGuid: guid,
			})
		)
		navigate('teams', {})
		enqueueSnackbar('Tým byl odstraněn')
	}

	const [deletePopupOpen, setDeletePopupOpen] = useState(false)

	return (
		<Box display={'flex'} flexDirection={'column'} gap={1}>
			<TeamPageTitle>Nastavení</TeamPageTitle>

			<TeamEditableCard
				title="Základní informace"
				onCancel={onCancel}
				onSave={onSave}
				editable={Boolean(hasPermissionToEdit)}
			>
				{(editMode) => (
					<Box display={'flex'} flexDirection={'column'} gap={2} maxWidth={300}>
						<Box />
						<TeamEditableField
							label="Název týmu"
							value={name}
							editable={editMode}
							onChange={setName}
						/>
						<TeamEditableField
							label="Připojovací kód"
							value={joinCode}
							editable={editMode}
							onChange={setJoinCode}
						/>
					</Box>
				)}
			</TeamEditableCard>

			<TeamCard
				sx={{
					display: 'flex',
					flexDirection: 'row',
					justifyContent: 'space-between',
					flexWrap: 'wrap',
					gap: 1,
				}}
			>
				<Box display={'flex'} flexDirection={'column'}>
					<Typography variant="h6" strong>
						Smazání týmu
					</Typography>
					<Typography>
						Po smazání týmu nebude možné tým obnovit. Záznamy o týmu budou
						smazány.
					</Typography>
				</Box>

				<Box
					display={'flex'}
					flexDirection={'column'}
					justifyContent={'center'}
				>
					<Button
						color="error"
						size="small"
						startIcon={<Delete />}
						variant="outlined"
						onClick={() => setDeletePopupOpen(true)}
					>
						Odstranit tým
					</Button>
				</Box>

				<Popup
					open={deletePopupOpen}
					onClose={() => setDeletePopupOpen(false)}
					title="Jste si jistí?"
					icon={<Delete />}
					actions={[
						<Button
							variant="text"
							color="error"
							onClick={onTeamPermanentRemove}
						>
							Ano, nevratně odstranit
						</Button>,
						<Button
							type="reset"
							tooltip="Zavřít vyskakovací okno bez jakékoliv akce"
						>
							Zrušit
						</Button>,
					]}
					width={400}
				>
					<Typography>
						Snažíte se smazat tým <b>{_name}</b>. Tato akce je nevratná. Jste si
						jistí, že chcete pokračovat?
					</Typography>
				</Popup>
			</TeamCard>
		</Box>
	)
}

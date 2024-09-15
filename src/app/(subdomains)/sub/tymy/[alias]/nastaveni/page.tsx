'use client'
import { TeamPageTitle } from '@/app/(subdomains)/sub/tymy/[alias]/components/TopPanel/components/TeamPageTitle'
import TeamEditableCard from '@/app/(subdomains)/sub/tymy/[alias]/nastaveni/components/TeamEditableCard'
import TeamEditableField from '@/app/(subdomains)/sub/tymy/[alias]/nastaveni/components/TeamEditableField'
import useInnerTeam from '@/app/(subdomains)/sub/tymy/hooks/useInnerTeam'
import { TeamPermissions } from '@/app/(subdomains)/sub/tymy/tech'
import { useApi } from '@/hooks/api/useApi'
import { usePermission } from '@/hooks/permissions/usePermission'
import { Box } from '@mui/material'
import { useEffect, useState } from 'react'
import { handleApiCall } from '../../../../../../tech/handleApiCall'

export default function TeamSettingsPage() {
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

	return (
		<Box>
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
		</Box>
	)
}

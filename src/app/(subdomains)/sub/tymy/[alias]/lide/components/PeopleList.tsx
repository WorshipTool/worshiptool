import ListTopPanelPeople from '@/app/(subdomains)/sub/tymy/[alias]/lide/components/ListTopPanelPeople'
import PeopleListItem from '@/app/(subdomains)/sub/tymy/[alias]/lide/components/PeopleListItem'
import { TeamMemberRole } from '@/app/(subdomains)/sub/tymy/[alias]/lide/components/RolePart'
import Tooltip from '@/common/ui/CustomTooltip/Tooltip'
import { Typography } from '@/common/ui/Typography'
import { useApi } from '@/hooks/api/useApi'
import useAuth from '@/hooks/auth/useAuth'
import { UserGuid } from '@/interfaces/user'
import { useSmartParams } from '@/routes/useSmartParams'
import { useApiStateEffect } from '@/tech/ApiState'
import { handleApiCall } from '@/tech/handleApiCall'
import { Box, Checkbox, LinearProgress } from '@mui/material'
import { useCallback, useMemo, useState } from 'react'

type PeopleListDto = {}

export default function PeopleList(props: PeopleListDto) {
	// ApiStates and items
	const { teamMembersApi } = useApi()
	const { alias: teamAlias } = useSmartParams('teamPeople')
	const { user } = useAuth()

	const [apiState, fetchData] = useApiStateEffect(async () => {
		const data = await handleApiCall(
			teamMembersApi.teamMemberControllerGetTeamMembers(teamAlias)
		)
		return data
	}, [teamAlias])

	const members = useMemo(() => {
		const arr =
			apiState.data?.members.filter((m) => m.guid !== user?.guid) ?? []
		return arr
	}, [apiState])

	const me = useMemo(() => {
		return apiState.data?.members.find((m) => m.guid === user?.guid)
	}, [apiState, user])

	// Selecting
	const [selectable, setSelectable] = useState(false)
	const [selected, setSelected] = useState<UserGuid[]>([])
	const allSelected = useMemo(() => {
		return selected.length === members.length + 1
	}, [members, selected])

	const onSelectChange = (guid: UserGuid, selected: boolean) => {
		if (selected) {
			setSelected((prev) => [...prev, guid])
		} else {
			setSelected((prev) => prev.filter((g) => g !== guid))
		}
	}

	const onAllChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		if (e.target.checked) {
			setSelected([
				...members.map((m) => m.guid as UserGuid),
				me?.guid as UserGuid,
			])
		} else {
			setSelected([])
		}
	}

	const onSelectableChange = (selected: boolean) => {
		setSelectable(selected)
		if (!selected) {
			setSelected([])
		}
	}

	// Actions

	const onMemberRemove = useCallback(async (guid: UserGuid) => {
		try {
			await teamMembersApi.teamMemberControllerLeaveTeam({
				userGuid: guid,
				teamAlias: teamAlias,
			})
			await fetchData()
		} catch (e) {
			console.error(e)
		}
	}, [])

	const onSetRole = useCallback(
		async (guid: UserGuid, role: TeamMemberRole) => {
			console.log('set role', guid, role)
		},
		[]
	)

	// Styles
	const firstPartsWidth = 'minmax(0,200px)'

	const gridStyle = useMemo(
		() => ({
			display: 'grid',
			gridTemplateColumns: `${
				selectable ? '40px' : ''
			} minmax(20px,60px) repeat(3, ${firstPartsWidth}) 1fr 100px`,
			alignItems: 'center',
			gap: '1rem 1rem',
			paddingX: 2,
		}),
		[selectable]
	)
	return (
		<Box>
			<ListTopPanelPeople
				selectedPeople={selected}
				selectable={selectable}
				onChange={onSelectableChange}
				peopleCount={members.length + 1}
				loading={apiState.loading}
				onMemberRemove={onMemberRemove}
				onRoleChange={onSetRole}
			/>

			{apiState.loading && (
				<>
					<LinearProgress />
				</>
			)}

			<Box
				sx={{
					borderRadius: 2,
					// boxShadow: '0px 2px 4px rgba(0,0,0,0.1)',
				}}
			>
				<Box
					display={'grid'}
					sx={{
						...gridStyle,
						bgcolor: 'grey.100',
						borderRadius: 2,
						borderBottomLeftRadius: 0,
						borderBottomRightRadius: 0,
						paddingTop: 2,
						paddingBottom: 1,
					}}
				>
					<>
						{selectable && (
							<Box
								display={'flex'}
								justifyContent={'center'}
								alignItems={'center'}
								height={10}
							>
								<Checkbox
									size="small"
									onChange={onAllChange}
									checked={allSelected}
								/>
							</Box>
						)}
						<Box />
						<Typography color="grey.500">Jméno</Typography>
						<Typography color="grey.500">Email</Typography>
						<Typography color="grey.500">Role</Typography>
						<Box />
						<Typography color="grey.500">Akce</Typography>
					</>
				</Box>
				<Box
					sx={{
						height: 5,
					}}
				/>
				<Tooltip label="Ty" placement="left">
					<Box
						display={'grid'}
						sx={{
							...gridStyle,
							bgcolor: 'grey.200',
							paddingY: 1,
							// transform: 'scale(1.01)',
							boxShadow: '0px 0px 2px rgba(0,0,0,0.2)',
						}}
					>
						{me && (
							<PeopleListItem
								key={me.email}
								data={me}
								selectable={selectable}
								me
								selected={selected.includes(me.guid as UserGuid)}
								onSelectChange={(selected) =>
									onSelectChange(me.guid as UserGuid, selected)
								}
								onMemberRemove={onMemberRemove}
								onChangeRole={onSetRole}
							/>
						)}
					</Box>
				</Tooltip>
				<Box
					sx={{
						height: 5,
					}}
				/>
				<Box
					display={'grid'}
					sx={{
						...gridStyle,
						bgcolor: 'grey.100',
						borderRadius: 2,
						borderTopLeftRadius: 0,
						borderTopRightRadius: 0,
						paddingBottom: 2,
						paddingTop: 1,
					}}
				>
					{members?.map((member) => (
						<PeopleListItem
							key={member.email}
							data={member}
							selectable={selectable}
							selected={selected.includes(member.guid as UserGuid)}
							onSelectChange={(selected) =>
								onSelectChange(member.guid as UserGuid, selected)
							}
							onMemberRemove={onMemberRemove}
							onChangeRole={onSetRole}
						/>
					))}

					{members.length === 0 && (
						<>
							{selectable && <Box />}
							<Box />
							<Typography italic>Nikdo další tu není</Typography>
						</>
					)}
				</Box>
			</Box>
		</Box>
	)
}

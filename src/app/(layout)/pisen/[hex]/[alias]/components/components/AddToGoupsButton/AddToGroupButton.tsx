import { VariantPackGuid } from '@/api/dtos'
import { Diversity3 } from '@mui/icons-material'
import {
	Divider,
	ListItemIcon,
	ListItemText,
	Menu,
	MenuItem,
} from '@mui/material'
import React, { useMemo } from 'react'
import { usePermissions } from '../../../../../../../../hooks/auth/usePermissions'
import GroupItem from './GroupItem'

type AddToGroupButtonProps = {
	packGuid: VariantPackGuid
}

export default function AddToGroupButton(props: AddToGroupButtonProps) {
	const permissions = usePermissions()

	const permissionsToAdd = useMemo(() => {
		if (permissions) {
			return permissions.permissions.filter((p) => p.type === 'GROUP_ADD_SONG')
		}
		return []
	}, [permissions])

	const permissionsToRemove = useMemo(() => {
		if (permissions) {
			return permissions.permissions.filter(
				(p) => p.type === 'GROUP_REMOVE_SONG'
			)
		}
		return []
	}, [permissions])

	const permissionsArr = useMemo(() => {
		const arr = []

		for (let i = 0; i < permissionsToAdd.length; i++) {
			arr.push({
				guid: permissionsToAdd[i].payload,
				addable: true,
				removable: permissionsToRemove.some(
					(p) => p.payload === permissionsToAdd[i].payload
				),
			})
		}

		for (let i = 0; i < permissionsToRemove.length; i++) {
			if (!arr.some((p) => p.guid === permissionsToRemove[i].payload)) {
				arr.push({
					guid: permissionsToRemove[i].payload,
					addable: false,
					removable: true,
				})
			}
		}

		return arr
	}, [permissionsToAdd, permissionsToRemove])

	const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null)

	const onClick = (event: React.MouseEvent<HTMLElement>) => {
		setAnchorEl(event.currentTarget)
	}

	return permissionsArr.length == 0 ? null : (
		<>
			<Divider />
			<MenuItem onClick={onClick}>
				<ListItemIcon>
					<Diversity3 />
				</ListItemIcon>
				<ListItemText primary="Skupiny" secondary={'Přidat do skupiny'} />
			</MenuItem>
			<Menu
				anchorOrigin={{
					vertical: 'top',
					horizontal: 'right',
				}}
				anchorEl={anchorEl}
				open={Boolean(anchorEl)}
				onClose={() => setAnchorEl(null)}
			>
				{permissionsArr.map((p) => (
					<GroupItem
						key={p.guid}
						groupGuid={p.guid || ''}
						packGuid={props.packGuid}
						addable={p.addable}
						removable={p.removable}
					/>
				))}
			</Menu>
		</>
	)
}

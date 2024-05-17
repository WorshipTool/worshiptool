'use client'
import { Box, Divider, LinearProgress, Typography } from '@mui/material'
import Card from '../../../../common/ui/Card/Card'
import { Gap } from '../../../../common/ui/Gap'
import { usePermission } from '../../../../hooks/auth/usePermission'
import useGroup from '../../../../hooks/group/useGroup'
import GroupCustomLayout from '../GroupCustomLayout'
import UsersPanel from './UsersPanel'
import PinPlaylistPanel from './components/PinPlaylist/PinPlaylistPanel'

export default function GroupSettings() {
	const { guid } = useGroup()
	const isOwner = usePermission('GROUP_OWNER', guid)

	return (
		<GroupCustomLayout>
			{isOwner === null ? (
				<LinearProgress />
			) : !isOwner ? (
				<></>
			) : (
				<Box
					sx={{
						padding: 5,
					}}
				>
					<Card title="Nastavení skupiny">
						<Typography>
							Tato skupina je veřejná. Kdokoliv může prohlížet její obsah.
						</Typography>
						<Typography>
							{' '}
							<strong>Ne ale každý může její obsah upravovat.</strong>
						</Typography>
						<Gap />
						<Divider />
						<Gap />
						<UsersPanel />
					</Card>
					<Gap />
					<PinPlaylistPanel />
				</Box>
			)}
		</GroupCustomLayout>
	)
}

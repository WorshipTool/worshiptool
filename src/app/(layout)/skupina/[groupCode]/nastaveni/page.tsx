'use client'
import { SmartPage } from '@/common/components/app/SmartPage/SmartPage'
import { Box, Divider, LinearProgress, Typography } from '@/common/ui'
import { Card } from '../../../../../common/ui/Card/Card'
import { Gap } from '../../../../../common/ui/Gap'
import useGroup from '../../../../../hooks/group/useGroup'
import { usePermission } from '../../../../../hooks/permissions/usePermission'
import GroupCustomLayout from '../GroupCustomLayout'
import UsersPanel from './UsersPanel'
import PinPlaylistPanel from './components/PinPlaylist/PinPlaylistPanel'

export default SmartPage(GroupSettings, {
	transparentToolbar: true,
	whiteToolbarVersion: true,
	hideMiddleNavigation: true,
	hideFooter: true,
	hideTitle: true,
})
function GroupSettings() {
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

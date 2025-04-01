'use client'
import AdminPageCard from '@/app/(layout)/sub/admin/components/AdminCard'
import { SmartPage } from '@/common/components/app/SmartPage/SmartPage'
import { Box, Typography } from '@/common/ui'
import { useSmartNavigate } from '@/routes/useSmartNavigate'
import { Add, Search } from '@mui/icons-material'

export default SmartPage(Page, [
	'fullWidth',
	'hideFooter',
	'hideMiddleNavigation',
	'darkToolbar',
])

function Page() {
	const navigate = useSmartNavigate()

	return (
		<Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
			<Box maxWidth={200}>
				<AdminPageCard
					color="primary.light"
					onClick={() => navigate('adminCreateSong', {})}
				>
					<Box display={'flex'} alignItems="center" gap={1}>
						<Add />
						<Typography>Přidat novou píseň</Typography>
					</Box>
				</AdminPageCard>
			</Box>
			<Box maxWidth={200}>
				<AdminPageCard
					color="grey.800"
					onClick={() => navigate('adminSongs', {})}
				>
					<Box display={'flex'} alignItems="center" gap={1}>
						<Search />
						<Typography>Vyhledat píseň</Typography>
					</Box>
				</AdminPageCard>
			</Box>
		</Box>
	)
}

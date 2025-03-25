'use client'
import AdminBreadItem from '@/app/(layout)/sub/admin/components/AdminBreadItem'
import { SmartPage } from '@/common/components/app/SmartPage/SmartPage'
import SongSearchBarBase from '@/common/components/SearchBar/SongSearchBarBase'
import SongListCard from '@/common/components/songLists/SongListCards/SongListCards'
import { Box } from '@/common/ui'
import useSongSearchPaginated from '@/hooks/song/useSongSearchPaginated'
import { useUrlState } from '@/hooks/urlstate/useUrlState'
import { parseVariantAlias } from '@/routes/routes.tech'
import { useEffect, useState } from 'react'
export default SmartPage(Page, [
	'fullWidth',
	'hideFooter',
	'hideMiddleNavigation',
	'darkToolbar',
])

function Page() {
	const [searchString, setSearchString] = useUrlState('hledat', '')
	const [useSmartSearch, setUseSmartSearch] = useState(false)

	const { search, loadNext, songs } = useSongSearchPaginated()

	useEffect(() => {
		search(searchString || '', useSmartSearch)
		console.log('searched')
	}, [searchString, useSmartSearch])

	return (
		<Box
			sx={{
				width: '100%',
				display: 'flex',
				flexDirection: 'column',
				gap: 2,
			}}
		>
			<AdminBreadItem label="Písně" to="adminSongs" toParams={{}} />

			{/* <Typography strong>Písně</Typography> */}

			<Box maxWidth={450}>
				<SongSearchBarBase
					onSearchStringChange={setSearchString}
					onSmartSearchChange={setUseSmartSearch}
					startSearchString={searchString || undefined}
				/>
			</Box>

			{songs && (
				<SongListCard
					data={songs.map((s) => s.found[0])}
					cardToLinkProps={(data) => ({
						to: 'adminPack',
						params: {
							...parseVariantAlias(data.packAlias),
						},
					})}
				/>
			)}
		</Box>
	)
}

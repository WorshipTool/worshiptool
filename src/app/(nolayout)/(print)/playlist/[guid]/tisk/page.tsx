import { getPlaylistDataByGuid } from '@/app/(layout)/playlist/[guid]/playlist.tech'
import NotFound from '@/app/not-found'
import SheetDisplay from '@/common/components/SheetDisplay/SheetDisplay'
import { SmartPage } from '@/common/components/app/SmartPage/SmartPage'
import { SmartParams } from '@/routes'
import { Box } from '@mui/material'
import { Sheet, note } from '@pepavlin/sheet-api'

type PageProps = {
	params: SmartParams<'playlistPrint'>
}

export default SmartPage(Page)

async function Page({ params }: PageProps) {
	try {
		const data = await getPlaylistDataByGuid(params.guid)
		return (
			<div>
				{data.items
					.sort((a, b) => a.order - b.order)
					.map((item, index) => {
						const sheet = new Sheet(item.variant.sheetData)
						if (item.toneKey) sheet.setKey(item.toneKey as note)
						const title = `${item.order + 1}.  ${item.variant.prefferedTitle}`

						return (
							<Box
								key={item.guid}
								sx={{
									pageBreakBefore: index === 0 ? 'none' : 'always',
								}}
							>
								<SheetDisplay
									title={title}
									sheet={sheet}
									variant="printCompact"
									columns={2}
									hideChords={false}
								/>
							</Box>
						)
					})}
			</div>
		)
	} catch (e) {
		return <NotFound />
	}
}

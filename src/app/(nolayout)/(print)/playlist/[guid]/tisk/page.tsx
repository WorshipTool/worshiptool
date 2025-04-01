'use client'
import NotFound from '@/app/(layout)/pisen/[hex]/[alias]/not-found'
import { getPlaylistDataByGuid } from '@/app/(layout)/playlist/[guid]/playlist.tech'
import PlaylistPrintOptions from '@/app/(nolayout)/(print)/playlist/[guid]/tisk/components/PlaylistPrintOptions'
import SheetDisplay from '@/common/components/SheetDisplay/SheetDisplay'
import { SmartPage } from '@/common/components/app/SmartPage/SmartPage'
import { PageProps } from '@/common/types'
import { Box, LinearProgress } from '@/common/ui'
import { useSmartParams } from '@/routes/useSmartParams'
import { useApiStateEffect } from '@/tech/ApiState'
import { Sheet, note } from '@pepavlin/sheet-api'
import { useEffect } from 'react'
import './styles.css'

export default SmartPage(Page)

const LANDSCAPE_MODE_CLASS_NAME = 'landscape-mode-body'
const PORTRAIT_MODE_CLASS_NAME = 'portrait-mode-body'

function Page({ params, ...props }: PageProps<'playlistPrint'>) {
	// check if printing is landscape mode
	const { landscapeMode } = useSmartParams('playlistPrint')
	// const landscapeMode = false

	useEffect(() => {
		// if landscapeMode add to body ..three-columns-body
		if (landscapeMode) {
			document.body.classList.add(LANDSCAPE_MODE_CLASS_NAME)
			document.body.classList.remove(PORTRAIT_MODE_CLASS_NAME)
		} else {
			document.body.classList.add(PORTRAIT_MODE_CLASS_NAME)
			document.body.classList.remove(LANDSCAPE_MODE_CLASS_NAME)
		}
	}, [landscapeMode])

	const onPrintClick = () => {
		window.print()
	}

	const [{ data, loading }] = useApiStateEffect(
		async () => getPlaylistDataByGuid(params.guid),
		[params.guid]
	)
	useEffect(() => {
		if (!data) return
		onPrintClick()
	}, [data])

	const items = data?.items
		.sort((a, b) => a.order - b.order)
		.map((item, index) => {
			const sheet = new Sheet(item.pack.sheetData)
			if (item.toneKey) sheet.setKey(item.toneKey as note)
			const title = `${item.order + 1}.  ${item.pack.title}`
			return {
				item: item,
				sheet: sheet,
				title: title,
			}
		})
	return loading || !data ? (
		<>
			<LinearProgress />
		</>
	) : data && items ? (
		<>
			{!landscapeMode ? (
				<div>
					{items.map((item, index) => {
						return (
							<Box
								key={item.item.guid}
								sx={{
									pageBreakBefore: index === 0 ? 'none' : 'always',
								}}
							>
								<SheetDisplay
									title={item.title}
									sheet={item.sheet}
									variant="printCompact"
									columns={2}
									hideChords={false}
								/>
							</Box>
						)
					})}
				</div>
			) : (
				<div>
					{items.map((item, index) => {
						return (
							<Box
								key={item.item.guid}
								sx={{
									// pageBreakBefore: index === 0 ? 'none' : 'always',
									marginTop: index === 0 ? 0 : 4,
								}}
							>
								<SheetDisplay
									title={item.title}
									sheet={item.sheet}
									variant="default"
									columns={2}
									hideChords={false}
								/>
							</Box>
						)
					})}
				</div>
			)}
			<Box
				sx={{
					position: 'fixed',
					top: 0,
					right: 0,
					displayPrint: 'none',
					padding: 2,
				}}
			>
				<PlaylistPrintOptions onPrint={onPrintClick} />
			</Box>
		</>
	) : (
		<>
			<NotFound />
		</>
	)
}

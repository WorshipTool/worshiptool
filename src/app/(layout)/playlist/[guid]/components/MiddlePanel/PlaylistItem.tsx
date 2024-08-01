import { Box, Paper } from '@mui/material'
import React, { memo, useEffect, useMemo } from 'react'

import TopPlaylistItemPanel from '@/app/(layout)/playlist/[guid]/components/MiddlePanel/TopPlaylistItemPanel'
import useInnerPlaylist from '@/app/(layout)/playlist/[guid]/hooks/useInnerPlaylist'
import DefaultStyle from '@/common/components/SheetDisplay/styles/DefaultStyle'
import { PlaylistItemGuid } from '@/interfaces/playlist/playlist.types'
import { Sheet } from '@pepavlin/sheet-api'

const PageBreak = () => {
	return (
		<Box
			sx={{
				pageBreakAfter: 'always',
			}}
		></Box>
	)
}

interface PlaylistItemProps {
	itemGuid: PlaylistItemGuid
}

export const PlaylistItem = memo(function A({ itemGuid }: PlaylistItemProps) {
	const { items } = useInnerPlaylist()

	const item = useMemo(() => {
		return items.find((i) => i.guid === itemGuid)!
	}, [items, itemGuid])

	const [sheet, setSheet] = React.useState<Sheet>(
		new Sheet(item.variant.sheetData)
	)
	const [title, setTitle] = React.useState<string>(item.variant.preferredTitle)
	const [number, setNumber] = React.useState(0)

	const rerender = () => {
		setNumber((prev) => prev + 1)
	}

	useEffect(() => {
		const note = item.toneKey
		if (!note) return
		sheet.setKey(note)
		rerender()
	}, [item])

	const sheetDefault = useMemo(() => {
		return (
			<DefaultStyle
				sheet={sheet}
				title={title}
				columns={1}
				hideChords={false}
			/>
		)
	}, [sheet, title, number])
	return (
		<>
			<Paper
				sx={{
					padding: 2,
					marginBottom: 1,
					displayPrint: 'none',
				}}
			>
				<Box
					position={'absolute'}
					marginTop={-20}
					id={'playlistItem_' + item.guid}
				></Box>
				<TopPlaylistItemPanel
					itemGuid={item.guid}
					packAlias={item.variant.packAlias}
					sheet={sheet}
				/>
				{sheetDefault}
			</Paper>
		</>
	)
})

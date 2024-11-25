import Redo from '@/app/(layout)/playlist/[guid]/components/TopPanel/components/SaveEditButtons/Redo'
import Undo from '@/app/(layout)/playlist/[guid]/components/TopPanel/components/SaveEditButtons/Undo'
import useInnerPlaylist from '@/app/(layout)/playlist/[guid]/hooks/useInnerPlaylist'
import { Box } from '@/common/ui'
import { Button } from '@/common/ui/Button'
import { IconButton } from '@/common/ui/IconButton'

export default function SaveEditButtons() {
	const { undo, redo, hasUndo, hasRedo, save, isSaved } = useInnerPlaylist()

	return (
		<Box
			sx={{
				display: 'flex',
				flexDirection: 'row',
			}}
		>
			<IconButton color="inherit" onClick={undo} disabled={!hasUndo}>
				<Undo />
			</IconButton>
			<IconButton color="inherit" onClick={redo} disabled={!hasRedo}>
				<Redo />
			</IconButton>

			<Button variant="text" color="inherit" disabled={isSaved} onClick={save}>
				{isSaved ? 'Uloženo' : 'Uložit'}
			</Button>
		</Box>
	)
}

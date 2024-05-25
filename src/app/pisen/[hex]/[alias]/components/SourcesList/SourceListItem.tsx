import { Chip } from '@mui/material'
import { SourceDto } from '../../../../../../api/dtos/source/SourceDto'
import { SourceTypes } from '../../../../../../interfaces/song/source'

export type SongPageProps = {
	source: SourceDto
}

export default function SourceListItem(props: SongPageProps) {
	const onClick = () => {
		if (props.source.type == SourceTypes.Url) {
			window.open(props.source.value, '_blank')
		}
	}
	return (
		<Chip
			label={props.source?.value}
			clickable={props.source.type == SourceTypes.Url}
			onClick={onClick}
		/>
	)
}

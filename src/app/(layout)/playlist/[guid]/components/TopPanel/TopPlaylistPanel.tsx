import Panel from '@/app/(layout)/playlist/[guid]/components/Panel'
import SaveEditButtons from '@/app/(layout)/playlist/[guid]/components/TopPanel/components/SaveEditButtons/SaveEditButtons'
import TitleBox from '@/app/(layout)/playlist/[guid]/components/TopPanel/components/TitleBox/TitleBox'
export default function TopPlaylistPanel() {
	return (
		<Panel
			sx={{
				height: '2.4rem',
				display: 'flex',
				alignItems: 'center',
				justifyContent: 'space-between',
			}}
		>
			<TitleBox />
			<SaveEditButtons />
		</Panel>
	)
}

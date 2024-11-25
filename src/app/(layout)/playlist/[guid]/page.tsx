'use client'
// import { useParams } from "react-router-dom";
import { SmartPage } from '@/common/components/app/SmartPage/SmartPage'
import PlaylistPreview from './components/PlaylistPreview'

export default SmartPage(PlaylistScreen, ['fullWidth', 'hideFooter'])

function PlaylistScreen() {
	return <PlaylistPreview />
}

import MediaSection from '@/app/(layout)/pisen/[hex]/[alias]/components/components/MediaSection'
import SideSection from '@/app/(layout)/pisen/[hex]/[alias]/components/SideSection'
import { Box, Typography } from '@/common/ui'
import { Chip } from '@/common/ui/mui'
import { ExtendedVariantPack } from '@/types/song'
import { useTranslations } from 'next-intl'
import { SongDto } from '../../../../../../api/dtos'
import useAuth from '../../../../../../hooks/auth/useAuth'
import { SourcesList } from './SourcesList/SourcesList'

interface AdditionalSongInfoPanelProps {
	song: SongDto
	variant: ExtendedVariantPack
	showMedia: boolean
}

/**
 * Sidebar sections with everything around the song itself:
 * videos/recordings, sources and (for admins) tags.
 */
export default function AdditionalSongInfoPanel({
	song,
	variant,
	...props
}: AdditionalSongInfoPanelProps) {
	const { isAdmin } = useAuth()
	const t = useTranslations('songPage')

	return (
		<>
			{/* VIDEOS & RECORDINGS */}
			{props.showMedia && song.media?.length > 0 && (
				<SideSection title={t('media.title')}>
					<MediaSection media={song.media} maxHeight="200px" />
				</SideSection>
			)}

			{/* SOURCES */}
			{variant.sources?.length > 0 && (
				<SideSection title={t('sources.title')}>
					<SourcesList variant={variant} />
				</SideSection>
			)}

			{/* TAGS (admin only) */}
			{isAdmin() && song.tags.length > 0 && (
				<SideSection title="Tagy">
					<Box display={'flex'} flexDirection={'row'} flexWrap={'wrap'} gap={0.5}>
						{song.tags.map((s) => {
							return <Chip label={s} key={s} size="small" />
						})}
					</Box>
				</SideSection>
			)}
		</>
	)
}

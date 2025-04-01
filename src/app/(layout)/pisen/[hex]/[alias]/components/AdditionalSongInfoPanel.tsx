import MediaSection from '@/app/(layout)/pisen/[hex]/[alias]/components/components/MediaSection'
import { Box, Typography } from '@/common/ui'
import { Chip } from '@/common/ui/mui'
import { ExtendedVariantPack } from '@/types/song'
import { SongDto } from '../../../../../../api/dtos'
import useAuth from '../../../../../../hooks/auth/useAuth'
import { SourcesList } from './SourcesList/SourcesList'

interface AdditionalSongInfoPanelProps {
	song: SongDto
	variant: ExtendedVariantPack
	showMedia: boolean
}

export default function AdditionalSongInfoPanel({
	song,
	variant,
	...props
}: AdditionalSongInfoPanelProps) {
	const { isAdmin, isLoggedIn } = useAuth()
	return (
		<Box display={'flex'} flexDirection={'column'} gap={1}>
			{/* VIDEOS */}

			{props.showMedia && <MediaSection media={song.media} />}

			{variant.sources?.length > 0 && <SourcesList variant={variant} />}
			<Box>
				{/* RESOURCES */}

				{isAdmin() ? (
					<>
						{/* TAGS */}
						{song.tags.length > 0 && (
							<>
								<Typography>Tagy</Typography>
								<Box
									display={'flex'}
									flexDirection={'row'}
									flexWrap={'wrap'}
									gap={0.5}
								>
									{song.tags.map((s) => {
										return <Chip label={s} key={s} />
									})}
								</Box>
							</>
						)}
					</>
				) : (
					<></>
				)}
			</Box>
		</Box>
	)
}

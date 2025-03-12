import MediaPlayer from '@/common/components/media/MediaPlayer'
import { Box, Typography } from '@/common/ui'
import { Chip } from '@/common/ui/mui'
import { ExtendedVariantPack } from '@/types/song'
import { SongDto } from '../../../../../../api/dtos'
import useAuth from '../../../../../../hooks/auth/useAuth'
import { SourcesList } from './SourcesList/SourcesList'

interface AdditionalSongInfoPanelProps {
	song: SongDto
	variant: ExtendedVariantPack
}

export default function AdditionalSongInfoPanel({
	song,
	variant,
}: AdditionalSongInfoPanelProps) {
	const { isAdmin, isLoggedIn } = useAuth()
	return (
		<Box sx={{}}>
			{/* VIDEOS */}
			{isLoggedIn() ? (
				<>
					{song.media.map((m) => (
						<MediaPlayer src={m.url} type={m.type} key={m.guid} />
					))}
				</>
			) : (
				<></>
			)}
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

						{/* CREATORS  //TODO*/}
						{/* {variant.creators.length > 0 && (
							<>
								<Typography>Autoři</Typography>
								<Box display={'flex'} flexDirection={'row'} gap={0.5}>
									{variant.creators.map((s) => {
										return <Chip label={s.name} key={s.name} />
									})}
								</Box>
							</>
						)} */}
					</>
				) : (
					<></>
				)}
			</Box>
		</Box>
	)
}

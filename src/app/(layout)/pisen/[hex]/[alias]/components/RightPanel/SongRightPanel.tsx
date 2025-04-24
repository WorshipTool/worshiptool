'use client'
import { SongDto } from '@/api/dtos'
import { useCloudConfig } from '@/common/providers/FeatureFlags/cloud-config/useCloudConfig'
import { Box, Button, Gap, Typography } from '@/common/ui'
import { Link } from '@/common/ui/Link/Link'
import { styled } from '@/common/ui/mui'
import { grey } from '@/common/ui/mui/colors'
import TranslationsSelectPopup from '@/common/ui/SongCard/components/TranslationsSelectPopup'
import { parseVariantAlias } from '@/tech/song/variant/variant.utils'
import { ExtendedVariantPack, PackTranslationType } from '@/types/song'
import { useState } from 'react'

const Container = styled(Box)(({ theme }) => ({
	backgroundColor: grey[200],
	borderStyle: 'solid',
	borderWidth: 1,
	borderColor: grey[300],
	borderRadius: theme.spacing(1),
	padding: theme.spacing(2),
	boxShadow: '0px 1px 2px 1px rgba(0, 0, 0, 0.05)',
}))

type Props = {
	song: SongDto
	pack: ExtendedVariantPack
}

export default function SongRightPanel(props: Props) {
	const showRightPanel = useCloudConfig('songPage', 'SHOW_RIGHT_PANEL', false)
	const showSupport = useCloudConfig(
		'songPage',
		'SHOW_FINANCIAL_SUPPORT_CARD',
		false
	)

	const original = props.song.variants.find(
		(v) => v.translationType === PackTranslationType.Original
	)
	const thisIsOriginal =
		props.pack.translationType === PackTranslationType.Original

	const moreVariants = props.song.variants.length - 1

	const [translationPopupOpen, setTranslationPopupOpen] = useState(false)

	return !showRightPanel ? null : (
		<Box
			sx={{
				width: '300px',
				// position: 'sticky',
				// top: 56 + 16,
				gap: 2,
				display: 'flex',
				flexDirection: 'column',
				// paddingTop: 10,
			}}
		>
			<Container>
				<Typography color="grey.800" variant="h6">
					{props.pack.title}
				</Typography>
				{thisIsOriginal ? (
					<>
						<Typography color="grey.600" small>
							Jedná se o originál
						</Typography>
					</>
				) : original ? (
					<>
						<Box display={'flex'} gap={0.5}>
							<Typography color="grey.600" small>
								Překlad originálu
							</Typography>
							<Link to="variant" params={parseVariantAlias(original.packAlias)}>
								<Typography small strong color="grey.800">
									{original.title}
								</Typography>
							</Link>
						</Box>
					</>
				) : null}

				<Gap value={2} />

				{moreVariants > 0 ? (
					<>
						<Button
							onClick={() => setTranslationPopupOpen(true)}
							small
							outlined
						>
							Zvolit jiný z překlad
						</Button>
						<TranslationsSelectPopup
							open={translationPopupOpen}
							onClose={() => setTranslationPopupOpen(false)}
							packs={props.song.variants}
						/>
					</>
				) : (
					<Typography>Zatím nemáme připnuté žádné další překlady</Typography>
				)}
			</Container>

			{showSupport && (
				<Container
					sx={{
						bgcolor: 'grey.100',
						boxShadow: '0px 1px 10px 1px rgba(0, 0, 0, 0.1)',
						gap: 1,
						display: 'flex',
						flexDirection: 'column',
					}}
				>
					<Typography
						variant="h6"
						align="center"
						sx={
							{
								// color: 'primary.main',
							}
						}
					>
						Podpořte ChvalOtce.cz 🚀
					</Typography>
					<Typography align="center">
						Ahoj! Tento zpěvník tvoříme pro vás ve svém volném čase.
					</Typography>
					<Typography align="center">
						Podpořte nás, abychom mohli tvořit dál, přidat další vylepšení a
						odladit všechny chybičky.
					</Typography>
					<Gap />

					<Button color="success" outlined>
						Podpořit
					</Button>
				</Container>
			)}

			<Container>
				<Typography variant="h6">Podobné chvály</Typography>
				{['Ocean1', 'Ocean2', 'Ocean1', 'Ocean2', 'Ocean1'].map(
					(title, index) => (
						<Typography key={index}>
							{index + 1}. {title}
						</Typography>
					)
				)}
			</Container>
		</Box>
	)
}

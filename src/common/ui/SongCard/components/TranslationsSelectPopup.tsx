import Popup from '@/common/components/Popup/Popup'
import { Box } from '@/common/ui/Box'
import {
	SongVariantCard,
	ToLinkProps,
} from '@/common/ui/SongCard/SongVariantCard'
import { BasicVariantPack } from '@/types/song'

type Props = {
	open: boolean
	onClose: () => void
	packs: BasicVariantPack[]

	toLinkProps?: ToLinkProps
}

export default function TranslationsSelectPopup(props: Props) {
	return (
		<>
			<Popup
				open={props.open}
				onClose={props.onClose}
				title="Vybrat jiný překlad"
			>
				<Box
					maxHeight={600}
					overflow="auto"
					display={'flex'}
					gap={1}
					flexDirection={'column'}
				>
					{props.packs.map((d) => (
						<Box key={d.packGuid} position={'relative'}>
							<SongVariantCard
								key={d.packGuid}
								data={d}
								properties={['SHOW_PRIVATE_LABEL', 'ENABLE_TRANSLATION_LIKE']}
								toLinkProps={props.toLinkProps}
							/>
						</Box>
					))}
				</Box>
			</Popup>
		</>
	)
}

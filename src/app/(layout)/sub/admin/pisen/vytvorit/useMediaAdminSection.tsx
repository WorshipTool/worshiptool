import { PostCreateVariantOutDto } from '@/api/generated'
import { useApi } from '@/api/tech-and-hooks/useApi'
import AddMediaAdminButton from '@/app/(layout)/sub/admin/pisen/[hex]/[alias]/components/AddMediaAdminButton'
import { AdminStepperItem } from '@/app/(layout)/sub/admin/pisen/vytvorit/page'
import MediaPlayer from '@/common/components/media/MediaPlayer'
import { Button, Gap } from '@/common/ui'
import { Masonry } from '@/common/ui/Masonry'
import { useApiStateEffect } from '@/tech/ApiState'

export const useMediaAdminSection = (
	packData: PostCreateVariantOutDto
): AdminStepperItem => {
	const api = useApi('songGettingApi')
	const [apiState, reload] = useApiStateEffect(async () => {
		if (!packData?.alias) return null
		return await api.getVariantDataByAlias(packData.alias as string)
	}, [packData])

	return {
		label: 'Media',
		actions: (cont, disabledContinue) => (
			<Button
				onClick={async () => {
					cont()
				}}
				disabled={disabledContinue}
			>
				Pokračovat
			</Button>
		),
		component: (
			<>
				<AddMediaAdminButton onChange={reload} />
				<Gap />
				<Masonry columns={3}>
					{apiState.data?.media.map((media) => (
						<MediaPlayer
							key={media.guid}
							src={media.url}
							type={media.type}
							maxHeight="140px"
						/>
					))}
				</Masonry>
			</>
		),
	}
}

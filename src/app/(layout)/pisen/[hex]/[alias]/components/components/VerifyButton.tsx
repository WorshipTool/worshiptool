'use client'
import { SongVariantDto } from '@/api/dtos'
import { Button } from '@/common/ui'
import { ButtonGroup } from '@/common/ui/ButtonGroup'
import { useApi } from '@/hooks/api/useApi'
import { handleApiCall } from '@/tech/handleApiCall'

type VerifyButtonProps = {
	variant: SongVariantDto
}

export default function VerifyButton(props: VerifyButtonProps) {
	const { songPublishingApi } = useApi()

	const setVerify = async (status: boolean | null) => {
		await handleApiCall(
			songPublishingApi.songPublishingControllerVerifyVariant({
				variantGuid: props.variant.guid,
				verify: status,
			})
		)
		window.location.reload()
	}
	return (
		<div>
			{props.variant?.verified !== null ? (
				<>
					<Button
						variant="contained"
						size="small"
						onClick={() => {
							setVerify(null)
						}}
					>
						{props.variant.verified ? 'Zrušit ověření' : 'Zrušit zamítnutí'}
					</Button>
				</>
			) : (
				<>
					<ButtonGroup>
						<Button
							variant="contained"
							size="small"
							onClick={() => {
								setVerify(true)
							}}
						>
							Ověřit
						</Button>
						<Button
							variant="contained"
							size="small"
							onClick={() => {
								setVerify(false)
							}}
						>
							Zamitnout
						</Button>
					</ButtonGroup>
				</>
			)}
		</div>
	)
}

'use client'
import { useApi } from '@/api/tech-and-hooks/useApi'
import { Button } from '@/common/ui'
import { ButtonGroup } from '@/common/ui/ButtonGroup'
import { BasicVariantPack } from '@/types/song'

type VerifyButtonProps = {
	variant: BasicVariantPack
}

export default function VerifyButton(props: VerifyButtonProps) {
	const { songPublishingApi } = useApi()

	const setVerify = async (status: boolean | null) => {
		await songPublishingApi.songPublishingControllerVerifyVariant({
			packGuid: props.variant.packGuid,
			verify: status,
		})

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

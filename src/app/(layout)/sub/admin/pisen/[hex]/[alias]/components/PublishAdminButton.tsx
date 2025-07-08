'use client'

import { useApi } from '@/api/tech-and-hooks/useApi'
import { useInnerPack } from '@/app/(layout)/pisen/[hex]/[alias]/hooks/useInnerPack'
import { Button } from '@/common/ui'

export default function PublishAdminButton() {
	const api = useApi('songPublishingApi')

	const pack = useInnerPack()

	const unpublish = async () => {
		await api.unpublishVariant({
			packGuid: pack.packGuid,
		})

		window.location.reload()
	}
	return (
		<>
			{pack.public && (
				<>
					<Button onClick={unpublish}>Zrušit zveřejnění</Button>
				</>
			)}
		</>
	)
}

import { Box } from '@/common/ui'
import { RoutesKeys, SmartAllParams } from '@/routes'

type Item<T extends RoutesKeys = RoutesKeys> = {
	label: string
	to: T
	toParams: SmartAllParams<T>
}

export const ADMIN_BREADCRUMBS_PROVIDER_ID = 'admin-bread-provider'

export default function AdminBreadcrumbs() {
	return (
		<Box
			id={ADMIN_BREADCRUMBS_PROVIDER_ID}
			sx={{
				display: 'flex',
				flexDirection: 'row',
				gap: 1,
			}}
		></Box>
	)
}

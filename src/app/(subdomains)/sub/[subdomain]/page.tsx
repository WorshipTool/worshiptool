'use client'

import { SmartPage } from '@/common/components/app/SmartPage/SmartPage'
import { useSmartParams } from '@/routes/useSmartParams'

export default SmartPage(SubdomainPage)
function SubdomainPage() {
	const a = useSmartParams('subdomain')
	return <div>Zde bude subdoména: {a.subdomain}</div>
}

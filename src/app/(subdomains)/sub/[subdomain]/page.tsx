'use client'

import { useSmartParams } from '@/routes/useSmartParams'

export default function SubdomainPage() {
	const a = useSmartParams('subdomain')
	return <div>Zde bude subdoména: {a.subdomain}</div>
}

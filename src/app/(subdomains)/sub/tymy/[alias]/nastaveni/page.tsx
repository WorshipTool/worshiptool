'use client'
import { TeamPageTitle } from '@/app/(subdomains)/sub/tymy/[alias]/components/TopPanel/components/TeamPageTitle'
import Popup from '@/common/components/Popup/Popup'
import { Button } from '@/common/ui/Button'
import { useState } from 'react'

export default function TeamSettingsPage() {
	const [open, setOpen] = useState(false)

	return (
		<div>
			<TeamPageTitle>Nastavení</TeamPageTitle>
			Nastavenii
			<Button onClick={() => setOpen(true)}>Otevřít popup</Button>
			<Popup open={open} onClose={() => setOpen(false)}>
				Ahojky
			</Popup>
		</div>
	)
}

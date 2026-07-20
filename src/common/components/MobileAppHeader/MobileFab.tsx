'use client'

import { Button } from '@/common/ui'
import { RoutesKeys } from '@/routes/routes.types'
import { CommonLinkProps } from '@/common/ui/Link/Link'
import { ReactNode } from 'react'

type MobileFabProps<T extends RoutesKeys> = {
	/** The icon shown inside the FAB. */
	children: ReactNode
	/** Accessible label (also the tooltip). */
	alt?: string
	onClick?: () => void
	to?: CommonLinkProps<T>['to']
	toParams?: CommonLinkProps<T>['params']
	loading?: boolean
}

/**
 * Rounded primary floating action button used in the MobileAppHeader `fab` slot,
 * so the FAB looks the same across pages. Wraps the house Button (typed nav via
 * `to` / `toParams`, or an `onClick`).
 */
export default function MobileFab<T extends RoutesKeys>({
	children,
	alt,
	onClick,
	to,
	toParams,
	loading,
}: MobileFabProps<T>) {
	return (
		<Button
			color="primary"
			onClick={onClick}
			to={to}
			toParams={toParams}
			alt={alt}
			tooltip={alt}
			loading={loading}
			sx={{
				minWidth: 56,
				width: 56,
				height: 56,
				borderRadius: '50%',
				padding: 0,
				boxShadow: '0 6px 16px rgba(0,133,255,0.45)',
			}}
		>
			{children}
		</Button>
	)
}

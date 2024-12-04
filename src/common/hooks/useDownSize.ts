'use client'

import { useMediaQuery } from '@/common/ui/mui'
import breakpoints from '@/tech/theme/theme.tech'

type Breakpoint = 'xs' | 'sm' | 'md' | 'lg' | 'xl'
export const useDownSize = (point: Breakpoint) => {
	const result = useMediaQuery(breakpoints.down(point))

	return result
}

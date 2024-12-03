import { _muiTheme } from '@/app/theme'
import { ThemeProvider as TP } from '@mui/material/styles'
import { Roboto } from 'next/font/google'
import React from 'react'

const roboto = Roboto({
	weight: '400',
	subsets: ['latin'],
	display: 'swap',
})

type ThemeProviderProps = {
	children: React.ReactNode
}
export default function ThemeProvider({ children }: ThemeProviderProps) {
	return (
		<div className={roboto.className}>
			<TP theme={_muiTheme}>{children}</TP>
		</div>
	)
}

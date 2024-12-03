'use client'
import { theme } from '@/common/constants/theme'
import { createTheme } from '@/common/ui/mui'
import { responsiveFontSizes } from '@mui/material/styles'
import { csCZ } from '@mui/x-date-pickers/locales'
import { Roboto } from 'next/font/google'

let muiTheme = createTheme(
	{
		...theme,
		typography: {
			h1: {
				fontSize: '5rem',
				fontWeight: 400,
				lineHeight: 1,
			},
			h2: {
				fontSize: '3rem',
				fontWeight: 300,
			},
			h3: {
				fontSize: '2rem',
				lineHeight: 1.4,
			},
			h4: {
				fontSize: '1.5rem',
			},
			h5: {
				fontSize: '1.25rem',
			},
			h6: {
				fontSize: '1.125rem',
			},
		},
	},
	csCZ
)
muiTheme = responsiveFontSizes(muiTheme)
export const _muiTheme = muiTheme

// theme.typography.h4 = {
// 	fontSize: '1.2rem',
// }

// theme.typography.h5 = {
// 	fontSize: '1.1rem',
// }

// theme.typography.h6 = {
// 	fontSize: '1rem',
// }
export const roboto = Roboto({
	weight: '400',
	subsets: ['latin'],
	display: 'swap',
})

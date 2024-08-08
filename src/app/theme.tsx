import { theme } from '@/common/constants/theme'
import { createTheme } from '@mui/material'
import { ThemeProvider as TP } from '@mui/material/styles'
import { Roboto } from 'next/font/google'

const muiTheme = createTheme(theme)

// theme.typography.h1 = {
// 	fontSize: '1.5rem',
// }

// theme.typography.h2 = {
// 	fontSize: '1.4rem',
// }

// theme.typography.h3 = {
// 	fontSize: '1.3rem',
// }

// theme.typography.h4 = {
// 	fontSize: '1.2rem',
// }

// theme.typography.h5 = {
// 	fontSize: '1.1rem',
// }

// theme.typography.h6 = {
// 	fontSize: '1rem',
// }
const roboto = Roboto({
	weight: '400',
	subsets: ['latin'],
	display: 'swap',
})

type ThemeProviderProps = {
	children: React.ReactNode
}

export const ThemeProvider = ({ children }: ThemeProviderProps) => {
	return (
		<TP theme={muiTheme}>
			<div className={roboto.className}>{children}</div>
		</TP>
	)
}

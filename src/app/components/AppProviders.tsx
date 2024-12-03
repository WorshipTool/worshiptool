import { GoogleOAuthProvider } from '@react-oauth/google'
// import { BrowserRouter } from "react-router-dom";

import AppClientProviders from '@/app/components/AppClientProviders'
import ThemeProvider from '@/app/providers/ThemeProvider'
import { CookiesProvider } from 'next-client-cookies/server'
import React from 'react'

type AppProvidersProps = {
	children?: React.ReactNode
}

export default function AppProviders(props: AppProvidersProps) {
	return (
		<ThemeProvider>
			<CookiesProvider>
				<GoogleOAuthProvider clientId="736869166999-nckrpcdmab26hkp7s1cjbgdfu51igac9.apps.googleusercontent.com">
					<AppClientProviders>{props.children}</AppClientProviders>
				</GoogleOAuthProvider>
			</CookiesProvider>
		</ThemeProvider>
	)
}

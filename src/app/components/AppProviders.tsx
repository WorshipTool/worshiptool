'use server'
import { GoogleOAuthProvider } from '@react-oauth/google'
// import { BrowserRouter } from "react-router-dom";

import AppClientProviders from '@/app/components/AppClientProviders'
import ThemeProvider from '@/app/providers/ThemeProvider'
import { fetchAllCommonDataServer } from '@/hooks/common-data/fetchCommonDataServer'
import { CookiesProvider } from 'next-client-cookies/server'
import React from 'react'

type AppProvidersProps = {
	children?: React.ReactNode
}

export default async function AppProviders(props: AppProvidersProps) {
	const commonData = await fetchAllCommonDataServer()
	return (
		<ThemeProvider>
			<CookiesProvider>
				<GoogleOAuthProvider clientId="736869166999-nckrpcdmab26hkp7s1cjbgdfu51igac9.apps.googleusercontent.com">
					<AppClientProviders initialCommonData={commonData}>
						{props.children}
					</AppClientProviders>
				</GoogleOAuthProvider>
			</CookiesProvider>
		</ThemeProvider>
	)
}

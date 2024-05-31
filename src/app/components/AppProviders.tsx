'use client'

import { GoogleOAuthProvider } from '@react-oauth/google'
import { SnackbarProvider } from 'notistack'
// import { BrowserRouter } from "react-router-dom";

import { GoogleAnalytics } from '@next/third-parties/google'
import React from 'react'
import ErrorHandlerProvider from '../../common/components/app/providers/ErrorHandlerProvider'
import { AuthProvider } from '../../hooks/auth/useAuth'
import { GroupProvider } from '../../hooks/group/useGroup'
import { PlaylistProvider } from '../../hooks/playlist/useCurrentPlaylist'
import { StackProvider } from '../../hooks/playlist/useStack'
import { ThemeProvider } from '../theme'

type AppProvidersProps = {
	children?: React.ReactNode
}

export default function AppProviders(props: AppProvidersProps) {
	return (
		<>
			<GoogleOAuthProvider clientId="736869166999-nckrpcdmab26hkp7s1cjbgdfu51igac9.apps.googleusercontent.com">
				<ThemeProvider>
					<SnackbarProvider
						maxSnack={1}
						anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
						autoHideDuration={3000}
					>
						{/* <BrowserRouter> */}
						<AuthProvider>
							<ErrorHandlerProvider>
								<StackProvider>
									<GroupProvider>
										<PlaylistProvider>{props.children}</PlaylistProvider>
									</GroupProvider>
								</StackProvider>
							</ErrorHandlerProvider>
						</AuthProvider>
						{/* </BrowserRouter> */}
					</SnackbarProvider>
				</ThemeProvider>
			</GoogleOAuthProvider>
			<GoogleAnalytics gaId="G-1BHSYS3YY2" />
		</>
	)
}

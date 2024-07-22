'use client'

import { CredentialResponse, useGoogleOneTapLogin } from '@react-oauth/google'
// import Cookies from 'js-cookie'
import { AUTH_COOKIE_NAME } from '@/hooks/auth/auth.constants'
import { jwtDecode } from 'jwt-decode'
import { useCookies } from 'next-client-cookies'
import { useSnackbar } from 'notistack'
import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { SignUpRequestDTO, loginResultDTOToUser } from '../../api/dtos/dtosAuth'
import { AuthApi, Configuration, LoginInputData } from '../../api/generated'
import { ROLES, UserDto } from '../../interfaces/user'

export const authContext = createContext<ReturnType<typeof useProvideAuth>>({
	login: async () => {},
	loginWithGoogle: () => {},
	logout: async () => {},
	signup: () => {},
	isLoggedIn: () => false,
	user: undefined,
	info: {} as UserDto,
	isTrustee: () => false,
	isAdmin: () => false,
	loading: false,
	apiConfiguration: {
		isJsonMime: () => true,
	},
	checkIfCookieExists: () => false,
})

export const AuthProvider = ({ children }: { children: any }) => {
	const auth = useProvideAuth()

	return <authContext.Provider value={auth}>{children}</authContext.Provider>
}

export default function useAuth() {
	return useContext(authContext)
}

export function useProvideAuth() {
	// Cookies
	const cookies = useCookies()
	const _setCookie = (user: UserDto) => {
		cookies.set(AUTH_COOKIE_NAME, JSON.stringify(user))
	}
	const _getCookie = (): UserDto | undefined => {
		const value = cookies.get(AUTH_COOKIE_NAME)
		if (value) {
			return JSON.parse(value)
		}
		return undefined
	}
	const _emptyCookie = () => {
		cookies.remove(AUTH_COOKIE_NAME)
	}

	// User state
	const [user, setUser] = useState<UserDto | undefined>(_getCookie())
	const token = useMemo(() => user?.token, [user])

	// API configuration
	const apiConfiguration: Configuration = useMemo(
		() => ({
			isJsonMime: () => true,
			accessToken: token,
		}),
		[token]
	)

	// If not logged in, enable Google login
	const [googleShouldLogin, setGoogleShouldLogin] = useState<boolean>(false)
	useGoogleOneTapLogin({
		disabled: !googleShouldLogin,
		onSuccess: (credentialResponse: CredentialResponse) => {
			loginWithGoogle(credentialResponse)
		},
	})
	useEffect(() => {
		if (user != null) {
			setGoogleShouldLogin(true)
		}
	}, [])

	// Snackbar
	const { enqueueSnackbar } = useSnackbar()

	// API
	const authApi = new AuthApi(apiConfiguration)

	const [loading, setLoading] = useState<boolean>(false)
	const login = async (
		{ email, password }: { email: string; password: string },
		after?: (r: any) => void
	) => {
		setLoading(true)

		const body: LoginInputData = {
			email,
			password,
		}

		return authApi
			.authControllerLogin(body)
			.then((result) => {
				_innerLogin(loginResultDTOToUser(result.data))
				if (after) after(result.data)
			})
			.catch((err) => {
				console.log(err)
				if (after) after(err.response)
			})
			.finally(() => {
				setLoading(false)
			})
	}

	const _innerLogin = (user: UserDto) => {
		enqueueSnackbar(
			`Ahoj ${user.firstName} ${user.lastName}. Ať najdeš, po čem paseš.`
		)
		setUser(user)
		_setCookie(user)
	}
	const logout = async () => {
		setLoading(false)
		if (checkIfCookieExists()) await authApi.authControllerLogout()
		setUser(undefined)
		_emptyCookie()
		enqueueSnackbar('Byl jsi odhlášen. Zase někdy!')
		setLoading(false)
	}

	const signup = (data: SignUpRequestDTO, after?: (r: boolean) => void) => {
		setLoading(true)
		const body = data

		authApi
			.authControllerSignup(body)
			.then((result) => {
				if (after) after(true)
			})
			.catch((err) => {
				console.log(err)
				if (after) after(false)
			})
			.finally(() => {
				setLoading(false)
			})
	}

	const loginWithGoogle = (
		response: CredentialResponse,
		after?: (r: any) => void
	) => {
		setLoading(true)

		const decoded: any = jwtDecode(response.credential || '')
		const data = {
			userToken: decoded.sub,
			email: decoded.email,
			firstName: decoded.given_name,
			lastName: decoded.family_name,
		}

		authApi
			.authControllerLoginWithGoogle(data)
			.then((result) => {
				_innerLogin(loginResultDTOToUser(result.data))
				if (after) after(result.data)
			})
			.catch((err) => {
				console.log(err)
				if (after) after(err.response)
			})
			.finally(() => {
				setLoading(false)
			})
	}

	const isLoggedIn = () => user != undefined

	// Check if cookie still exists
	const checkIfCookieExists = (): boolean => {
		return _getCookie() !== undefined
	}

	return {
		login,
		logout,
		signup,
		loginWithGoogle,
		isLoggedIn,
		user,
		info: user ? user : ({} as UserDto),
		isTrustee: () => user != undefined && user.role == ROLES.Trustee,
		isAdmin: () => user != undefined && user.role == ROLES.Admin,
		loading,
		apiConfiguration,
		checkIfCookieExists,
	}
}

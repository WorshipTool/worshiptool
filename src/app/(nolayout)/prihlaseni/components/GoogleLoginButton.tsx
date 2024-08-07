'use client'
import { CredentialResponse, GoogleLogin } from '@react-oauth/google'
import useAuth from '../../../../hooks/auth/useAuth'
import { useSmartNavigate } from '../../../../routes/useSmartNavigate'

type GoogleLoginButtonProps = {
	afterLogin?: () => void
}

export default function GoogleLoginButton(props: GoogleLoginButtonProps) {
	const { loginWithGoogle } = useAuth()
	const navigate = useSmartNavigate()
	const onSuccess = (credentialResponse: CredentialResponse) => {
		loginWithGoogle(
			credentialResponse,
			props.afterLogin || (() => navigate('home', {}))
		)
	}

	const onFailure = () => {}

	return (
		<GoogleLogin
			onSuccess={onSuccess}
			onError={onFailure}
			useOneTap
			auto_select
			width={300}
		/>
	)
}

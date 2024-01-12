import React from 'react'
import {CredentialResponse, GoogleLogin} from "@react-oauth/google"
import {jwtDecode} from "jwt-decode"
import axios from "axios"
import useAuth from '../../../hooks/auth/useAuth'
import { useNavigate } from 'react-router-dom'

export default function GoogleLoginButton() {

    const {login, signup, loginWithGoogle} = useAuth();
    const navigate = useNavigate();
    const onSuccess = (credentialResponse: CredentialResponse) => {
        loginWithGoogle(credentialResponse, (r)=>{
            navigate("/")
        })
    }

    const onFailure = () => {
    }

  return (
    <div>
        <GoogleLogin onSuccess={onSuccess} onError={onFailure} useOneTap auto_select/>
    </div>
  )
}

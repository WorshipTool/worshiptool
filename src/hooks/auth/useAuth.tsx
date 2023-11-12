import React, { createContext, useContext, useEffect, useState } from "react";
import User, { ROLES } from "../../interfaces/user";
import useFetch from "../useFetch";
import { LoginRequestDTO, LoginResultDTO, PostLoginGoogleDto, SignUpRequestDTO, loginResultDTOToUser } from '../../api/dtos/dtosAuth';
import { getUrl, getUrl_LOGIN, getUrl_SIGNUP } from "../../api/urls";
import { RequestResult, codes, isRequestSuccess } from "../../api/dtos/RequestResult";
import { useSnackbar } from "notistack";
import useGroup from "../group/useGroup";
import { LOGIN_GOOGLE_URL } from "../../api/constants";
import { CredentialResponse, useGoogleOneTapLogin } from "@react-oauth/google";
import { jwtDecode } from "jwt-decode";

export const authContext = createContext<useProvideAuthI>({
    login: () => {},
    loginWithGoogle: () => {},
    logout: () => {},
    signup: () => {},
    isLoggedIn: () => false,
    user: undefined,
    info: {} as User,
    getAuthHeader: ()=>{},
    isTrustee: ()=>false,
    isAdmin: ()=>false
});

export const AuthProvider = ({children}:{children:any}) => {
    const auth = useProvideAuth();
    return <authContext.Provider value={auth}>{children}</authContext.Provider>
}

export default function useAuth(){
    return useContext(authContext);
}

interface useProvideAuthI{
    login: ({email, password}:{email:string, password:string}, after? : (r: RequestResult<any>)=>void) => void,
    loginWithGoogle: (data: CredentialResponse, after? : (r: RequestResult<any>)=>void) => void,
    logout: () => void,
    signup: (data:SignUpRequestDTO, after? : (r: RequestResult<any>)=>void) => void,
    isLoggedIn: () => boolean,
    user: User|undefined,
    info: User,
    getAuthHeader: ()=>any,
    isTrustee: ()=>boolean,
    isAdmin: ()=>boolean
}

export function useProvideAuth(){
    const [user, setUser] = useState<User>();
    const {post} = useFetch();

    const {enqueueSnackbar} = useSnackbar();

    const [googleShouldLogin, setGoogleShouldLogin] = useState<boolean>(false);
    const autoGoogleLogin = useGoogleOneTapLogin({
        disabled: !googleShouldLogin,
        onSuccess: (credentialResponse: CredentialResponse) => {
            loginWithGoogle(credentialResponse);
        }
    });

    useEffect(()=>{
        const u = localStorage.getItem("user");
        if(u!=null){
            setUser(JSON.parse(u));
        }else{
            setGoogleShouldLogin(true);
        }
    },[]);

    useEffect(()=>{
        if(user!==undefined){
            localStorage.setItem("user", JSON.stringify(user));
        }
    },[user])

    const login = ({email, password}:{email:string, password:string}, after? : (r: RequestResult<any>)=>void) => {
        const body : LoginRequestDTO = {
            email,
            password
        }
        post({
            url: getUrl_LOGIN(),
            body
        }, (result : RequestResult<LoginResultDTO>) => {
            if(result.statusCode==codes["Success"]){
                innerLogin(loginResultDTOToUser(result.data));
            }else{
                console.log(result.message);
            }

            if(after)after(result);
            
        })
        

    }

    const innerLogin = (user: User) => {
        enqueueSnackbar(`Ahoj ${user.firstName} ${user.lastName}. Ať najdeš, po čem paseš.`,);
        setUser(user);
    }
    const logout = () => {
        setUser(undefined);
        localStorage.removeItem("user");
        enqueueSnackbar("Byl jsi odhlášen. Zase někdy!");
    }

    const signup = (data: SignUpRequestDTO, after? : (r: RequestResult<any>)=>void) => {
        const body = data;
        post({
            url: getUrl_SIGNUP(),
            body
        }, (result : RequestResult<null>) => {
            console.log(result.message);
            if(isRequestSuccess(result)){
                enqueueSnackbar("Účet byl vytvořen. Nyní se můžeš přihlásit.");
            }
            
            if(after)after(result);
        })
    }

    const loginWithGoogle = (response: CredentialResponse, after? : (r: RequestResult<any>)=>void) => {
        const decoded : any = jwtDecode(response.credential || "")
        const data = {
            userToken: decoded.sub,
            email: decoded.email,
            firstName: decoded.given_name,
            lastName: decoded.family_name,
        };

        post({
            url: getUrl(LOGIN_GOOGLE_URL),
            body: data
        }, (result : RequestResult<LoginResultDTO>) => {
            if(result.statusCode==codes["Success"]){
                innerLogin(loginResultDTOToUser(result.data));
            }else{
                console.log(result.message);
            }

            if(after)after(result);
        })
    }

    const isLoggedIn = () => {
        return user!==undefined;
    }

    const getAuthHeader = () => {
        if(user)return {Authorization: "Bearer "+user.token};
        return {};
    }

    return {
        login, logout, signup, loginWithGoogle,
        isLoggedIn,
        user,
        info: (user?user:({} as User)),
        getAuthHeader,
        isTrustee: ()=>user!=undefined&&user.role==ROLES.Trustee,
        isAdmin: ()=>user!=undefined&&user.role==ROLES.Admin

    }
}
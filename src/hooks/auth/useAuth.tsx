import React, { createContext, useContext, useEffect, useState } from "react";
import User, { ROLES } from "../../models/user";
import useFetch from "../useFetch";
import { LoginRequestDTO, LoginResultDTO, SignUpRequestDTO, loginResultDTOToUser } from "../../backend/dtos/dtosAuth";
import { getUrl_LOGIN, getUrl_SIGNUP } from "../../backend/urls";
import { RequestResult, codes, isRequestSuccess } from "../../backend/dtos/RequestResult";
import { useSnackbar } from "notistack";

export const authContext = createContext<useProvideAuthI>({
    login: () => {},
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

    useEffect(()=>{
        const u = localStorage.getItem("user");
        if(u!=null){
            setUser(JSON.parse(u));
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
                enqueueSnackbar(`Ahoj ${result.data.user.firstName} ${result.data.user.lastName}. Ať najdeš, po čem paseš.`,);

                setUser(loginResultDTOToUser(result.data));
            }else{
                console.log(result.message);
            }

            if(after)after(result);
            
        })
        

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

    const isLoggedIn = () => {
        return user!==undefined;
    }

    const getAuthHeader = () => {
        if(user)return {Authorization: "Bearer "+user.token};
        return {};
    }

    return {
        login, logout, signup,
        isLoggedIn,
        user,
        info: (user?user:({} as User)),
        getAuthHeader,
        isTrustee: ()=>user!=undefined&&user.role==ROLES.Trustee,
        isAdmin: ()=>user!=undefined&&user.role==ROLES.Admin

    }
}
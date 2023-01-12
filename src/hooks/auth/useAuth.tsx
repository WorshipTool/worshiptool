import React, { createContext, useContext, useEffect, useState } from "react";
import User from "../../models/user";
import useFetch from "../useFetch";
import { LoginRequestDTO, LoginResultDTO, loginResultDTOToUser } from "../../backend/dtosAuth";
import { getUrl_LOGIN } from "../../backend/urls";
import { RequestResult, codes } from "../../backend/dtosRequestResult";

export const authContext = createContext<useProvideAuthI>({
    login: () => {},
    logout: () => {},
    isLoggedIn: () => false,
    user: undefined,
    getAuthHeader: ()=>{}
});

export const AuthProvider = ({children}:{children:any}) => {
    const auth = useProvideAuth();
    return <authContext.Provider value={auth}>{children}</authContext.Provider>
}

export default function useAuth(){
    return useContext(authContext);
}

interface useProvideAuthI{
    login: ({email, password}:{email:string, password:string}) => void,
    logout: () => void,
    isLoggedIn: () => boolean,
    user: User|undefined,
    getAuthHeader: ()=>any
}

export function useProvideAuth(){
    const [user, setUser] = useState<User>();

    const {post} = useFetch();

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

    const login = ({email, password}:{email:string, password:string}) => {
        const body : LoginRequestDTO = {
            email,
            password
        }
        post({
            url: getUrl_LOGIN(),
            body
        }, (result : RequestResult<LoginResultDTO>) => {
            if(result.statusCode==codes["Success"]){
                setUser(loginResultDTOToUser(result.data));
            }else{
                console.log(result.message);
            }
            
        })
        

    }
    const logout = () => {
        setUser(undefined);
        localStorage.removeItem("user");
        
    }
    const isLoggedIn = () => {
        return user!==undefined;
    }

    const getAuthHeader = () => {
        if(user)return {Authorization: "Bearer "+user.token};
        return {};
    }

    return {
        login, logout,
        isLoggedIn,
        user,
        getAuthHeader
    }
}
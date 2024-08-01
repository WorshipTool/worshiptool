import User from "../../interfaces/user"
import { LoginResult } from "../generated";

export interface LoginRequestDTO{
    email: string,
    password: string
}

export interface LoginResultDTO{
    user: User,
    token: string
}

export interface SignUpRequestDTO{
    firstName: string,
    lastName: string,
    email:string,
    password:string
}

export function loginResultDTOToUser(res: LoginResult):User{
    return {...res.user, token: res.token};
}   

export interface PostLoginGoogleDto {
    userToken: string;
    email: string;
    firstName: string;
    lastName: string
}

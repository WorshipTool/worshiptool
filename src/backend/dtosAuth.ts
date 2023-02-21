import User from "../models/user"

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

export function loginResultDTOToUser(res: LoginResultDTO):User{
    return {...res.user, token: res.token};
}   
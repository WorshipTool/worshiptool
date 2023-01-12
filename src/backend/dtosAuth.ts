import User from "../models/user"

export interface LoginRequestDTO{
    email: string,
    password: string
}

export interface LoginResultDTO{
    user: User,
    token: string
}

export function loginResultDTOToUser(res: LoginResultDTO):User{
    return {...res.user, token: res.token};
}   
import User from "../models/user"

export interface loginRequestDTO{
    email: string,
    password: string
}

export interface loginResultDTO{
    success: boolean,
    user: {
        name: string,
        isAdmin: boolean
    },
    token: string
}

export function loginResultDTOToUser(res: loginResultDTO):User{
    return {...res.user, token: res.token};
}   
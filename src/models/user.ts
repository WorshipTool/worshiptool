export enum ROLES {
    "User",
    "Trustee",
    "Loader",
    "Admin"
}

export default interface User{
    guid: string,
    firstName: string,
    lastName: string,
    email: string,
    role: ROLES,
    token: string
}
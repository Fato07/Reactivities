export interface IUser{
    userName: string;
    displayName: string;
    token: string;
    image?: string;
}

export interface IUserFormValues{
    userName?: string;
    displayName?: string;
    password: string;
    email: string;
}
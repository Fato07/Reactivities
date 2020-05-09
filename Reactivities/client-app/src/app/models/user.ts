export interface IUser{
    username: string;
    displayName: string;
    token: string;
    image?: string;
}

export interface IUserFormValues{
    username?: string;
    displayName?: string;
    password: string;
    email: string;
}
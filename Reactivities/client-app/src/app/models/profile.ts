export interface IProfile{
    displayName: string,
    username: string,
    bio: string,
    image: string,
    following: boolean, //weather the currently logged in user is following the Profile being looked at
    followersCount: number,
    followingCount: number,
    photos: IPhoto[]
}


export interface IPhoto {
    id: string,
    imageUrl: string,
    isMain: boolean
}

export interface IUserActivity{
    id: string,
    title: string,
    category: string,
    date: Date
}
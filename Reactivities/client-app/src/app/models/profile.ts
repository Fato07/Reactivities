export interface IProfile{
    displayName: string,
    username: string,
    bio: string,
    image: string,
    photos: IPhoto[]
}


export interface IPhoto {
    id: string,
    imageUrl: string,
    isMain: boolean
}

//Mapped with Respect to ActivityDTO in API
export interface IActivity{
    activityId: string;
    title: string;
    description: string;
    category: string;
    date: Date;
    city: string;
    venue: string;
    isGoing: boolean;
    isHost: boolean;
    userActivities: IAttendee[]; 
    comments: IComment[];
}

export interface IActivityFormValues extends Partial<IActivity>{
    time?: Date
}

export class ActivityFormValues implements IActivityFormValues{
    activityId?: string = undefined;
    title: string = "";
    category: string = "";
    description: string = "";
    date?: Date = undefined;
    time?: Date = undefined;
    city: string = "";
    venue: string = "";

    constructor(init?: IActivityFormValues){
        if(init && init.date){
            init.time = init.date
        }
        Object.assign(this, init)
    }
}

//Mapped with Respect to AttendeeDTO in API
export interface IAttendee {
    username: string;
    displayName: string;
    image: string;
    isHost: boolean;
}

//Mapped with Respect to CommentDTO in API
export interface IComment{
    commentId: string;
    createdAt: Date;
    body: string;
    username: string;
    displayName: string;
    imageUrl: string;    
}
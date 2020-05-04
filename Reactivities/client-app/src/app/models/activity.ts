
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

export interface IAttendee {
    userName: string;
    displayName: string;
    image: string;
    isHost: boolean;
}
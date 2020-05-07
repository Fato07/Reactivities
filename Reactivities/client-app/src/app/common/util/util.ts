import { IUser } from "./../../models/user";
import { IActivity, IAttendee } from "./../../models/activity";
export const CombineDateAndTime = (date: Date, time: Date) => {
  const timeString = time.getHours() + ":" + time.getMinutes() + ":00";

  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();
  const dateString = `${year}-${month}-${day}`;

  return new Date(dateString + " " + timeString);
};

export const SetActivityProps = (activity: IActivity, user: IUser) => {
  activity.date = new Date(activity.date);
  activity.isGoing = activity.userActivities.some(
    (a) => a.userName === user.userName
  );

  activity.isHost = activity.userActivities.some(
    (a) => a.userName === user.userName && a.isHost
  );
  return activity;
};

export const createAttendee = (user: IUser): IAttendee => {

    return{
        displayName: user.displayName,
        isHost: false,
        userName: user.userName,
        image: user.image!

    }

}
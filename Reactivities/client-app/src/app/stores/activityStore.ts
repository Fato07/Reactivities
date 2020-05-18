import { createAttendee, setActivityProps } from "./../common/util/util";
import { RootStore } from "./rootStore";
import { IActivity } from "./../models/activity";
import { observable, action, computed, runInAction, reaction, toJS } from "mobx";
import { SyntheticEvent } from "react";
import agent from "../api/agent";
import { history } from "../..";
import { toast } from "react-toastify";
import {
  HubConnection,
  HubConnectionBuilder,
  LogLevel,
} from "@microsoft/signalr";

const LIMIT = 2;

export default class ActivityStore {
  rootStore: RootStore;
  constructor(rootStore: RootStore) {
    this.rootStore = rootStore;


    reaction(
      () => this.predicate.keys(),
      () => {
        this.page = 0;
        this.activityRegistry.clear();
        this.loadActivities();
      }
    )
  }

  @observable activityRegistry = new Map();
  @observable activity: IActivity | null = null;
  @observable loadingInitial = false;
  @observable submitting = false;
  @observable target = "";
  @observable loading = false;
  @observable.ref hubConnection: HubConnection | null = null;
  @observable activityCount = 0;
  @observable page = 0;
  @observable predicate = new Map();

  @action setPredicate =(predicate: string, value: string | Date) => {
    this.predicate.clear();
    if(predicate !== 'all') {
      this.predicate.set(predicate, value);
    }
  }

  @computed get axiosParams(){
    //defines methods to work with the query string of a URL
    const params = new URLSearchParams();
    params.append('limit', String(LIMIT));
    params.append('offset', `${this.page ? this.page * LIMIT: 0}`);
    this.predicate.forEach((value, key) => {
      if(key === 'startDate'){
        params.append(key, value.toISOString())
      }
      else{
        params.append(key, value)
      }  
    })
    return params
  }

  @computed get totalPages() {
    return Math.ceil(this.activityCount / LIMIT);
  }

  @action setPage = (page: number) => {
    this.page = page;
  };

  @action createHubConnection = (activityId: string) => {
    this.hubConnection = new HubConnectionBuilder()
      .withUrl(process.env.REACT_APP_API_CHAT_URL!, {
        accessTokenFactory: () => this.rootStore.commonStore.token!,
      })
      .configureLogging(LogLevel.Information)
      .build();

    this.hubConnection
      .start()
      .then(() => console.log(this.hubConnection!.state))
      .then(() => {
        console.log("Attempting to join group");
        if (this.hubConnection!.state === "Connected") {
          this.hubConnection!.invoke("AddToGroup", activityId);
        }
      })
      .catch((error) => console.log("Error Establishing connection:", error));

    //Spelling Is Important here because its related to chatHub in ServerSide
    this.hubConnection.on("RecieveComment", (comment) => {
      runInAction(() => {
        this.activity!.comments.push(comment);
      });
    });

    this.hubConnection.on("Send", (message) => {
      toast.info(message);
    });
  };

  @action stopHubConnection = () => {
    this.hubConnection!.invoke("RemoveFromGroup", this.activity!.activityId)
      .then(() => {
        this.hubConnection!.stop();
      })
      .then(() => console.log("Connection Stopped"))
      .catch((err) => console.log(err));
  };

  @action addComment = async (values: any) => {
    values.activityId = this.activity!.activityId;
    try {
      //The Name 'SendComment' needs to match excatly with the name of the method in API ChatHub
      await this.hubConnection!.invoke("SendComment", values);
    } catch (error) {
      console.log(error);
    }
  };

  @computed get activitiesByDate() {
    return this.groupActivitiesByDate(
      Array.from(this.activityRegistry.values())
    );
  }

  groupActivitiesByDate(activities: IActivity[]) {
    const sortedActivities = [...activities].sort(
      (a, b) => a.date.getTime() - b.date.getTime()
    );

    return Object.entries(
      sortedActivities.reduce((activities, activity) => {
        const date = activity.date.toISOString().split("T")[0];
        activities[date] = activities[date]
          ? [...activities[date], activity]
          : [activity];
        return activities;
      }, {} as { [key: string]: IActivity[] })
    );
  }

  @action loadActivities = async () => {
    this.loadingInitial = true;

    try {
      const activitiesEnvelope = await agent.Activities.list(this.axiosParams);
      const { activities, activityCount } = activitiesEnvelope;
      runInAction("loading activities", () => {
        activities.forEach((activity) => {
          setActivityProps(activity, this.rootStore.userStore.user!);
          this.activityRegistry.set(activity.activityId, activity);
        });
        this.activityCount = activityCount;
        this.loadingInitial = false;
      });
    } catch (error) {
      runInAction("loading activities error", () => {
        this.loadingInitial = false;
      });
      console.log(error);
    }
  };

  @action loadActivity = async (activityId: string) => {

    //Load Acitivity From Cache and return it (This is returned as a JS Object)
    //if not in cache, then get the activity from The API and return it(This is returned a JS Object).
    let activity = this.getActivity(activityId);
    if (activity) {
      this.activity = activity;

      //toJS, a property in mobx to convert observables to plain JS objects
      return toJS(activity);
    } else {
      this.loadingInitial = true;
      try {
        activity = await agent.Activities.details(activityId);
        runInAction("getting activity", () => {
          activity.date = new Date(activity.date);
          this.activity = activity;
          this.activityRegistry.set(activity.id, activity);
          this.loadingInitial = false;
        });
        return activity;
      } catch (error) {
        runInAction("get activity error", () => {
          this.loadingInitial = false;
        });
        console.log(error);
      }
    }
  };

  @action clearActivity = () => {
    this.activity = null;
  };

  getActivity(id: string) {
    return this.activityRegistry.get(id);
  }

  @action createActivity = async (activity: IActivity) => {
    this.submitting = true;
    try {
      await agent.Activities.create(activity);
      const attendee = createAttendee(this.rootStore.userStore.user!);
      attendee.isHost = true;
      let attendees = [];
      attendees.push(attendee);
      activity.userActivities = attendees;
      activity.comments = [];
      activity.isHost = true;
      runInAction("creating actvity", () => {
        this.activityRegistry.set(activity.activityId, activity);
        this.submitting = false;
      });
      history.push(`/activities/${activity.activityId}`);
    } catch (error) {
      runInAction("creatingActivity error", () => {});
      toast.error("Problem submitting data");
      console.log(error.response);
    }
  };

  @action editActivity = async (activity: IActivity) => {
    this.submitting = true;
    try {
      await agent.Activities.update(activity);
      runInAction("editing activity", () => {
        this.activityRegistry.set(activity.activityId, activity);
        this.activity = activity;
        this.submitting = false;
      });
      history.push(`/activities/${activity.activityId}`);
    } catch (error) {
      runInAction("editing activity error", () => {
        this.submitting = false;
      });
      toast.error("Problem submitting data");
      console.log(error);
    }
  };

  @action deleteActivity = async (
    event: SyntheticEvent<HTMLButtonElement>,
    activityId: string
  ) => {
    this.submitting = true;
    this.target = event.currentTarget.name;
    try {
      await agent.Activities.delete(activityId);

      runInAction("deleting activit", () => {
        this.activityRegistry.delete(activityId);
        this.submitting = false;
        this.target = "";
      });
    } catch (error) {
      runInAction("deleting activity error", () => {
        this.submitting = false;
        this.target = "";
      });
      console.log(error);
    }
  };

  @action attendActivity = async () => {
    const attendee = createAttendee(this.rootStore.userStore.user!);
    this.loading = true;
    try {
      await agent.Activities.attend(this.activity!.activityId);
      runInAction(() => {
        if (this.activity) {
          this.activity.userActivities.push(attendee);
          this.activity.isGoing = true;
          this.activityRegistry.set(this.activity.activityId, this.activity);
          this.loading = false;
        }
      });
    } catch (error) {
      runInAction(() => {
        this.loading = false;
      });
      toast.error("Problem Signing Up to Activity");
    }
  };

  @action cancelAttendance = async () => {
    this.loading = true;
    try {
      await agent.Activities.unattend(this.activity!.activityId);
      runInAction(() => {
        if (this.activity) {
          //gets an array of all attenddes apart of the currently logged in User
          this.activity.userActivities = this.activity.userActivities.filter(
            (a) => a.username !== this.rootStore.userStore.user!.username
          );

          this.activity.isGoing = false;
          this.activityRegistry.set(this.activity.activityId, this.activity);
          this.loading = false;
        }
      });
    } catch (error) {
      runInAction(() => {
        this.loading = false;
      });
      toast.error("Problem Cancelling attendance");
    }
  };
}

import { IProfile, IPhoto } from "./../models/profile";
import { IUser, IUserFormValues } from "./../models/user";
import { IActivity } from "./../models/activity";
import axios, { AxiosResponse } from "axios";
import { setTimeout } from "timers";
import { history } from "../..";
import { toast } from "react-toastify";

axios.defaults.baseURL = "https://localhost:5001/api";
axios.interceptors.request.use(
  (config) => {
    const token = window.localStorage.getItem("jwt");
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

axios.interceptors.response.use(undefined, (error) => {
  if (error.message === "Network Error" && !error.response) {
    toast.error("Network error - make sure API is running!");
  }
  const { status, data, config } = error.response;
  if (status === 404) {
    history.push("/notfound");
  }
  if (
    status === 400 &&
    config.method === "get" &&
    data.errors.hasOwnProperty("id")
  ) {
    history.push("/notfound");
  }
  if (status === 500) {
    toast.error("Server error - check the terminal for more info!");
  }
  throw error.response;
});

const responseBody = (response: AxiosResponse) => response.data;

const sleep = (ms: number) => (response: AxiosResponse) =>
  new Promise<AxiosResponse>((resolve) =>
    setTimeout(() => resolve(response), ms)
  );

const requests = {
  get: (url: string) => axios.get(url).then(sleep(800)).then(responseBody),
  post: (url: string, body: {}) =>
    axios.post(url, body).then(sleep(800)).then(responseBody),
  put: (url: string, body: {}) =>
    axios.put(url, body).then(sleep(800)).then(responseBody),
  del: (url: string) => axios.delete(url).then(sleep(800)).then(responseBody),
  postFrom: (url: string, file: Blob) => {
    let formData = new FormData();
    formData.append("File", file);
    return axios
      .post(url, formData, {
        headers: { "Content-type": "multipart/form-data" },
      })
      .then(responseBody);
  },
};

const Activities = {
  list: (): Promise<IActivity[]> => requests.get("/activities"),
  details: (actvityId: string) => requests.get(`/activities/${actvityId}`),
  create: (activity: IActivity) => requests.post("/activities", activity),
  update: (activity: IActivity) =>
    requests.put(`/activities/${activity.activityId}`, activity),
  delete: (activityId: string) => requests.del(`/activities/${activityId}`),
  attend: (activityId: string) =>
    requests.post(`/activities/${activityId}/attend`, {}),
  unattend: (activityId: string) =>
    requests.del(`/activities/${activityId}/attend`),
};

const User = {
  current: (): Promise<IUser> => requests.get("/user"),
  login: (user: IUserFormValues): Promise<IUser> =>
    requests.post(`/user/login`, user),
  register: (user: IUserFormValues): Promise<IUser> =>
    requests.post(`/user/register`, user),
};

const Profiles = {
  get: (username: string): Promise<IProfile> =>
    requests.get(`/profiles/${username}`),
  uploadPhoto: (photo: Blob): Promise<IPhoto> =>
    requests.postFrom(`/photos`, photo),
};

export default {
  Activities,
  User,
  Profiles,
};

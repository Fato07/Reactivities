import { IActivity } from './../models/activity';
import axios, { AxiosResponse } from 'axios';
import { setTimeout } from 'timers';


axios.defaults.baseURL = 'https://localhost:5001/api';

const responseBody = (response: AxiosResponse) => response.data;
const sleep = (ms: number) => (response: AxiosResponse) => 
new Promise<AxiosResponse>(resolve=> setTimeout(()=> resolve(response), ms))

const requests = {
    get: (url: string) => axios.get(url).then(sleep(800)).then(responseBody),
    post: (url: string, body: {}) => axios.post(url, body).then(sleep(800)).then(responseBody),
    put: (url: string, body: {}) => axios.put(url, body).then(sleep(800)).then(responseBody),
    del: (url: string) => axios.delete(url).then(sleep(800)).then(responseBody)
}

const Activities = {
    list: (): Promise<IActivity[]> => requests.get('/activities'),
    details: (actvityId: string) => requests.get(`/activities/${actvityId}`),
    create: (activity: IActivity) => requests.post('/activities', activity),
    update: (activity: IActivity) => requests.put(`/activities/${activity.activityId}`, activity),
    delete: (activityId: string) => requests.del(`/activities/${activityId}`),

}

export default {
    Activities
}
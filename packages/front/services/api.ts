import axios from 'axios';
import { getRefreshToken } from './auth';

export const API_URL = `${
  process.env.NEXT_PUBLIC_BC_ENV !== 'production' ? 'http://' : 'https://'
}${process.env.NEXT_PUBLIC_API_URL}:${process.env.NEXT_PUBLIC_API_PORT}`;

export const publicApi = axios.create({
  baseURL: API_URL,
  timeout: 5000,
  headers: {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*'
  }
});

const privateApiWithCred = publicApi;
privateApiWithCred.defaults.withCredentials = true;

function isTokenExpiredError(errorResponse: any): boolean {
  return errorResponse ? errorResponse.status === 401 : false;
}

function onAccessTokenFetched() {
  // When the refresh is successful, we start retrying the requests one by one and empty the queue
  subscribers.forEach((callback) => callback());
  subscribers = [];
}

function addSubscriber(callback: any) {
  subscribers.push(callback);
}

let isAlreadyFetchingAccessToken = false;

// This is the list of waiting requests that will retry after the JWT refresh complete
let subscribers: Array<any> = [];

async function refreshTokenAndReattemptRequest(error: any) {
  try {
    const { response: errorResponse } = error;
    const refreshToken = getRefreshToken();
    console.log(refreshToken);
    if (!refreshToken) {
      return Promise.reject(error);
    }

    const retryOriginalRequest = new Promise((resolve) => {
      addSubscriber((accessToken: string) => {
        resolve(privateApiWithCred(errorResponse.config));
      });
    });

    if (!isAlreadyFetchingAccessToken) {
      isAlreadyFetchingAccessToken = true;
      await privateApiWithCred.get('/auth/refreshToken');
      isAlreadyFetchingAccessToken = false;
      onAccessTokenFetched();
    }
    return retryOriginalRequest;
  } catch (err) {
    return Promise.reject(err);
  }
}

privateApiWithCred.interceptors.response.use(
  (response) => response,
  (error) => {
    const errorResponse = error.response;
    if (isTokenExpiredError(errorResponse)) {
      return refreshTokenAndReattemptRequest(error);
    }
    console.log(errorResponse);
  }
);

export const privateApi = privateApiWithCred;

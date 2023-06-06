import axios from 'axios';
import Cookies from 'js-cookie';
import { getRefreshToken } from '../../front/services/auth';

export const API_URL = `${process.env.NEXT_PUBLIC_API_URL}`;

export const publicApi = axios.create({
  baseURL: API_URL,
  timeout: 5000,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
});

const privateApiWithCred = publicApi;
privateApiWithCred.defaults.withCredentials = true;

function isTokenExpiredError(errorResponse: any): boolean {
  return errorResponse
    ? errorResponse.status === 401 && errorResponse.data.message === 'ACCESS_TOKEN_EXPIRED'
    : false;
}

function isRefreshTokenExpiredError(errorResponse: any): boolean {
  return errorResponse
    ? errorResponse.status === 401 && errorResponse.data.message === 'REFRESH_TOKEN_EXPIRED'
    : false;
}

function isNoTokenError(errorResponse: any): boolean {
  return errorResponse
    ? errorResponse.status === 401 && errorResponse.data.message === 'NO_TOKEN_PROVIDED'
    : false;
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

    const retryOriginalRequest = new Promise((resolve) => {
      addSubscriber(() => {
        resolve(privateApiWithCred(errorResponse.config));
      });
    });

    if (!isAlreadyFetchingAccessToken) {
      isAlreadyFetchingAccessToken = true;
      const refreshToken = await getRefreshToken();
      if (!refreshToken) {
        return Promise.reject(error);
      }
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
    if (isRefreshTokenExpiredError(errorResponse) || isNoTokenError(errorResponse)) {
      Cookies.remove('authenticated');
      privateApiWithCred.get('/auth/logout');
      return Promise.reject(error);
    }
    return Promise.reject(error);
  }
);

export const privateApi = privateApiWithCred;

